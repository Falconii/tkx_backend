/* DATA participantes */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Participante){
return [ 
			Participante.id_empresa, 
			Participante.id_evento, 
			Participante.id_inscrito, 
			Participante.inscricao, 
			Participante.nro_peito, 
			Participante.id_categoria, 
			Participante.id_old_inscrito, 
			Participante.user_insert, 
			Participante.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getParticipante = function(id_empresa,id_evento,id_inscrito){
	strSql = ` select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id_inscrito as  id_inscrito  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.id_old_inscrito as  id_old_inscrito  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  inscrito.nome as  inscrito_nome  
			,  inscrito.cnpj_cpf as  inscrito_cpf  
			,  categoria.descricao as  categoria_descricao  
			,  coalesce(link.token,'') as  link_token  
			,  coalesce(link.link,'') as  link_link  
			,  coalesce(old.nome,'') as  old_nome  
			,  coalesce(old.cnpj_cpf,'') as  old_cpf    
 			FROM participantes participante 	  
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join inscritos inscrito on inscrito.id_empresa = evento.id_empresa and inscrito.id = participante.id_inscrito
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				 left join links link on link.id_empresa = participante.id_empresa and link.id_evento = participante.id_evento and link.id_inscrito = participante.id_old_inscrito
				 left join inscritos old on old.id_empresa = participante.id_empresa  and old.id  = participante.id_old_inscrito   
			 where participante.id_empresa = ${id_empresa} and  participante.id_evento = ${id_evento} and  participante.id_inscrito = ${id_inscrito}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getParticipantes = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.id_inscrito';
	if(params.orderby == '000000') orderby = 'participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.id_inscrito';
	if(params.orderby == '000001') orderby = 'participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.nro_peito';
	if(params.orderby == '000002') orderby = 'participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.id_categoria';
	if(params.orderby == '000002') orderby = 'participante.id_empresa,participante.id_evento,particpante.inscrito_nome';
	if(params.orderby == '000003') orderby = 'participante.id_empresa,participante.id_evento,participante.inscriot_cpf';
	if(params.orderby == '000003') orderby = 'participante.id_empresa,participante.id_evento,participante.categoria_participante';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.id_evento = ${params.id_evento} `;
	}
	if(params.id_inscrito  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.id_inscrito = ${params.id_inscrito} `;
	}
	if(params.inscricao  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.inscricao = ${params.inscricao} `;
	}
	if(params.nro_peito  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.nro_peito = ${params.nro_peito} `;
	}
	if(params.id_categoria  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.id_categoria = ${params.id_categoria} `;
	}
	if(params.evento_descricao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `participante.evento_descricao = '${params.evento_descricao}' `;
		} else 
		{
			where += `participante.evento_descricao like '%${params.evento_descricao.trim()}%' `;
		}
	}
	if(params.inscrito_nome.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `participante.inscrito_nome = '${params.inscrito_nome}' `;
		} else 
		{
			where += `participante.inscrito_nome like '%${params.inscrito_nome.trim()}%' `;
		}
	}
	if(params.inscrito_cpf.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `participante.inscrito_cpf = '${params.inscrito_cpf}' `;
		} else 
		{
			where += `participante.inscrito_cpf like '%${params.inscrito_cpf.trim()}%' `;
		}
	}
	if(params.categoria_descricao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `participante.categoria_descricao = '${params.categoria_descricao}' `;
		} else 
		{
			where += `participante.categoria_descricao like '%${params.categoria_descricao.trim()}%' `;
		}
	}
	if(params.id_old_inscrito  !== 0 ){
		if (where != "") where += " and "; 
		where += `participante.id_old_inscrito = ${params.id_old_inscrito} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM participantes participante   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join inscritos inscrito on inscrito.id_empresa = evento.id_empresa and inscrito.id = participante.id_inscrito
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				 left join links link on link.id_empresa = participante.id_empresa and link.id_evento = participante.id_evento and link.id_inscrito = participante.id_old_inscrito
				 left join inscritos old on old.id_empresa = participante.id_empresa  and old.id  = participante.id_old_inscrito   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id_inscrito as  id_inscrito  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.id_old_inscrito as  id_old_inscrito  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  inscrito.nome as  inscrito_nome  
			,  inscrito.cnpj_cpf as  inscrito_cpf  
			,  categoria.descricao as  categoria_descricao  
			,  coalesce(link.token,'') as  link_token  
			,  coalesce(link.link,'') as  link_link  
			,  coalesce(old.nome,'') as  old_nome  
			,  coalesce(old.cnpj_cpf,'') as  old_cpf     
			FROM participantes participante   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join inscritos inscrito on inscrito.id_empresa = evento.id_empresa and inscrito.id = participante.id_inscrito
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				 left join links link on link.id_empresa = participante.id_empresa and link.id_evento = participante.id_evento and link.id_inscrito = participante.id_old_inscrito
				 left join inscritos old on old.id_empresa = participante.id_empresa  and old.id  = participante.id_old_inscrito   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   participante.id_empresa as  id_empresa  
			,  participante.id_evento as  id_evento  
			,  participante.id_inscrito as  id_inscrito  
			,  participante.inscricao as  inscricao  
			,  participante.nro_peito as  nro_peito  
			,  participante.id_categoria as  id_categoria  
			,  participante.id_old_inscrito as  id_old_inscrito  
			,  participante.user_insert as  user_insert  
			,  participante.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  inscrito.nome as  inscrito_nome  
			,  inscrito.cnpj_cpf as  inscrito_cpf  
			,  categoria.descricao as  categoria_descricao  
			,  coalesce(link.token,'') as  link_token  
			,  coalesce(link.link,'') as  link_link  
			,  coalesce(old.nome,'') as  old_nome  
			,  coalesce(old.cnpj_cpf,'') as  old_cpf    
			FROM participantes participante			   
				 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				 inner join inscritos inscrito on inscrito.id_empresa = evento.id_empresa and inscrito.id = participante.id_inscrito
				 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				 left join links link on link.id_empresa = participante.id_empresa and link.id_evento = participante.id_evento and link.id_inscrito = participante.id_old_inscrito
				 left join inscritos old on old.id_empresa = participante.id_empresa  and old.id  = participante.id_inscrito  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertParticipante = function(participante){
	strSql = `insert into participantes (
		     id_empresa 
		 ,   id_evento 
		 ,   id_inscrito 
		 ,   inscricao 
		 ,   nro_peito 
		 ,   id_categoria 
		 ,   id_old_inscrito 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${participante.id_empresa} 
		 ,   ${participante.id_evento} 
		 ,   ${participante.id_inscrito} 
		 ,   ${participante.inscricao} 
		 ,   ${participante.nro_peito} 
		 ,   ${participante.id_categoria} 
		 ,   ${participante.id_old_inscrito} 
		 ,   ${participante.user_insert} 
		 ,   ${participante.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateParticipante = function(participante){
	strSql = `update   participantes set  
		     inscricao = ${participante.inscricao} 
 		 ,   nro_peito = ${participante.nro_peito} 
 		 ,   id_categoria = ${participante.id_categoria} 
 		 ,   id_old_inscrito = ${participante.id_old_inscrito} 
 		 ,   user_insert = ${participante.user_insert} 
 		 ,   user_update = ${participante.user_update} 
 		 where id_empresa = ${participante.id_empresa} and  id_evento = ${participante.id_evento} and  id_inscrito = ${participante.id_inscrito}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteParticipante = function(id_empresa,id_evento,id_inscrito){
	strSql = `delete from participantes 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_inscrito = ${id_inscrito}  `;
 	return  db.oneOrNone(strSql);
}


