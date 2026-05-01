const eventoSrv = require("../service/eventoService");
const erroDB = require("../util/userfunctiondb");
const shared = require("../util/shared");
/* REGRA DE NEGOCIO eventos */

exports.evento_Inclusao = async function (evento) {
  try {
    const obj = await eventoSrv.getEvento(evento.id_empresa, evento.id);
    if (obj != null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.evento_Alteracao = async function (evento) {
  try {
    const obj = await eventoSrv.getEvento(evento.id_empresa, evento.id);
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
    if (obj.status == "4") {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"ALTERAÇÃO" Evento ENCERRADO. Não Poderá Ser Alterado.!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};

exports.evento_Exclusao = async function (id_empresa, id) {
  try {
    const obj = await eventoSrv.getEvento(id_empresa, id);
    if (obj == null) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!`,
        },
      ]);
    }
    if (obj.status == "2" || obj.status == "3" || obj.status == "4") {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"EXCLUSÃO" Nesta Situação O Evento Não Pode Ser Excluído!`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};
