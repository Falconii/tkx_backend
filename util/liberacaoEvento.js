/*
  SITUACAO DO EVENTO: QUEM PODE TROCAR  (regras no SERVIDOR; o front so esconde os botoes)

  Situacoes: 0 Aguardando Liberacao | 1 Aguardando Importacao | 2 StandBy | 3 Ativo | 4 Encerrado

  Troca pela tela/edicao (PUT /api/evento):
    0 -> 1  Liberar      somente MASTER (1) ou TI (99)
    2 -> 3  Ativar       MASTER, ADM (3) ou TI
    3 -> 2  StandBy      MASTER, ADM ou TI
    3 -> 4  Encerrar     MASTER, ADM ou TI
    qualquer outra troca nao e permitida por esta rota: so o dialog "Trocar Situacao Evento" (MASTER/TI),
    que usa a rota evento_complementar/updateStatusEvento. (O processamento da planilha grava 2 internamente.)
  Cadastro (POST): o evento nasce em 0; outra situacao so MASTER/TI.
  Link do e-mail de liberacao: so MASTER/TI, e so evento em 0.

  Erros devolvem 403/404/409 (nunca 401: o front desloga o usuario em 401).
*/
const usuarioSrv = require("../service/usuarioService");
const eventoSrv = require("../service/eventoService");

const GRUPOS_QUE_LIBERAM = [1, 99];
const GRUPOS_MASTER_ADM_TI = [1, 3, 99];

/* troca permitida pela tela -> grupos que podem fazer */
const TROCAS_PELA_TELA = {
  "0>1": GRUPOS_QUE_LIBERAM,
  "2>3": GRUPOS_MASTER_ADM_TI,
  "3>2": GRUPOS_MASTER_ADM_TI,
  "3>4": GRUPOS_MASTER_ADM_TI,
};

class ErroLiberacao extends Error {
  constructor(http, message) {
    super(message);
    this.http = http;
  }
}
exports.ErroLiberacao = ErroLiberacao;
exports.GRUPOS_QUE_LIBERAM = GRUPOS_QUE_LIBERAM;

async function exigirGrupo(id_empresa, id_usuario, grupos, mensagem) {
  const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);
  if (!usuario) throw new ErroLiberacao(404, "Usuário Não Existe!");
  if (usuario.ativo !== "S") throw new ErroLiberacao(403, "Usuário Inativo!");
  if (!grupos.includes(Number(usuario.grupo))) throw new ErroLiberacao(403, mensagem);
  return usuario;
}

const exigirMasterOuTI = (id_empresa, id_usuario) =>
  exigirGrupo(id_empresa, id_usuario, GRUPOS_QUE_LIBERAM, "Somente Usuário Master/TI Pode Liberar O Evento!");
exports.exigirMasterOuTI = exigirMasterOuTI;

/*
  Gravacao de evento pela tela (PUT) ou cadastro (POST). statusAtual = null no cadastro.
  Nao trocar a situacao (novo == atual) nao tem restricao.
*/
exports.validarMudancaDeSituacao = async function (id_empresa, id_usuario, statusNovo, statusAtual) {
  const novo = String(statusNovo ?? "");

  if (statusAtual === null || statusAtual === undefined) {
    // cadastro: nasce em 0; outra situacao so master/TI
    if (novo !== "0") await exigirMasterOuTI(id_empresa, id_usuario);
    return;
  }

  const atual = String(statusAtual);
  if (novo === atual) return;

  const grupos = TROCAS_PELA_TELA[`${atual}>${novo}`];
  if (!grupos) {
    throw new ErroLiberacao(409, "Esta Troca De Situação Não É Permitida Por Esta Tela. Master/TI: Use 'Trocar Situação Evento'.");
  }
  const mensagem = novo === "1" ? "Somente Usuário Master/TI Pode Liberar O Evento!" : "Seu Grupo Não Pode Trocar A Situação Do Evento!";
  await exigirGrupo(id_empresa, id_usuario, grupos, mensagem);
};

/*
  Link do e-mail: o usuario do token precisa ser master/TI e o evento precisa estar AGUARDANDO LIBERACAO ('0').
  Antes, qualquer token valido liberava qualquer evento, e ate "voltava" um evento ativo para '1'.
  Devolve o evento.
*/
exports.validarLiberacaoPorLink = async function (id_empresa, id_usuario, id_evento) {
  await exigirMasterOuTI(id_empresa, id_usuario);
  const evento = await eventoSrv.getEvento(id_empresa, id_evento);
  if (!evento) throw new ErroLiberacao(404, "Evento Não Encontrado!");
  if (String(evento.status) === "1") throw new ErroLiberacao(409, "Este Evento Já Foi Liberado.");
  if (String(evento.status) !== "0") throw new ErroLiberacao(409, "Este Evento Não Está Aguardando Liberação.");
  return evento;
};
