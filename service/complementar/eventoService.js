/* SERVICE eventos */
const eventoData = require("../../data/complementar/eventoData");
const validacao = require("../../util/validacao");
const parametros = require("../../util/eventoParametros");
const erroDB = require("../../util/userfunctiondb");
const regras = require("../../util/eventoRegra");
const TABELA = "EVENTOS";
/* CRUD GET SERVICE */

//* CRUD - UPDATE - SERVICE */
exports.updateStatusEvento = async function (evento) {
  try {
    await regras.evento_Alteracao(evento);
    validacao.Validacao(TABELA, evento, parametros.eventos());
    return eventoData.updateStatusEvento(evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};



exports.consultaEvento01 = async function (evento) {
  try {
    return eventoData.consultaEvento01(evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};



exports.resumoCategoria = async function (evento) {
  try {
    return eventoData.resumoCategoria(evento);
  } catch (err) {
    throw new erroDB.UserException(err.erro, err);
  }
};
