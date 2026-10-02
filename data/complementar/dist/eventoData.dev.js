"use strict";

/* DATA eventos */
var db = require("../../infra/database");
/* CRUD - UPDATE */


exports.updateStatusEvento = function (evento) {
  strSql = "update   eventos set   \n \t\t ,   status = '".concat(evento.status, "' \n \t\t ,   user_insert = ").concat(evento.user_insert, " \n \t\t ,   user_update = ").concat(evento.user_update, " \n \t\t where id_empresa = ").concat(evento.id_empresa, " and  id = ").concat(evento.id, "  returning * ");
  return db.oneOrNone(strSql);
};

exports.consultaEvento01 = function (evento) {
  strSql = "select                  \n\t\t\t\t\tevento.descricao as  evento_descricao\n\t\t\t\t,  participante.inscricao as  inscricao\n\t\t\t\t,  participante.nome as  inscrito_nome\n\t\t\t\t,  participante.cnpj_cpf as  inscrito_cpf\n\t\t\t\t,  to_char(participante.data_nasc,'DD-MM-YYYY') as  inscrito_dt_nascimento\n\t\t\t\t,  participante.sexo      as  inscrito_sexo\n\t\t\t\t,  participante.nro_peito as  nro_peito\n\t\t\t\t,  categoria.descricao as  categoria_descricao\n\t\t\t\t,  coalesce(entre.rg_retirada,'') as  entre_rg\n\t\t\t\t,  coalesce(entre.nome_retirada,'') as  entre_nome\n\t\t\t\t,  coalesce(entre.tam_camisa,'') as  entre_tam_camisa\n\t\t\t\tFROM participantesv2 participante\n\t\t\t\t\t\t\tinner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\t\t\t\tinner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria\n\t\t\t\t\t\t\tleft  join entregasv2 entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega\n\t\t\t    where participante.id_empresa = ".concat(evento.id_empresa, " and participante.id_evento = ").concat(evento.id, "\t;");
  return db.manyOrNone(strSql);
};

exports.resumoCategoria = function (id_empresa, id_evento) {
  strSql = "select  categoria.descricao as  categoria_descricao,count(*)::int4 as total\n\t\t\t\tFROM participantesv2 participante\n\t\t\t\tinner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento\n\t\t\t\tinner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria\n\t\t\t\tinner join entregasv2 entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega\n\t\t\t    where participante.id_empresa = ".concat(id_empresa, " and participante.id_evento = ").concat(id_evento, "\t\n\t\t\t\tgroup by  categoria.descricao\n\t\t\t\torder by categoria.descricao; ");
  return db.manyOrNone(strSql);
};

exports.resumoOperador = function (id_empresa, id_evento) {
  strSql = "\n\t\t\tselect u.razao,count(*)::int4 as total\n\t\t\tfrom  entregasv2 e \n\t\t\tinner join participantesv2 p on p.id_empresa = 1 and p.id_entrega = e.id \n\t\t\tinner join usuarios u on u.id_empresa = e.id_empresa  and u.id = e.user_insert\n\t\t\twhere e.id_empresa = ".concat(id_empresa, " and e.id_evento = ").concat(id_evento, "\n\t\t\tgroup by u.razao ");
  return db.manyOrNone(strSql);
};

exports.resumoKit = function (id_empresa, id_evento) {
  strSql = "\n\t\t\tselect e.tam_camisa , count(*) ::int4 as total\n\t\t\t\tfrom entregasv2 e\n\t\t\t\tinner join participantesv2 p\n\t\t\t\ton p.id_empresa = e.id_empresa\n\t\t\t\tand p.id_evento = e.id_evento\n\t\t\t\tand p.id_entrega = e.id\n\t\t\t\twhere e.id_empresa = ".concat(id_empresa, " and e.id_evento = ").concat(id_evento, "\n\t\t\t\tgroup by e.tam_camisa \n\t\t\t\torder by e.tam_camisa ");
  return db.manyOrNone(strSql);
};