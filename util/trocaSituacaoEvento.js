/*
  TROCAR SITUACAO DO EVENTO  (menu "Trocar Situação Evento" do cadastro de eventos)

  Quem pode:   somente MASTER (1) ou TI (99)   -> 403 (nunca 401: o front desloga o usuario em 401)
  Para onde:   2 StandBy | 3 Ativo | 4 Encerrado
  Regras:      - evento precisa existir
               - nao troca para a mesma situacao
               - evento ENCERRADO (4) PODE ser reaberto (2 ou 3): encerra-se por seguranca e reabre-se no dia seguinte,
                 ou o encerramento foi por engano. Quem reabre fica registrado em user_update.
  Situacoes:   0 Aguardando Liberacao | 1 Aguardando Importacao | 2 StandBy | 3 Ativo | 4 Encerrado

  executor: db ou uma transacao (a rota usa db.tx; os testes usam uma transacao com rollback)
*/
const usuarioSrv = require("../service/usuarioService");

const GRUPOS_PERMITIDOS = [1, 99];
const SITUACOES_DESTINO = ["2", "3", "4"];

class ErroTrocaSituacao extends Error {
  constructor(http, message) {
    super(message);
    this.http = http;
  }
}
exports.ErroTrocaSituacao = ErroTrocaSituacao;
exports.GRUPOS_PERMITIDOS = GRUPOS_PERMITIDOS;
exports.SITUACOES_DESTINO = SITUACOES_DESTINO;

exports.trocarSituacao = async function (executor, { id_empresa, id_usuario, id_evento, status }) {
  const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);
  if (!usuario) throw new ErroTrocaSituacao(404, "Usuário Não Existe!");
  if (!GRUPOS_PERMITIDOS.includes(Number(usuario.grupo))) {
    throw new ErroTrocaSituacao(403, "Somente Usuário Master/TI Pode Trocar A Situação Do Evento!");
  }

  const novo = String(status ?? "").trim();
  if (!SITUACOES_DESTINO.includes(novo)) {
    throw new ErroTrocaSituacao(400, "Situação Inválida. Escolha StandBy, Ativo ou Encerrado.");
  }

  const idEvento = Number(id_evento);
  if (!Number.isInteger(idEvento) || idEvento <= 0) throw new ErroTrocaSituacao(400, "Informe o evento.");

  const evento = await executor.oneOrNone("SELECT id, descricao, status FROM eventos WHERE id_empresa = $1 AND id = $2 FOR UPDATE", [id_empresa, idEvento]);
  if (!evento) throw new ErroTrocaSituacao(404, "Evento Não Existe!");
  if (String(evento.status) === novo) throw new ErroTrocaSituacao(409, "O Evento Já Está Nesta Situação.");

  return executor.one("UPDATE eventos SET status = $3, user_update = $4 WHERE id_empresa = $1 AND id = $2 RETURNING *", [id_empresa, idEvento, novo, id_usuario]);
};
