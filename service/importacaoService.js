/*
  SERVICE de importacao de planilhas de participantes

    CSV (de outro sistema)  --carregarPlanilha-->  cabplanilhas / detplanilhas  (conferencia e correcao)
    detplanilhas (status 0) --processarPlanilha--> participantesv2

  Garantias:
    - Nenhum estado compartilhado entre requisicoes: tudo e local a cada chamada.
    - Carga e processamento sao ATOMICOS (uma transacao): ou entra tudo, ou nao entra nada.
    - Nenhuma linha do arquivo some em silencio. Linha que nao pode ser aproveitada vira linha COM ERRO
      (status 9) para o usuario corrigir; se o arquivo todo estiver fora do padrao, a importacao e
      recusada inteira e explica por que.
    - Trava por evento (advisory lock): duas importacoes/processamentos do mesmo evento nunca rodam juntos.
    - Todo SQL usa parametros (nada de concatenar texto do arquivo no SQL).

  Formato do CSV (separador ";", a 1a linha e o cabecalho e e ignorada):
    0 inscricao | 1 nome | 2 <sexo><sigla da categoria> | 3 data de nascimento (DD/MM/AAAA) | 4 CPF/CNPJ | 5 numero do peito

  Numero do peito: unico DENTRO DO EVENTO. Em branco = gerado automaticamente pelo contador da categoria
  (ver peitoService). Informado e ja existente no evento = linha com erro.

  CPF/CNPJ: precisa existir (em branco = linha com erro). Completado com zeros a esquerda se necessario, mas
  NAO e validado como recusa: digito verificador errado gera apenas um AVISO na linha (status 1, processavel), pois
  se o outro sistema aceitou o documento nos nao recusamos.

  mensagem_erro das linhas: erro (status 9) comeca com "Linha N: ..."; aviso (status 1) comeca com "Aviso (linha N): ...".

  status da linha (detplanilhas): 0 = ok | 1 = ok com aviso | 9 = com erro | 2 = ja processada
  status da planilha (cabplanilhas): '1' = carregada | '2' = processada
  status do evento: '1' = liberado para importacao | '2' = apos o processamento
*/
const db = require("../infra/database");
const parse = require("../util/ParseCSV");
const shared = require("../util/shared");
const peitoSrv = require("./peitoService");

const NUM_COLUNAS = 6;
const LIMITE_LINHAS_FORA_DO_PADRAO = 10; // acima disso o arquivo e considerado errado e recusado
const TAMANHO_LOTE = 500;
const MAX_MENSAGEM = 100; // detplanilhas.mensagem_erro e varchar(100)

class ErroImportacao extends Error {
  constructor(status, message, detalhes) {
    super(message);
    this.name = "ErroImportacao";
    this.status = status;
    this.detalhes = detalhes;
  }
}

/* ======================= funcoes puras (testaveis sem banco) ======================= */

function texto(v) {
  return String(v ?? "").replace(/\r?\n|\r/g, " ").trim();
}

function truncar(msg, max) {
  return msg.length <= max ? msg : msg.slice(0, max - 3) + "...";
}

/* inteiro > 0 (so digitos) ou 0 */
function inteiroPositivo(v) {
  const s = texto(v);
  if (!/^\d+$/.test(s)) return 0;
  const n = Number(s);
  return Number.isSafeInteger(n) && n > 0 && n <= 2147483647 ? n : 0;
}

/* DD/MM/AAAA (aceita D/M/AAAA e devolve com zeros) ou "" se invalida */
function normalizaData(v) {
  const s = texto(v);
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (!m || !shared.isValidDate(s)) return "";
  return `${m[1].padStart(2, "0")}/${m[2].padStart(2, "0")}/${m[3]}`;
}

/* "DD/MM/AAAA" -> "AAAA-MM-DD" (a data ja foi validada na carga); "" se nao conseguir */
function dataIso(v) {
  const s = texto(v);
  let m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (m) return shared.isValidDate(s) ? `${m[3]}-${m[2]}-${m[1]}` : "";
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return "";
}

