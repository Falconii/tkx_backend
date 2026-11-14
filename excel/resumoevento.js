/*
  RESUMO DO EVENTO (Excel com 2 abas)  -  sigla "resumoevento01"

    Aba "Participantes": um participante por linha, com os dados da retirada do kit (entrega).
    Aba "Resumos":       KITS (por tamanho) | COLABORADOR (kits por usuario) | CATEGORIAS | RESUMO GERAL

  Segue o mesmo esquema dos relatorios de cadastro: roda dentro da tarefa (tabela "tarefas"),
  grava em <arquivo>.tmp e so renomeia para o nome final quando estiver completo.

  As 2 abas tem a faixa com o logo e o titulo nas linhas 1-3 (excel/faixaLogo.js) e as linhas dos titulos
  ficam congeladas: Participantes = faixa + cabecalho (linha 4); Resumos = faixa + titulo e cabecalho dos blocos (linha 5).

  gerar(params, caminhoArquivo) -> numero de participantes (0 = evento sem participantes = "sem dados")
  params: { id_empresa, id_evento }   (id_empresa vem sempre da tarefa, nunca do cliente)
*/
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const db = require("../infra/database");
const faixaLogo = require("./faixaLogo");

const COR_CABEC = "FF3F51B5";
const COR_TOTAL = "FFE8EAF6";
const BORDA = { style: "thin", color: { argb: "FFBDBDBD" } };
const BORDAS = { top: BORDA, left: BORDA, bottom: BORDA, right: BORDA };

/* ---------- consultas (parametrizadas) ---------- */
const SQL_PARTICIPANTES = `
  select ev.descricao as evento, p.inscricao, p.nome, p.cnpj_cpf, p.data_nasc, p.sexo, p.nro_peito,
         cat.descricao as categoria, e.rg_retirada as kit_rg, e.nome_retirada as kit_nome,
         e.tam_camisa as kit_tam_camisa
    from participantesv2 p
    join eventos ev on ev.id_empresa = p.id_empresa and ev.id = p.id_evento
    left join categorias cat on cat.id_empresa = p.id_empresa and cat.id = p.id_categoria
    left join entregasv2 e on e.id_empresa = p.id_empresa and e.id_evento = p.id_evento and e.id = p.id_entrega
   where p.id_empresa = $1 and p.id_evento = $2
   order by p.nome, p.nro_peito`;

const SQL_KITS = `
  select coalesce(nullif(upper(btrim(tam_camisa)), ''), '(SEM TAMANHO)') as tam, count(*)::int as qtd
    from entregasv2 where id_empresa = $1 and id_evento = $2
   group by 1 order by 1`;

const SQL_COLABORADORES = `
  select coalesce(u.razao, '(USUÁRIO ' || e.user_insert || ')') as usuario, count(*)::int as qtd
    from entregasv2 e
    left join usuarios u on u.id_empresa = e.id_empresa and u.id = e.user_insert
   where e.id_empresa = $1 and e.id_evento = $2
   group by 1 order by 1`;

const SQL_CATEGORIAS = `
  select coalesce(cat.descricao, '(SEM CATEGORIA)') as categoria, count(*)::int as qtd
    from participantesv2 p
    join entregasv2 e on e.id_empresa = p.id_empresa and e.id_evento = p.id_evento and e.id = p.id_entrega
    left join categorias cat on cat.id_empresa = p.id_empresa and cat.id = p.id_categoria
   where p.id_empresa = $1 and p.id_evento = $2
   group by 1 order by 1`;

const SQL_TOTAIS = `
  select (select count(*)::int from participantesv2 where id_empresa = $1 and id_evento = $2) as participantes,
         (select count(*)::int from entregasv2 where id_empresa = $1 and id_evento = $2) as kits`;

/* ---------- formatacao ---------- */
function titulo(ws, ref, texto) {
  ws.mergeCells(ref);
  const c = ws.getCell(ref.split(":")[0]);
  c.value = texto;
  c.font = { bold: true, color: { argb: "FFFFFFFF" } };
  c.alignment = { horizontal: "center" };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR_CABEC } };
}

