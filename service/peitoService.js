/*
  SERVICE do numero do peito: numeracao automatica e unicidade DENTRO DO EVENTO.

    categorias.contador          faixa da categoria (2 digitos). A numeracao automatica comeca em  faixa x 1000
                                 (ex.: faixa 90 -> 90000, 90001, 90002 ...). Faixa 00 ou invalida comeca em 1.
    categoriacontadores.contador PROXIMO numero a gerar para (empresa, evento, categoria). Nasce na primeira
                                 geracao, com a semente acima.

  O numero e gerado somente quando NAO vem informado (peito em branco). Se vier preenchido, vale o informado.
  A geracao sempre PULA numeros ja usados no evento (participantes e linhas de planilhas), entao nunca devolve
  um numero repetido, mesmo que o contador esteja atrasado ou a faixa de outra categoria seja invadida.

  Regra do sistema: o numero do peito e unico dentro do evento (indice unico em participantesv2).
*/
const db = require("../infra/database");

const MAX_PEITO = 2147483647;
const ESPERA_MAXIMA_TRAVA = "15s";

class ErroPeito extends Error {
  constructor(message) {
    super(message);
    this.name = "ErroPeito";
  }
}

/* "90" -> 90 ; "00", "", "AB", "9X" -> 0 */
function faixaDaCategoria(contador) {
  const s = String(contador ?? "").trim();
  return /^\d{1,2}$/.test(s) ? Number(s) : 0;
}

function sementeDaCategoria(contador) {
  return faixaDaCategoria(contador) * 1000;
}

/*
  Todos os numeros de peito em uso no evento: participantes + linhas de planilhas (de qualquer planilha do evento).
  Numeros provisorios (negativos) das linhas com erro nao contam.
*/
async function usadosNoEvento(t, id_empresa, id_evento) {
  const linhas = await t.any(
    `SELECT nro_peito FROM participantesv2 WHERE id_empresa = $1 AND id_evento = $2
     UNION
     SELECT nro_peito FROM detplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND nro_peito > 0`,
    [id_empresa, id_evento],
  );
  return new Set(linhas.map((l) => l.nro_peito));
}

/*
  Reserva `quantidade` numeros novos para a categoria, avancando o contador. Deve rodar DENTRO de uma transacao
  que ja tenha a trava do evento (advisory lock). `usados` (Set) e atualizado com os numeros reservados.
*/
async function reservarNumeros(t, { id_empresa, id_evento, id_categoria, quantidade, usados, id_usuario }) {
  const categoria = await t.oneOrNone("SELECT contador FROM categorias WHERE id_empresa = $1 AND id = $2", [id_empresa, id_categoria]);
  if (!categoria) throw new ErroPeito("Categoria não cadastrada: não é possível gerar o número do peito.");

  await t.none(
    `INSERT INTO categoriacontadores (id_empresa, id_evento, id_categoria, contador, user_insert, user_update)
     VALUES ($1, $2, $3, $4, $5, 0) ON CONFLICT DO NOTHING`,
    [id_empresa, id_evento, id_categoria, sementeDaCategoria(categoria.contador), id_usuario || 1],
  );
  const linha = await t.one(
    "SELECT contador FROM categoriacontadores WHERE id_empresa = $1 AND id_evento = $2 AND id_categoria = $3 FOR UPDATE",
    [id_empresa, id_evento, id_categoria],
  );

  let n = Math.max(linha.contador, 1);
  const numeros = [];
  while (numeros.length < quantidade) {
    if (n > MAX_PEITO) throw new ErroPeito("Numeração do peito esgotada para esta categoria.");
    if (!usados.has(n)) {
      numeros.push(n);
      usados.add(n);
    }
    n++;
  }

  await t.none(
    "UPDATE categoriacontadores SET contador = $4, user_update = $5 WHERE id_empresa = $1 AND id_evento = $2 AND id_categoria = $3",
    [id_empresa, id_evento, id_categoria, n, id_usuario || 1],
  );
  return numeros;
}

/*
  Um numero novo (cadastro manual). Espera a trava do evento (uma importacao em andamento termina primeiro).
  Se a inclusao falhar depois, o numero fica "queimado" (buraco na sequencia), o que e inofensivo.
*/
async function proximoPeito({ id_empresa, id_evento, id_categoria, id_usuario }) {
  try {
    return await db.tx(async (t) => {
      await t.none(`SET LOCAL lock_timeout = '${ESPERA_MAXIMA_TRAVA}'`);
      // (a funcao devolve uma linha "void": por isso any() e nao none())
      await t.any("SELECT pg_advisory_xact_lock($1, $2)", [id_empresa, id_evento]);
      const usados = await usadosNoEvento(t, id_empresa, id_evento);
      const [n] = await reservarNumeros(t, { id_empresa, id_evento, id_categoria, quantidade: 1, usados, id_usuario });
      return n;
    });
  } catch (err) {
    if (err && err.code === "55P03") {
      throw new ErroPeito("O evento está ocupado com outra operação (importação ou processamento). Tente novamente em instantes.");
    }
    throw err;
  }
}

/* participante do evento que ja usa este numero (ou null). `exceto` = id do proprio participante (alteracao) */
async function participanteComPeito(id_empresa, id_evento, nro_peito, exceto = 0) {
  return db.oneOrNone(
    "SELECT id, nome FROM participantesv2 WHERE id_empresa = $1 AND id_evento = $2 AND nro_peito = $3 AND id <> $4 LIMIT 1",
    [id_empresa, id_evento, nro_peito, exceto || 0],
  );
}

/* numero ja usado por OUTRA linha de planilha do evento (alem da chave da propria linha) */
async function linhaDePlanilhaComPeito(id_empresa, id_evento, nro_peito, id_cabec_exceto = 0) {
  return db.oneOrNone(
    "SELECT id_cabec FROM detplanilhas WHERE id_empresa = $1 AND id_evento = $2 AND nro_peito = $3 AND id_cabec <> $4 LIMIT 1",
    [id_empresa, id_evento, nro_peito, id_cabec_exceto || 0],
  );
}

module.exports = {
  ErroPeito,
  faixaDaCategoria,
  sementeDaCategoria,
  usadosNoEvento,
  reservarNumeros,
  proximoPeito,
  participanteComPeito,
  linhaDePlanilhaComPeito,
};
