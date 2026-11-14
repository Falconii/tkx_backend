/* SERVICE eventos */
const eventoData = require("../../data/complementar/eventoData");
const validacao = require("../../util/validacao");
const parametros = require("../../util/eventoParametros");
const erroDB = require("../../util/userfunctiondb");
const regras = require("../../util/eventoRegra");
const TABELA = "EVENTOS";
/* CRUD GET SERVICE */

exports.eventosDoDashboard = async function (id_empresa, id_usuario, operador) {
  return eventoData.eventosDoDashboard(id_empresa, id_usuario, operador);
};

exports.consultaEvento01 = async function (evento) {
  try {
    return eventoData.consultaEvento01(evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};



exports.resumoCategoria = async function (id_empresa,id_evento) {
  try {
    return eventoData.resumoCategoria(id_empresa,id_evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};


exports.resumoOperador = async function (id_empresa,id_evento) {
  try {
    return eventoData.resumoOperador(id_empresa,id_evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};


exports.resumoKit = async function (id_empresa,id_evento) {
  try {
    return eventoData.resumoKit(id_empresa,id_evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};