function cabecalho(ws, linha, colunaInicial, textos) {
  textos.forEach((t, i) => {
    const c = ws.getCell(linha, colunaInicial + i);
    c.value = t;
    c.font = { bold: true };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR_TOTAL } };
    c.border = BORDAS;
  });
}

/* escreve um bloco "rotulo | quantidade" a partir da coluna e da linha (topo) informadas; devolve o total */
function bloco(ws, colunaInicial, titulos, itens, topo) {
  const [c1, c2] = [colunaInicial, colunaInicial + 1];
  const letra = (n) => ws.getColumn(n).letter;
  titulo(ws, `${letra(c1)}${topo}:${letra(c2)}${topo}`, titulos.bloco);
  cabecalho(ws, topo + 1, c1, [titulos.rotulo, "QTD"]);

  const primeira = topo + 2;
  let linha = primeira;
  for (const it of itens) {
    ws.getCell(linha, c1).value = it.rotulo;
    ws.getCell(linha, c2).value = it.qtd;
    ws.getCell(linha, c1).border = BORDAS;
    ws.getCell(linha, c2).border = BORDAS;
    linha++;
  }
  const total = itens.reduce((s, i) => s + i.qtd, 0);
  ws.getCell(linha, c1).value = "TOTAL";
  ws.getCell(linha, c2).value = { formula: `SUM(${letra(c2)}${primeira}:${letra(c2)}${Math.max(linha - 1, primeira)})`, result: total };
  for (const col of [c1, c2]) {
    const c = ws.getCell(linha, col);
    c.font = { bold: true };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR_TOTAL } };
    c.border = BORDAS;
  }
  return total;
}

function abaParticipantes(wb, participantes, tituloBase) {
  const ws = wb.addWorksheet("Participantes");
  const colunas = [
    { header: "Evento", key: "evento", width: 32 },
    { header: "inscricao", key: "inscricao", width: 12 },
    { header: "nome", key: "nome", width: 44 },
    { header: "cnpj_cpf", key: "cnpj_cpf", width: 16 },
    { header: "data_nasc", key: "data_nasc", width: 13, style: { numFmt: "dd/mm/yyyy" } },
    { header: "sexo", key: "sexo", width: 7 },
    { header: "nro_peito", key: "nro_peito", width: 11 },
    { header: "categoria", key: "categoria", width: 20 },
    { header: "kit_rg", key: "kit_rg", width: 16 },
    { header: "kit_nome", key: "kit_nome", width: 28 },
    { header: "kit_tam_camisa", key: "kit_tam_camisa", width: 16 },
  ];
  // o cabecalho vai na linha 4 (abaixo da faixa); aqui so chave, largura e formato das colunas
  ws.columns = colunas.map(({ header, ...resto }) => resto);

  faixaLogo.aplicarFaixa(ws, { larguras: colunas.map((c) => c.width), titulo: `${tituloBase}   |   Participantes` });
  faixaLogo.adicionarLogo(wb, ws);

  const cab = ws.getRow(faixaLogo.LINHA_CABECALHO);
  colunas.forEach((c, i) => {
    const cell = cab.getCell(i + 1);
    cell.value = c.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR_CABEC } };
  });

  for (const p of participantes) {
    ws.addRow({
      ...p,
      // date (sem hora) do pg chega como Date local; o Excel grava em UTC -> mantem o mesmo dia
      data_nasc: p.data_nasc instanceof Date
        ? new Date(Date.UTC(p.data_nasc.getFullYear(), p.data_nasc.getMonth(), p.data_nasc.getDate()))
        : p.data_nasc,
    });
  }
  ws.views = [{ state: "frozen", ySplit: faixaLogo.LINHA_CABECALHO }]; // faixa + cabecalho fixos
  ws.autoFilter = { from: `A${faixaLogo.LINHA_CABECALHO}`, to: `K${faixaLogo.LINHA_CABECALHO}` };
}

