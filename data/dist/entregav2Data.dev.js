"use strict";

/* DATA entregasv2 */
var db = require('../infra/database');
/* GET CAMPOS */


exports.getCampos = function (Entregav2) {
  return [Entregav2.id_empresa, Entregav2.id_evento, Entregav2.id, Entregav2.rg_retirada, Entregav2.nome_retirada, Entregav2.tam_camisa, Entregav2.data_retirada, Entregav2.id_recepcao, Entregav2.id_entrega, Entregav2.id_kit, Entregav2.user_insert, Entregav2.user_update];
};
/* CRUD GET */


exports.getEntregav2 = function (id_empresa, id_evento, id) {
  strSql = " select   \n\t\t\t   entregav2.id_empresa as  id_empresa  \n\t\t\t,  entregav2.id_evento as  id_evento  \n\t\t\t,  entregav2.id as  id  \n\t\t\t,  entregav2.rg_retirada as  rg_retirada  \n\t\t\t,  entregav2.nome_retirada as  nome_retirada  \n\t\t\t,  entregav2.tam_camisa as  tam_camisa  \n\t\t\t, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  \n\t\t\t,  entregav2.id_recepcao as  id_recepcao  \n\t\t\t,  entregav2.id_entrega as  id_entrega  \n\t\t\t,  entregav2.id_kit as  id_kit  \n\t\t\t,  entregav2.user_insert as  user_insert  \n\t\t\t,  entregav2.user_update as  user_update    \n \t\t\tFROM entregasv2 entregav2 \t     \n\t\t\t where entregav2.id_empresa = ".concat(id_empresa, " and  entregav2.id_evento = ").concat(id_evento, " and  entregav2.id = ").concat(id, "  ");
  return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/


exports.getEntregasv2 = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";
    if (params.orderby == '') orderby = 'entrega.id_empresa,entrega.id_evento';
    if (params.orderby == '000000') orderby = 'entrega.id_empresa,entrega.id_evento';
    if (params.orderby == '000001') orderby = 'entrega.id_empresa,entrega.id_evento,kit.id_inscrito';
    if (orderby != "") orderby = " order by " + orderby;

    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id_empresa = ".concat(params.id_empresa, " ");
    }

    if (params.id_evento !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id_evento = ".concat(params.id_evento, " ");
    }

    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id = ".concat(params.id, " ");
    }

    if (params.id_recepcao !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id_recepcao = ".concat(params.id_recepcao, " ");
    }

    if (params.id_entrega !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id_entrega = ".concat(params.id_entrega, " ");
    }

    if (params.id_kit !== 0) {
      if (where != "") where += " and ";
      where += "entregav2.id_kit = ".concat(params.id_kit, " ");
    }

    if (where != "") where = " where " + where;

    if (params.pagina != 0) {
      paginacao = "limit ".concat(params.tamPagina, " offset((").concat(params.pagina, " -1) * ").concat(params.tamPagina, ")");
    }

    if (params.contador == 'S') {
      sqlStr = "SELECT COALESCE(COUNT(*),0) as total \n\t\t\t\t  FROM entregasv2 entregav2      \n\t\t\t\t  ".concat(where, " ");
      return db.one(sqlStr);
    } else {
      strSql = "select   \n\t\t\t   entregav2.id_empresa as  id_empresa  \n\t\t\t,  entregav2.id_evento as  id_evento  \n\t\t\t,  entregav2.id as  id  \n\t\t\t,  entregav2.rg_retirada as  rg_retirada  \n\t\t\t,  entregav2.nome_retirada as  nome_retirada  \n\t\t\t,  entregav2.tam_camisa as  tam_camisa  \n\t\t\t, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  \n\t\t\t,  entregav2.id_recepcao as  id_recepcao  \n\t\t\t,  entregav2.id_entrega as  id_entrega  \n\t\t\t,  entregav2.id_kit as  id_kit  \n\t\t\t,  entregav2.user_insert as  user_insert  \n\t\t\t,  entregav2.user_update as  user_update     \n\t\t\tFROM entregasv2 entregav2      \n\t\t\t".concat(where, " \t\t\t").concat(orderby, " ").concat(paginacao, " ");
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = "select   \n\t\t\t   entregav2.id_empresa as  id_empresa  \n\t\t\t,  entregav2.id_evento as  id_evento  \n\t\t\t,  entregav2.id as  id  \n\t\t\t,  entregav2.rg_retirada as  rg_retirada  \n\t\t\t,  entregav2.nome_retirada as  nome_retirada  \n\t\t\t,  entregav2.tam_camisa as  tam_camisa  \n\t\t\t, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  \n\t\t\t,  entregav2.id_recepcao as  id_recepcao  \n\t\t\t,  entregav2.id_entrega as  id_entrega  \n\t\t\t,  entregav2.id_kit as  id_kit  \n\t\t\t,  entregav2.user_insert as  user_insert  \n\t\t\t,  entregav2.user_update as  user_update    \n\t\t\tFROM entregasv2 entregav2\t\t\t     ";
    return db.manyOrNone(strSql);
  }
};
/* CRUD - INSERT */