/* O Excel remove o zero a esquerda: CPF com menos de 11 digitos e completado; CNPJ com 12 ou 13, tambem */
function normalizaDocumento(v) {
  let d = shared.limparCnpj_Cpf(texto(v));
  if (d.length > 0 && d.length < 11) d = d.padStart(11, "0");
  else if (d.length === 12 || d.length === 13) d = d.padStart(14, "0");
  return d;
}

function lerLinhas(conteudo) {
  const linhas = String(conteudo ?? "").replace(/^﻿/, "").split(/\r\n|\n|\r/);
  // a quebra de linha FINAL do arquivo nao abre uma linha nova
  if (linhas.length > 0 && linhas[linhas.length - 1] === "") linhas.pop();
  return linhas;
}

/* vazia, so espacos ou so delimitadores (";;;;;") */
function ehLinhaVazia(linha) {
  return linha.replace(/[;\s]/g, "") === "";
}

/*
  Valida UMA linha ja separada em campos. Nao toca em nenhum estado externo.
  ctx.categorias: Map(SIGLA -> id da categoria)
*/
function validarLinha(campos, ctx) {
  const erros = [];

  // peito em BRANCO = gerar automaticamente (pelo contador da categoria); preenchido e invalido = erro
  const peitoBruto = texto(campos[5]);
  const gerarPeito = peitoBruto === "";
  const nro_peito = inteiroPositivo(peitoBruto);
  if (!gerarPeito && !nro_peito) erros.push("Nro Do Peito Inválido");
  const inscricao = inteiroPositivo(campos[0]);

  const sexoSigla = texto(campos[2]);
  const sigla = sexoSigla.substring(1).toUpperCase();
  let sexo = sexoSigla.charAt(0).toUpperCase();
  if (sexo !== "M" && sexo !== "F") {
    sexo = "";
    erros.push("Sexo Inválido");
  }

  let id_categoria = ctx.categorias.get(sigla);
  if (!id_categoria) {
    id_categoria = 0;
    erros.push(`Categoria (${sigla}) Não Cadastrada`);
  }

  let nome = texto(campos[1]).toUpperCase();
  if (nome === "") erros.push("Nome Em Branco");
  else if (nome.length > 60) {
    nome = nome.slice(0, 60);
    erros.push("Nome Maior Que 60 Caracteres");
  }

  const data_nasc = normalizaData(campos[3]);
  if (data_nasc === "") erros.push("Data Nascimento Inválida");

  // CPF/CNPJ: PRECISA EXISTIR (em branco ou sem digitos = erro). Nao e recusado por digito verificador errado:
  // se o outro sistema aceitou, nos tambem aceitamos, mas a linha ganha um AVISO.
  const avisos = [];
  let cnpj_cpf = normalizaDocumento(campos[4]);
  if (cnpj_cpf === "") {
    erros.push("CPF/CNPJ Em Branco");
  } else if (cnpj_cpf.length > 14) {
    cnpj_cpf = cnpj_cpf.slice(0, 14); // a coluna so comporta 14 digitos
    avisos.push("CPF/CNPJ Com Mais De 14 Dígitos (Cortado)");
  } else if (!shared.isValidCnpjCpf(cnpj_cpf)) {
    avisos.push("CPF/CNPJ Inválido");
  }

  return { nro_peito, gerarPeito, inscricao, sexo, id_categoria, nome, data_nasc, cnpj_cpf, erros, avisos };
}

/* status e mensagem de cada linha a partir dos erros acumulados (pode ser chamada de novo apos novos erros) */
function finalizarRegistros(registros) {
  for (const r of registros) {
    const avisos = r.avisos || [];
    // 9 = erro | 1 = OK com aviso (processavel, filtravel na tela) | 0 = OK
    r.status = r.erros.length > 0 ? 9 : avisos.length > 0 ? 1 : 0;
    let msg = "";
    if (r.erros.length > 0) {
      msg = `Linha ${r.linha}: ${r.erros.join("; ")}`;
      if (avisos.length > 0) msg += ` | Aviso: ${avisos.join("; ")}`;
    } else if (avisos.length > 0) {
      msg = `Aviso (linha ${r.linha}): ${avisos.join("; ")}`;
    }
    r.mensagem_erro = truncar(msg, MAX_MENSAGEM);
  }
}

