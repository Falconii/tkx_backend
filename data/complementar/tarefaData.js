/*
  DATA complementar de tarefas (fila de relatorios)

  Nao e gerado: usa parametros do pg-promise ($1, $2...) em vez de concatenar valores no SQL.
  status: '0' pendente | '1' processando | '2' concluida | '3' erro | '4' sem dados

  data_solicitacao / data_conclusao sao varchar(20) no formato 'YYYY-MM-DD HH24:MI:SS'
  (hora de Sao Paulo), que ordena corretamente como texto.
*/
const db = require("../../infra/database");

const AGORA = `to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD HH24:MI:SS')`;

/* colunas expostas ao usuario (sem "parametros", que pode ser grande) */
const COLUNAS = `id_empresa, id, id_usuario, name_file, sigla, data_solicitacao,
                 data_conclusao, status, mensagem`;

/* cria a tarefa pendente */
exports.incluir = function ({ id_empresa, id_usuario, name_file, sigla, parametros }) {
  return db.one(
    `INSERT INTO tarefas (id_empresa, id_usuario, name_file, sigla, data_solicitacao,
                          parametros, status, user_insert, user_update)
     VALUES ($1, $2, $3, $4, ${AGORA}, $5, '0', $2, $2)
     RETURNING ${COLUNAS}`,
    [id_empresa, id_usuario, name_file, sigla, parametros],
  );
};

/* tarefa do usuario (so devolve se for dele) */
exports.buscarDoUsuario = function (id_empresa, id_usuario, id) {
  return db.oneOrNone(
    `SELECT ${COLUNAS} FROM tarefas
      WHERE id = $1 AND id_empresa = $2 AND id_usuario = $3`,
    [id, id_empresa, id_usuario],
  );
};

/* tarefas do usuario, mais recentes primeiro */
exports.listarDoUsuario = function (id_empresa, id_usuario, limite = 100) {
  return db.manyOrNone(
    `SELECT ${COLUNAS} FROM tarefas
      WHERE id_empresa = $1 AND id_usuario = $2
      ORDER BY id DESC
      LIMIT $3`,
    [id_empresa, id_usuario, limite],
  );
};

/* ---------- pesquisa paginada da tela de acompanhamento ---------- */

/* ordenacao so por lista fixa (nunca texto vindo do cliente) */
const ORDENACAO = {
  "": "id DESC",
  "000000": "id DESC", // mais recentes primeiro
  "000001": "id ASC", // mais antigas primeiro
};

function filtroPesquisa(p) {
  let where = "id_empresa = $/id_empresa/ AND id_usuario = $/id_usuario/";
  if (p.status) where += " AND status = $/status/";
  if (p.sigla) where += " AND sigla = $/sigla/";
  return where;
}

/* p = { id_empresa, id_usuario, status, sigla, orderby, limite, deslocamento } (ja validados pela rota) */
exports.pesquisarDoUsuario = function (p) {
  return db.manyOrNone(
    `SELECT ${COLUNAS} FROM tarefas
      WHERE ${filtroPesquisa(p)}
      ORDER BY ${ORDENACAO[p.orderby] || ORDENACAO[""]}
      LIMIT $/limite/ OFFSET $/deslocamento/`,
    p,
  );
};

exports.contarDoUsuario = function (p) {
  return db.one(`SELECT count(*)::int AS total FROM tarefas WHERE ${filtroPesquisa(p)}`, p);
};

/* JOB: reserva atomicamente as proximas pendentes (pendente -> processando) */
exports.reservarPendentes = function (limite) {
  return db.manyOrNone(
    `UPDATE tarefas
        SET status = '1'
      WHERE id IN (SELECT id FROM tarefas
                    WHERE status = '0'
                    ORDER BY id
                    LIMIT $1
                    FOR UPDATE SKIP LOCKED)
      RETURNING *`,
    [limite],
  );
};

/* JOB: encerra a tarefa. So altera se ainda estiver "processando". */
exports.encerrar = function (id, status, mensagem = "") {
  return db.result(
    `UPDATE tarefas
        SET status = $2, mensagem = $3, data_conclusao = ${AGORA}
      WHERE id = $1 AND status = '1'`,
    [id, status, String(mensagem).slice(0, 1000)],
    (r) => r.rowCount,
  );
};

/* JOB (startup): o que ficou "processando" porque o servidor caiu volta para a fila */
exports.recuperarTravadas = function () {
  return db.result(`UPDATE tarefas SET status = '0' WHERE status = '1'`, [], (r) => r.rowCount);
};

/* JOB: tarefas concluidas ha mais de N dias cujo arquivo ainda nao foi removido */
exports.concluidasAntigas = function (dias) {
  return db.manyOrNone(
    `SELECT id, name_file FROM tarefas
      WHERE status = '2'
        AND mensagem <> 'Arquivo expirado'
        AND data_conclusao < to_char((now() - make_interval(days => $1)) AT TIME ZONE 'America/Sao_Paulo',
                                      'YYYY-MM-DD HH24:MI:SS')`,
    [dias],
  );
};

exports.marcarExpirada = function (id) {
  return db.none(`UPDATE tarefas SET mensagem = 'Arquivo expirado' WHERE id = $1`, [id]);
};
