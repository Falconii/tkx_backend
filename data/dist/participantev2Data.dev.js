"use strict";

/* DATA participantesv2 */
var db = require("../infra/database");

var shared = require("../util/shared.js");
/* GET CAMPOS */


exports.getCampos = function (Participantev2) {
  return [Participantev2.id_empresa, Participantev2.id_evento, Participantev2.id, Participantev2.inscricao, Participantev2.nro_peito, Participantev2.id_categoria, Participantev2.cnpj_cpf, Participantev2.nome, Participantev2.sexo, Participantev2.data_nasc, Participantev2.origem, Participantev2.user_insert, Participantev2.user_update];
};
/* CRUD GET */


exports.getParticipantev2 = function (id_empresa, id_evento, id) {
  strSql = " select   \n\t\t\t   participante.id_empresa as  id_empresa  \n\t\t\t,  participante.id_evento as  id_evento  \n\t\t\t,  participante.id as  id  \n            ,  participante.id_entrega as  id_entrega\n\t\t\t,  participante.inscricao as  inscricao  \n\t\t\t,  participante.nro_peito as  nro_peito  \n\t\t\t,  participante.id_categoria as  id_categoria  \n\t\t\t,  participante.cnpj_cpf as  cnpj_cpf  \n\t\t\t,  participante.nome as  nome  \n\t\t\t,  participante.sexo as  sexo  \n\t\t\t, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  \n\t\t\t,  participante.origem as  origem  \n\t\t\t,  participante.user_insert as  user_insert  \n\t\t\t,  participante.user_update as  user_update  \n\t\t\t,  evento.descricao as  evento_descricao  \n\t\t\t,  categoria.descricao as  categoria_descricao    \n            ,  coalesce(entrega.rg_retirada,'') as entrega_rg_retirada\n            ,  coalesce(entrega.nome_retirada,'') as entrega_nome_retirada\n            , coalesce(entrega.tam_camisa,'') as entrega_tam_camisa\n \t\t\tFROM participantesv2 participante \t  \n\t\t\t\t inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\t inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria   \n         left join entregasv2 entrega on entrega.id_empresa = participante.id_empresa and entrega.id_evento = participante.id_evento and entrega.id = participante.id_entrega\n\t\t\t where participante.id_empresa = ".concat(id_empresa, " and  participante.id_evento = ").concat(id_evento, " and  participante.id = ").concat(id, "  ");
  return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/


exports.getParticipantesv2 = function (params) {
  console.log("getParticipantesv2", params);

  if (params) {
    where = "";
    orderby = "";
    paginacao = "";
    if (params.orderby == "") orderby = "participante.id_empresa,participante.id_evento,participante.inscricao";
    if (params.orderby == "000000") orderby = "participante.id_empresa,participante.id_evento,participante.inscricao";
    if (params.orderby == "000001") orderby = "participante.id_empresa,participante.id_evento,participante.nro_peito";
    if (params.orderby == "000002") orderby = "participante.id_empresa,participante.id_evento,participante.id_categoria,participante.nome";
    if (params.orderby == "000003") orderby = "participante.id_empresa,participante.id_evento,participante.nome";
    if (params.orderby == "000004") orderby = "participante.id_empresa,participante.id_evento,participante.cnpj_cpf";
    if (orderby != "") orderby = " order by " + orderby;
    console.log("orderby", orderby);

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += "participante.id_empresa = ".concat(params.id_empresa, " ");
    }

    if (params.id_evento !== 0) {
      if (where != "") where += " and ";
      where += "participante.id_evento = ".concat(params.id_evento, " ");
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += "participante.id = ".concat(params.id, " ");
    }

    if (params.id_entrega !== 0) {
      if (where != "") where += " and ";
      where += "participante.id_entrega = ".concat(params.id_entrega, " ");
    }

    if (params.kit !== false) {
      if (where != "") where += " and ";
      where += "participante.id_entrega > 0 ";
    }

    if (params.inscricao !== -1) {
      if (where != "") where += " and ";
      where += "participante.inscricao = ".concat(params.inscricao, " ");
    }

    if (params.nro_peito !== -1) {
      if (where != "") where += " and ";
      where += "participante.nro_peito = ".concat(params.nro_peito, " ");
    }

    if (params.id_categoria !== 0) {
      if (where != "") where += " and ";
      where += "participante.id_categoria = ".concat(params.id_categoria, " ");
    }

    if (params.nome.trim() !== "") {
      if (where != "") where += " and ";

      if (params.sharp) {
        where += "unaccent(participante.nome) = '".concat(shared.semAcentoparams.nome, "' ");
      } else {
        where += "unaccent(participante.nome) like '%".concat(shared.semAcento(params.nome.trim()), "%' ");
      }
    }

    if (params.cnpj_cpf.trim() !== "") {
      if (where != "") where += " and ";

      if (params.sharp) {
        where += "participante.cnpj_cpf = '".concat(params.cnpj_cpf, "' ");
      } else {
        where += "participante.cnpj_cpf like '%".concat(params.cnpj_cpf.trim(), "%' ");
      }
    }

    if (params.evento_descricao.trim() !== "") {
      if (where != "") where += " and ";

      if (params.sharp) {
        where += "participante.evento_descricao = '".concat(params.evento_descricao, "' ");
      } else {
        where += "participante.evento_descricao like '%".concat(params.evento_descricao.trim(), "%' ");
      }
    }

    if (params.categoria_descricao.trim() !== "") {
      if (where != "") where += " and ";

      if (params.sharp) {
        where += "participante.categoria_descricao = '".concat(params.categoria_descricao, "' ");
      } else {
        where += "participante.categoria_descricao like '%".concat(params.categoria_descricao.trim(), "%' ");
      }
    }

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = "limit ".concat(params.tamPagina, " offset((").concat(params.pagina, " -1) * ").concat(params.tamPagina, ")");
    }

    if (params.contador == "S") {
      sqlStr = "SELECT COALESCE(COUNT(*),0) as total \n\t\t\t\t  FROM participantesv2 participante   \n\t\t\t\t inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\t inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria  \n         left join entregasv2 entrega on entrega.id_empresa = participante.id_empresa and entrega.id_evento = participante.id_evento and entrega.id = participante.id_entrega \n\t\t\t\t  ".concat(where, " ");
      return db.one(sqlStr);
    } else {
      strSql = "select   \n\t\t\t   participante.id_empresa as  id_empresa  \n\t\t\t,  participante.id_evento as  id_evento  \n\t\t\t,  participante.id as  id  \n      ,  participante.id_entrega as  id_entrega  \n\t\t\t,  participante.inscricao as  inscricao  \n\t\t\t,  participante.nro_peito as  nro_peito  \n\t\t\t,  participante.id_categoria as  id_categoria  \n\t\t\t,  participante.cnpj_cpf as  cnpj_cpf  \n\t\t\t,  participante.nome as  nome  \n\t\t\t,  participante.sexo as  sexo  \n\t\t\t, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  \n\t\t\t,  participante.origem as  origem  \n\t\t\t,  participante.user_insert as  user_insert  \n\t\t\t,  participante.user_update as  user_update  \n\t\t\t,  evento.descricao as  evento_descricao  \n\t\t\t,  categoria.descricao as  categoria_descricao   \n      ,  coalesce(entrega.rg_retirada,'') as entrega_rg_retirada\n      ,  coalesce(entrega.nome_retirada,'') as entrega_nome_retirada\n      , coalesce(entrega.tam_camisa,'') as entrega_tam_camisa\n\n\t\t\tFROM participantesv2 participante   \n\t\t\t\t inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\t inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria   \n         left join entregasv2 entrega on entrega.id_empresa = participante.id_empresa and entrega.id_evento = participante.id_evento and entrega.id = participante.id_entrega\n\t\t\t".concat(where, " \t").concat(orderby, " ").concat(paginacao, " ");
      console.log("getParticipantesv2", strSql);
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = "select   \n\t\t\t   participante.id_empresa as  id_empresa  \n\t\t\t,  participante.id_evento as  id_evento  \n\t\t\t,  participante.id as  id  \n\t\t\t,  participante.inscricao as  inscricao  \n\t\t\t,  participante.nro_peito as  nro_peito  \n\t\t\t,  participante.id_categoria as  id_categoria  \n\t\t\t,  participante.cnpj_cpf as  cnpj_cpf  \n\t\t\t,  participante.nome as  nome  \n\t\t\t,  participante.sexo as  sexo  \n\t\t\t, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  \n\t\t\t,  participante.origem as  origem  \n\t\t\t,  participante.user_insert as  user_insert  \n\t\t\t,  participante.user_update as  user_update  \n\t\t\t,  evento.descricao as  evento_descricao  \n\t\t\t,  categoria.descricao as  categoria_descricao    \n\t\t\tFROM participantesv2 participante\t\t\t   \n\t\t\t\t inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\t inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria  ";
    return db.manyOrNone(strSql);
  }
};
/* CRUD - INSERT */