/*
  Le o arquivo inteiro e devolve os registros prontos para gravar (um por linha de dados).
  Linhas que nao podem ser aproveitadas (peito invalido/repetido, colunas a menos) entram como
  linhas com erro e recebem um numero de peito PROVISORIO NEGATIVO (o peito faz parte da chave
  da tabela, entao precisa ser unico dentro da planilha).
*/
function analisarArquivo(conteudo, ctx) {
  const linhas = lerLinhas(conteudo);
  const registros = [];
  const vistos = new Map(); // nro_peito -> numero da linha onde apareceu
  let provisorio = 0;
  let ignoradas = 0;
  let foraDoPadrao = 0;

  for (let i = 1; i < linhas.length; i++) {
    const nroLinha = i + 1;
    const linha = linhas[i];
    if (ehLinhaVazia(linha)) {
      ignoradas++;
      continue;
    }

    let campos;
    try {
      campos = parse.ParseCVS("", linha, ";");
    } catch {
      campos = [];
    }

    let reg;
    if (campos.length < NUM_COLUNAS) {
      foraDoPadrao++;
      reg = {
        nro_peito: --provisorio, gerarPeito: false, inscricao: 0, sexo: "", id_categoria: 0, nome: "", data_nasc: "", cnpj_cpf: "",
        erros: [`${campos.length} coluna(s), o padrão é ${NUM_COLUNAS}`], avisos: [],
      };
    } else {
      reg = validarLinha(campos, ctx);
      if (reg.nro_peito) {
        if (vistos.has(reg.nro_peito)) {
          reg.erros.push(`Nro Do Peito ${reg.nro_peito} Repetido (linha ${vistos.get(reg.nro_peito)})`);
          reg.nro_peito = --provisorio;
        } else {
          vistos.set(reg.nro_peito, nroLinha);
        }
      } else if (!reg.gerarPeito) {
        reg.nro_peito = --provisorio; // invalido: provisorio. Em branco: fica 0 ate o numero ser gerado
      }
    }

    reg.linha = nroLinha;
    registros.push(reg);
  }
  finalizarRegistros(registros);

  if (foraDoPadrao > LIMITE_LINHAS_FORA_DO_PADRAO) {
    throw new ErroImportacao(
      422,
      `Arquivo fora do padrão: ${foraDoPadrao} linhas com número de colunas diferente de ${NUM_COLUNAS} (o limite é ${LIMITE_LINHAS_FORA_DO_PADRAO}). Nada foi importado.`,
    );
  }
  if (registros.length === 0) {
    throw new ErroImportacao(422, "A planilha não contém linhas de dados. Nada foi importado.");
  }
  return { registros, ignoradas };
}

/*
  Segunda etapa da analise, com o que ja existe no evento:
    1. peito informado que JA esta em uso no evento (participante ou outra planilha) -> linha com erro, peito provisorio;
    2. peito em branco -> numero gerado pelo contador da categoria (pulando os usados). Linha sem categoria valida
       nao tem como gerar: fica com erro e peito provisorio.
  `usados` e o Set de numeros em uso no evento; `alocar(id_categoria, quantidade, usados)` devolve os numeros novos.
  Devolve quantos numeros foram gerados.
*/
async function resolverPeitos(registros, usados, alocar) {
  let provisorio = Math.min(0, ...registros.map((r) => r.nro_peito));

  for (const r of registros) {
    if (r.nro_peito > 0) {
      if (usados.has(r.nro_peito)) {
        r.erros.push(`Nro Do Peito ${r.nro_peito} Já Existe No Evento`);
        r.nro_peito = --provisorio;
      } else {
        usados.add(r.nro_peito); // reserva: a geracao automatica nao pode reaproveitar um numero do proprio arquivo
      }
    }
  }

  const porCategoria = new Map();
  for (const r of registros) {
    if (!r.gerarPeito || r.nro_peito > 0) continue;
    if (!r.id_categoria) {
      r.nro_peito = --provisorio; // o erro da categoria ja esta na linha
      continue;
    }
    if (!porCategoria.has(r.id_categoria)) porCategoria.set(r.id_categoria, []);
    porCategoria.get(r.id_categoria).push(r);
  }

  let gerados = 0;
  for (const [categoria, linhas] of porCategoria) {
    const numeros = await alocar(categoria, linhas.length, usados);
    linhas.forEach((r, i) => {
      r.nro_peito = numeros[i];
      r.peitoGerado = true;
    });
    gerados += linhas.length;
  }

  finalizarRegistros(registros);
  return gerados;
}

