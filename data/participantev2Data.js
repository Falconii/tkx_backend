/* DATA participantesv2 */
const db = require("../infra/database");
const shared = require("../util/shared.js");

/* GET CAMPOS */
exports.getCampos = function (Participantev2) {
  return [
    Participantev2.id_empresa,
    Participantev2.id_evento,
    Participantev2.id,
    Participantev2.inscricao,
    Participantev2.nro_peito,
    Participantev2.id_categoria,
    Participantev2.cnpj_cpf,
    Participantev2.nome,
    Participantev2.sexo,
    Participantev2.data_nasc,
    Participantev2.origem,
    Participantev2.user_insert,
    Participantev2.user_update,
  ];
};
/* CRUD GET */
exports.getParticipantev2 = function (id_empresa, id_evento, id) {
  strSql = ` select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id as  id  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.cnpj_cpf as  cnpj_cpf  
			,  participante.nome as  nome  
			,  participante.sexo as  sexo  
			, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  participante.origem as  origem  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  categoria.descricao as  categoria_descricao    
 			FROM participantesv2 participante 	  
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria   
			 where participante.id_empresa = ${id_empresa} and  participante.id_evento = ${id_evento} and  participante.id = ${id}  `;
  return db.oneOrNone(strSql);
};
/* CRUD GET ALL*/
exports.getParticipantesv2 = function (params) {
  if (params) {
    where = "";
    orderby = "";
    paginacao = "";

    if (params.orderby == "")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.inscricao";
    if (params.orderby == "000000")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.inscricao";
    if (params.orderby == "000001")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.nro_peito";
    if (params.orderby == "000002")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.id_categoria,participante.nome";
    if (params.orderby == "000003")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.nome";
    if (params.orderby == "000004")
      orderby =
        "participante.id_empresa,participante.id_evento,participante.cnpj_cpf";

    if (orderby != "") orderby = " order by " + orderby;
    if (params.id_empresa !== 0) {
      if (where != "") where += " and ";
      where += `participante.id_empresa = ${params.id_empresa} `;
    }
    if (params.id_evento !== 0) {
      if (where != "") where += " and ";
      where += `participante.id_evento = ${params.id_evento} `;
    }
    if (params.id !== 0) {
      if (where != "") where += " and ";
      where += `participante.id = ${params.id} `;
    }
    if (params.inscricao !== 0) {
      if (where != "") where += " and ";
      where += `participante.inscricao = ${params.inscricao} `;
    }
    if (params.nro_peito !== 0) {
      if (where != "") where += " and ";
      where += `participante.nro_peito = ${params.nro_peito} `;
    }
    if (params.id_categoria !== 0) {
      if (where != "") where += " and ";
      where += `participante.id_categoria = ${params.id_categoria} `;
    }
    if (params.nome.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `participante.nome = '${params.nome}' `;
      } else {
        where += `participante.nome like '%${params.nome.trim()}%' `;
      }
    }
    if (params.cnpj_cpf.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `participante.cnpj_cpf = '${params.cnpj_cpf}' `;
      } else {
        where += `participante.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
      }
    }
    if (params.evento_descricao.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `participante.evento_descricao = '${params.evento_descricao}' `;
      } else {
        where += `participante.evento_descricao like '%${params.evento_descricao.trim()}%' `;
      }
    }
    if (params.categoria_descricao.trim() !== "") {
      if (where != "") where += " and ";
      if (params.sharp) {
        where += `participante.categoria_descricao = '${params.categoria_descricao}' `;
      } else {
        where += `participante.categoria_descricao like '%${params.categoria_descricao.trim()}%' `;
      }
    }
    if (where != "") where = " where " + where;
    if (params.pagina != 0) {
      paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
    }
    if (params.contador == "S") {
      sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM participantesv2 participante   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria   
				  ${where} `;
      return db.one(sqlStr);
    } else {
      strSql = `select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id as  id  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.cnpj_cpf as  cnpj_cpf  
			,  participante.nome as  nome  
			,  participante.sexo as  sexo  
			, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  participante.origem as  origem  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  categoria.descricao as  categoria_descricao     
			FROM participantesv2 participante   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria   
			${where} 			${orderby} ${paginacao} `;
      return db.manyOrNone(strSql);
    }
  } else {
    strSql = `select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id as  id  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.cnpj_cpf as  cnpj_cpf  
			,  participante.nome as  nome  
			,  participante.sexo as  sexo  
			, to_char(participante.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  participante.origem as  origem  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  categoria.descricao as  categoria_descricao    
			FROM participantesv2 participante			   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria  `;
    return db.manyOrNone(strSql);
  }
};
/* CRUD - INSERT */
exports.insertParticipantev2 = function (participantev2) {
  strSql = `insert into participantesv2 (
		     id_empresa 
		 ,   id_evento 
		 ,   inscricao 
		 ,   nro_peito 
		 ,   id_categoria 
		 ,   cnpj_cpf 
		 ,   nome 
		 ,   sexo 
		 ,   data_nasc 
		 ,   origem 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${participantev2.id_empresa} 
		 ,   ${participantev2.id_evento} 
		 ,   ${participantev2.inscricao} 
		 ,   ${participantev2.nro_peito} 
		 ,   ${participantev2.id_categoria} 
		 ,   '${participantev2.cnpj_cpf}' 
		 ,   '${participantev2.nome}' 
		 ,   '${participantev2.sexo}' 
		 ,   '${shared.formatDateYYYYMMDD(participantev2.data_nasc)}'
		 ,   '${participantev2.origem}' 
		 ,   ${participantev2.user_insert} 
		 ,   ${participantev2.user_update} 
		 ) 
 returning * `;
  return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
exports.updateParticipantev2 = function (participantev2) {
  strSql = `update   participantesv2 set  
		     inscricao = ${participantev2.inscricao} 
 		 ,   nro_peito = ${participantev2.nro_peito} 
 		 ,   id_categoria = ${participantev2.id_categoria} 
 		 ,   cnpj_cpf = '${participantev2.cnpj_cpf}' 
 		 ,   nome = '${participantev2.nome}' 
 		 ,   sexo = '${participantev2.sexo}' 
 		 ,   data_nasc = '${shared.formatDateYYYYMMDD(participantev2.data_nasc)}'
 		 ,   origem = '${participantev2.origem}' 
 		 ,   user_insert = ${participantev2.user_insert} 
 		 ,   user_update = ${participantev2.user_update} 
 		 where id_empresa = ${participantev2.id_empresa} and  id_evento = ${participantev2.id_evento} and  id = ${participantev2.id}  returning * `;
  return db.oneOrNone(strSql);
};
/* CRUD - DELETE */
exports.deleteParticipantev2 = function (id_empresa, id_evento, id) {
  strSql = `delete from participantesv2 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id = ${id}  `;
  return db.oneOrNone(strSql);
};