exports.insertParticipantev2 = function (participantev2) {
  console.log("objeto para inlcuir", participantev2);
  strSql = "insert into participantesv2 (\n\t\t     id_empresa \n\t\t ,   id_evento \n     ,   id_entrega\n\t\t ,   inscricao \n\t\t ,   nro_peito \n\t\t ,   id_categoria \n\t\t ,   cnpj_cpf \n\t\t ,   nome \n\t\t ,   sexo \n\t\t ,   data_nasc \n\t\t ,   origem \n\t\t ,   user_insert \n\t\t ,   user_update \n\t\t ) \n\t\t values(\n\t\t     ".concat(participantev2.id_empresa, " \n\t\t ,   ").concat(participantev2.id_evento, " \n\t\t ,   ").concat(participantev2.id_entrega, "\n\t\t ,   ").concat(participantev2.inscricao, " \n\t\t ,   ").concat(participantev2.nro_peito, " \n\t\t ,   ").concat(participantev2.id_categoria, " \n\t\t ,   '").concat(participantev2.cnpj_cpf, "' \n\t\t ,   '").concat(participantev2.nome, "' \n\t\t ,   '").concat(participantev2.sexo, "' \n\t\t ,   '").concat(shared.formatDateYYYYMMDD(participantev2.data_nasc), "'\n\t\t ,   '").concat(participantev2.origem, "' \n\t\t ,   ").concat(participantev2.user_insert, " \n\t\t ,   ").concat(participantev2.user_update, " \n\t\t ) \n returning * ");
  console.log("Incluindo", strSql);
  return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */


exports.updateParticipantev2 = function (participantev2) {
  strSql = "update   participantesv2 set  \n\t\t     inscricao = ".concat(participantev2.inscricao, " \n \t\t ,   nro_peito = ").concat(participantev2.nro_peito, " \n \t\t ,   id_categoria = ").concat(participantev2.id_categoria, " \n \t\t ,   cnpj_cpf = '").concat(participantev2.cnpj_cpf, "' \n \t\t ,   nome = '").concat(participantev2.nome, "' \n \t\t ,   sexo = '").concat(participantev2.sexo, "' \n \t\t ,   data_nasc = '").concat(shared.formatDateYYYYMMDD(participantev2.data_nasc), "'\n \t\t ,   origem = '").concat(participantev2.origem, "' \n \t\t ,   id_entrega = ").concat(participantev2.id_entrega, "\n \t\t ,   user_insert = ").concat(participantev2.user_insert, " \n \t\t ,   user_update = ").concat(participantev2.user_update, " \n \t\t where id_empresa = ").concat(participantev2.id_empresa, " and  id_evento = ").concat(participantev2.id_evento, " and  id = ").concat(participantev2.id, "  returning * ");
  return db.oneOrNone(strSql);
};
/* CRUD - DELETE */


exports.deleteParticipantev2 = function (id_empresa, id_evento, id) {
  strSql = "delete from participantesv2 \n\t\t where id_empresa = ".concat(id_empresa, " and  id_evento = ").concat(id_evento, " and  id = ").concat(id, "  ");
  return db.oneOrNone(strSql);
};