/*
  Quem pode registrar/excluir ENTREGA de kit em um evento (mesma regra do dashboard):
    - o evento precisa estar ATIVO (situacao '3');
    - usuario do grupo OPERADOR (4) precisa estar vinculado e ativo em usuarios_eventos.
  Devolve null quando liberado, ou a mensagem do bloqueio (a rota responde 409; nunca 401,
  porque o front desloga o usuario em 401).
*/
const usuarioSrv = require("../service/usuarioService");
const eventoData = require("../data/complementar/eventoData");

const GRUPO_OPERADOR = 4;

exports.motivoBloqueioEntrega = async function (id_empresa, id_usuario, id_evento) {
  const evento = await eventoData.situacaoEventoParaEntrega(id_empresa, id_usuario, id_evento);
  if (!evento.existe) return "Evento Não Existe!";
  if (!evento.ativo) return "Evento Não Está Ativo. Entrega De Kit Não Permitida.";

  const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);
  if (!usuario) return "Usuário Não Existe!";
  if (Number(usuario.grupo) === GRUPO_OPERADOR && !evento.vinculado) {
    return "Operador Não Está Liberado Para Este Evento.";
  }
  return null;
};