exports.insertEntregav2 = function (entregav2) {
  strSql = "insert into entregasv2 (\n\t\t     id_empresa \n\t\t ,   id_evento \n\t\t ,   rg_retirada \n\t\t ,   nome_retirada \n\t\t ,   tam_camisa \n\t\t ,   data_retirada \n\t\t ,   id_recepcao \n\t\t ,   id_entrega \n\t\t ,   id_kit \n\t\t ,   user_insert \n\t\t ,   user_update \n\t\t ) \n\t\t values(\n\t\t     ".concat(entregav2.id_empresa, " \n\t\t ,   ").concat(entregav2.id_evento, " \n\t\t ,   '").concat(entregav2.rg_retirada, "' \n\t\t ,   '").concat(entregav2.nome_retirada, "' \n\t\t ,   '").concat(entregav2.tam_camisa, "' \n\t\t ,   '").concat(entregav2.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', ''), "' \n\t\t ,   ").concat(entregav2.id_recepcao, " \n\t\t ,   ").concat(entregav2.id_entrega, " \n\t\t ,   ").concat(entregav2.id_kit, " \n\t\t ,   ").concat(entregav2.user_insert, " \n\t\t ,   ").concat(entregav2.user_update, " \n\t\t ) \n returning * ");
  return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */


exports.updateEntregav2 = function (entregav2) {
  strSql = "update   entregasv2 set  \n\t\t     rg_retirada = '".concat(entregav2.rg_retirada, "' \n \t\t ,   nome_retirada = '").concat(entregav2.nome_retirada, "' \n \t\t ,   tam_camisa = '").concat(entregav2.tam_camisa, "' \n \t\t ,   data_retirada = '").concat(entregav2.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', ''), "' \n \t\t ,   id_recepcao = ").concat(entregav2.id_recepcao, " \n \t\t ,   id_entrega = ").concat(entregav2.id_entrega, " \n \t\t ,   id_kit = ").concat(entregav2.id_kit, " \n \t\t ,   user_insert = ").concat(entregav2.user_insert, " \n \t\t ,   user_update = ").concat(entregav2.user_update, " \n \t\t where id_empresa = ").concat(entregav2.id_empresa, " and  id_evento = ").concat(entregav2.id_evento, " and  id = ").concat(entregav2.id, "  returning * ");
  return db.oneOrNone(strSql);
};
/* CRUD - DELETE */


exports.deleteEntregav2 = function (id_empresa, id_evento, id) {
  strSql = "delete from entregasv2 \n\t\t where id_empresa = ".concat(id_empresa, " and  id_evento = ").concat(id_evento, " and  id = ").concat(id, "  ");
  return db.oneOrNone(strSql);
};