/* ======================= banco ======================= */

let colunasDet = null;
let colunasPart = null;

function conjuntos() {
  const pgp = db.$config.pgp;
  const H = pgp.helpers;
  if (!colunasDet) {
    colunasDet = new H.ColumnSet(
      ["id_empresa", "id_evento", "id_cabec", "cnpj_cpf", "nome", "estrangeiro", "sexo", "data_nasc", "inscricao",
       "nro_peito", "id_categoria", "id_inscrito", "status", "mensagem_erro", "user_insert", "user_update"],
      { table: "detplanilhas" },
    );
    colunasPart = new H.ColumnSet(
      ["id_empresa", "id_evento", "id_entrega", "inscricao", "nro_peito", "id_categoria", "cnpj_cpf", "nome", "sexo",
       { name: "data_nasc", cast: "date" }, "origem", "user_insert", "user_update"],
      { table: "participantesv2" },
    );
  }
  return { H, colunasDet, colunasPart };
}

async function inserirEmLotes(t, linhas, colunas, H) {
  for (let i = 0; i < linhas.length; i += TAMANHO_LOTE) {
    await t.none(H.insert(linhas.slice(i, i + TAMANHO_LOTE), colunas));
  }
}

/* serializa importacao/processamento do MESMO evento; quem chega depois recebe 409 na hora */
async function bloquearEvento(t, id_empresa, id_evento) {
  const r = await t.one("SELECT pg_try_advisory_xact_lock($1, $2) AS ok", [id_empresa, id_evento]);
  if (!r.ok) {
    throw new ErroImportacao(409, "Já existe uma importação ou processamento em andamento para este evento. Aguarde terminar e tente novamente.");
  }
}