function abaResumos(wb, d, tituloBase) {
  const ws = wb.addWorksheet("Resumos");
  const larguras = [18, 10, 3, 38, 10, 3, 24, 10, 3, 24, 10];
  larguras.forEach((w, i) => (ws.getColumn(i + 1).width = w));

  // faixa nas linhas 1-3; os blocos comecam logo abaixo (linha 4 = titulos, linha 5 = cabecalhos)
  faixaLogo.aplicarFaixa(ws, { larguras, titulo: `${tituloBase}   |   Resumos` });
  faixaLogo.adicionarLogo(wb, ws);
  const topo = faixaLogo.LINHA_CABECALHO;

  bloco(ws, 1, { bloco: "KITS", rotulo: "TAM" }, d.kits.map((k) => ({ rotulo: k.tam, qtd: k.qtd })), topo);
  bloco(ws, 4, { bloco: "COLABORADOR", rotulo: "USUÁRIO" }, d.colaboradores.map((c) => ({ rotulo: c.usuario, qtd: c.qtd })), topo);
  bloco(ws, 7, { bloco: "CATEGORIAS", rotulo: "CATEGORIA" }, d.categorias.map((c) => ({ rotulo: c.categoria, qtd: c.qtd })), topo);

  titulo(ws, `J${topo}:K${topo}`, "RESUMO GERAL");
  const linhas = [
    ["QTD PARTICIPANTES", d.totais.participantes],
    ["QTD KITS", d.totais.kits],
  ];
  linhas.forEach(([rotulo, valor], i) => {
    ws.getCell(topo + 1 + i, 10).value = rotulo;
    ws.getCell(topo + 1 + i, 11).value = valor;
  });
  ws.getCell(topo + 3, 10).value = "SALDO";
  ws.getCell(topo + 3, 11).value = { formula: `K${topo + 1}-K${topo + 2}`, result: d.totais.participantes - d.totais.kits };
  for (let r = topo + 1; r <= topo + 3; r++) {
    for (const col of [10, 11]) {
      const c = ws.getCell(r, col);
      c.border = BORDAS;
      if (col === 10 || r === topo + 3) c.font = { bold: true };
    }
  }

  // congela a faixa e os titulos/cabecalhos dos blocos (linhas 1 a 5)
  ws.views = [{ state: "frozen", ySplit: topo + 1 }];
}

async function gerar(params, caminhoArquivo) {
  const idEmpresa = Number(params.id_empresa);
  const idEvento = Number(params.id_evento);
  if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) throw new Error("Empresa inválida.");
  if (!Number.isInteger(idEvento) || idEvento <= 0) throw new Error("Informe o evento do resumo.");

  const arg = [idEmpresa, idEvento];
  const [participantes, kits, colaboradores, categorias, totais] = await Promise.all([
    db.any(SQL_PARTICIPANTES, arg),
    db.any(SQL_KITS, arg),
    db.any(SQL_COLABORADORES, arg),
    db.any(SQL_CATEGORIAS, arg),
    db.one(SQL_TOTAIS, arg),
  ]);
  if (participantes.length === 0) return 0;

  const wb = new ExcelJS.Workbook();
  wb.creator = "TKX";
  wb.created = new Date();
  const tituloBase = `Resumo Do Evento - ${participantes[0].evento}`;
  abaParticipantes(wb, participantes, tituloBase);
  abaResumos(wb, { kits, colaboradores, categorias, totais }, tituloBase);

  // a pasta de destino pode nao existir (ex.: servidor novo na nuvem)
  await fs.promises.mkdir(path.dirname(caminhoArquivo), { recursive: true });
  const tmp = `${caminhoArquivo}.tmp`;
  try {
    await wb.xlsx.writeFile(tmp);
    await fs.promises.rename(tmp, caminhoArquivo);
  } catch (e) {
    await fs.promises.rm(tmp, { force: true });
    throw e;
  }
  return participantes.length;
}

module.exports = { gerar };
