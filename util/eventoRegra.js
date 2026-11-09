const eventoSrv = require("../service/eventoService");
const erroDB = require("../util/userfunctiondb");
const shared = require("../util/shared");
/* REGRA DE NEGOCIO eventos */

/*
  Evento so pode ser ALTERADO ou EXCLUIDO nas situacoes 0 (Aguardando Liberacao) e 1 (Aguardando Importacao).
  Unica excecao: a TROCA DE SITUACAO (liberar, standby, ativar, encerrar), que grava o mesmo registro com
  apenas o status diferente. Os campos de controle (qtd_*, user_*) nao entram na comparacao.
*/
const SITUACOES_EDITAVEIS = ["0", "1"];
const CAMPOS_EDITAVEIS = ["descricao", "id_responsavel", "rua", "nro", "complemento", "bairro", "cidade", "uf", "cep", "inicio", "final", "obs"];
const CAMPOS_DATA = ["inicio", "final"];

function normaliza(campo, valor) {
  if (valor === null || valor === undefined) return "";
  if (CAMPOS_DATA.includes(campo)) {
    const t = new Date(valor).getTime();
    return Number.isNaN(t) ? String(valor).trim() : t;
  }
  return String(valor).trim();
}

function mudouCampos(atual, novo) {
  return CAMPOS_EDITAVEIS.some((c) => normaliza(c, atual[c]) !== normaliza(c, novo[c]));
}
exports.mudouCamposEvento = mudouCampos;

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
    if (!SITUACOES_EDITAVEIS.includes(String(obj.status))) {
      const trocaDeSituacao = String(evento.status) !== String(obj.status) && !mudouCampos(obj, evento);
      if (!trocaDeSituacao) {
        throw new erroDB.UserException("Regra de negócio", [
          {
            tabela: "EVENTO",
            message: `"ALTERAÇÃO" O evento só pode ser alterado nas situações Aguardando Liberação ou Aguardando Importação.`,
          },
        ]);
      }
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
    if (!SITUACOES_EDITAVEIS.includes(String(obj.status))) {
      throw new erroDB.UserException("Regra de negócio", [
        {
          tabela: "EVENTO",
          message: `"EXCLUSÃO" O evento só pode ser excluído nas situações Aguardando Liberação ou Aguardando Importação.`,
        },
      ]);
    }
  } catch (err) {
    throw err;
  }

  return;
};