/* ------------------------------ carga ------------------------------ */
async function carregarPlanilha({ id_empresa, id_usuario, id_evento, arquivo, conteudo }) {
  if (!Number.isInteger(id_evento) || id_evento <= 0) throw new ErroImportacao(400, "Código do evento inválido.");
  if (!arquivo) throw new ErroImportacao(400, "Arquivo não informado.");

  // analisa ANTES de abrir transacao: arquivo ruim nem chega a pegar trava
  const categorias = new Map(
    (await db.any("SELECT id, sigla FROM categorias WHERE id_empresa = $1 ORDER BY id DESC", [id_empresa]))
      .map((c) => [String(c.sigla).trim().toUpperCase(), c.id]), // ORDER BY id DESC: se houver siglas repetidas, vale a de menor id
  );
  const { registros, ignoradas } = analisarArquivo(conteudo, { categorias });

  const { H, colunasDet } = conjuntos();

  return db.tx(async (t) => {
    await bloquearEvento(t, id_empresa, id_evento);

    const evento = await t.oneOrNone("SELECT id FROM eventos WHERE id_empresa = $1 AND id = $2", [id_empresa, id_evento]);
    if (!evento) throw new ErroImportacao(404, `Evento Nº ${id_evento} não existe.`);

    const repetida = await t.oneOrNone(
      "SELECT id FROM cabplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND arquivo = $3",
      [id_empresa, id_evento, arquivo],
    );
    if (repetida) throw new ErroImportacao(409, "Planilha já cadastrada para este evento.");

    // numeros de peito: conflitos com o evento e geracao automatica (dentro da trava do evento)
    const usados = await peitoSrv.usadosNoEvento(t, id_empresa, id_evento);
    const gerados = await resolverPeitos(registros, usados, (id_categoria, quantidade, set) =>
      peitoSrv.reservarNumeros(t, { id_empresa, id_evento, id_categoria, quantidade, usados: set, id_usuario }),
    );

    const cab = await t.one(
      `INSERT INTO cabplanilhas (id_empresa, id_evento, arquivo, total_linhas, linhas_processadas, total_linhas_erro, status, user_insert, user_update)
       VALUES ($1, $2, $3, 0, 0, 0, '1', $4, 0) RETURNING *`,
      [id_empresa, id_evento, arquivo, id_usuario],
    );

    const linhas = registros.map((r) => ({
      id_empresa, id_evento, id_cabec: cab.id,
      cnpj_cpf: r.cnpj_cpf, nome: r.nome, estrangeiro: "N", sexo: r.sexo, data_nasc: r.data_nasc,
      inscricao: r.inscricao, nro_peito: r.nro_peito, id_categoria: r.id_categoria, id_inscrito: 0,
      status: r.status, mensagem_erro: r.mensagem_erro, user_insert: id_usuario, user_update: 0,
    }));
    await inserirEmLotes(t, linhas, colunasDet, H);

    // os totais sao mantidos por trigger em detplanilhas: le de volta
    const final = await t.one("SELECT * FROM cabplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND id = $3", [id_empresa, id_evento, cab.id]);
    return {
      cabec: final,
      total_linhas: final.total_linhas,
      linhas_ok: registros.filter((r) => r.status !== 9).length, // OK = sem erro (inclui as com aviso)
      total_linhas_erro: final.total_linhas_erro,
      linhas_ignoradas: ignoradas,
      peitos_gerados: gerados,
      linhas_com_aviso: registros.filter((r) => (r.avisos || []).length > 0).length,
    };
  });
}

