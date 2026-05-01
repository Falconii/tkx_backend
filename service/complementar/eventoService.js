/* SERVICE eventos */
const eventoData = require("../../data/eventoData");
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