/* ------------------------------ processamento ------------------------------ */
async function processarPlanilha({ id_empresa, id_usuario, id_evento, id_planilha }) {
  if (!Number.isInteger(id_evento) || id_evento <= 0) throw new ErroImportacao(400, "Código do evento inválido.");
  if (!Number.isInteger(id_planilha) || id_planilha <= 0) throw new ErroImportacao(400, "Código da planilha inválido.");

  const { H, colunasPart } = conjuntos();

  return db.tx(async (t) => {
    await bloquearEvento(t, id_empresa, id_evento);

    // tudo e conferido DENTRO da trava: mesmo com dois cliques/duas abas so um processa
    const evento = await t.oneOrNone("SELECT id, status FROM eventos WHERE id_empresa = $1 AND id = $2 FOR UPDATE", [id_empresa, id_evento]);
    if (!evento) throw new ErroImportacao(404, "Evento não existe.");

    const cab = await t.oneOrNone(
      "SELECT * FROM cabplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND id = $3 FOR UPDATE",
      [id_empresa, id_evento, id_planilha],
    );
    if (!cab) throw new ErroImportacao(404, "Planilha não existe ou não pertence a este evento.");
    // a causa mais util primeiro: planilha ja processada (o evento passa a '2' justamente por isso)
    if (String(cab.status) !== "1") throw new ErroImportacao(409, "Esta planilha já foi processada.");
    if (String(evento.status) !== "1") {
      throw new ErroImportacao(409, "O evento precisa estar Liberado para importação para processar a planilha.");
    }

    const comErro = await t.one(
      "SELECT count(*)::int AS n FROM detplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND id_cabec = $3 AND status = 9",
      [id_empresa, id_evento, id_planilha],
    );
    if (comErro.n > 0) {
      throw new ErroImportacao(409, `A planilha possui ${comErro.n} linha(s) com erro. Corrija ou exclua essas linhas antes de processar.`);
    }

    const detalhes = await t.any(
      "SELECT * FROM detplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND id_cabec = $3 AND status IN (0, 1) ORDER BY nro_peito",
      [id_empresa, id_evento, id_planilha],
    );
    if (detalhes.length === 0) throw new ErroImportacao(409, "A planilha não contém linhas para processar.");

    // linhas editadas pela tela podem ter dado inconsistente: confere de novo, e recusa tudo se alguma estiver ruim
    const problemas = [];
    const participantes = detalhes.map((d) => {
      const iso = dataIso(d.data_nasc);
      if (iso === "") problemas.push(`Nº do peito ${d.nro_peito}: data de nascimento inválida (${d.data_nasc || "vazia"})`);
      if (d.nro_peito <= 0) problemas.push(`Linha com número de peito provisório (${d.nro_peito}) não pode ser processada`);
      if (texto(d.cnpj_cpf) === "") problemas.push(`Nº do peito ${d.nro_peito}: CPF/CNPJ em branco`);
      return {
        id_empresa, id_evento, id_entrega: 0, inscricao: d.inscricao, nro_peito: d.nro_peito, id_categoria: d.id_categoria,
        cnpj_cpf: d.cnpj_cpf, nome: texto(d.nome), sexo: d.sexo, data_nasc: iso, origem: "P", user_insert: id_usuario, user_update: 0,
      };
    });
    if (problemas.length > 0) {
      throw new ErroImportacao(422, `Existem ${problemas.length} linha(s) com dados inválidos. Nada foi processado.`, problemas.slice(0, 20));
    }

    // o peito e unico no evento: confere com quem ja esta la (ex.: outra planilha processada depois da carga desta)
    const conflitos = await t.any(
      `SELECT nro_peito, count(*) OVER () AS total FROM participantesv2
        WHERE id_empresa = $1 AND id_evento = $2 AND nro_peito = ANY($3) ORDER BY nro_peito LIMIT 20`,
      [id_empresa, id_evento, participantes.map((p) => p.nro_peito)],
    );
    if (conflitos.length > 0) {
      throw new ErroImportacao(
        409,
        `${conflitos[0].total} número(s) de peito desta planilha já estão em uso no evento. Nada foi processado.`,
        conflitos.map((c) => `Nº do peito ${c.nro_peito} já existe no evento`),
      );
    }

    await inserirEmLotes(t, participantes, colunasPart, H);

    await t.none(
      "UPDATE detplanilhas SET status = 2, user_update = $4 WHERE id_empresa = $1 AND id_evento = $2 AND id_cabec = $3 AND status IN (0, 1)",
      [id_empresa, id_evento, id_planilha, id_usuario],
    );
    const cabFinal = await t.one(
      "UPDATE cabplanilhas SET status = '2', user_update = $4 WHERE id_empresa = $1 AND id_evento = $2 AND id = $3 RETURNING *",
      [id_empresa, id_evento, id_planilha, id_usuario],
    );
    await t.none("UPDATE eventos SET status = '2', user_update = $3 WHERE id_empresa = $1 AND id = $2", [id_empresa, id_evento, id_usuario]);

    // CPF/CNPJ com digito verificador errado nao barra o processamento, mas e informado (conferir depois)
    const cpfInvalidos = participantes.filter((p) => !shared.isValidCnpjCpf(p.cnpj_cpf)).length;

    return { cabec: cabFinal, participantes_incluidos: participantes.length, participantes_com_cpf_invalido: cpfInvalidos };
  });
}

module.exports = {
  carregarPlanilha,
  processarPlanilha,
  ErroImportacao,
  // expostos para teste (sem banco)
  _interno: { analisarArquivo, resolverPeitos, finalizarRegistros, validarLinha, normalizaDocumento, normalizaData, dataIso, inteiroPositivo, ehLinhaVazia, lerLinhas, MAX_MENSAGEM },
};
