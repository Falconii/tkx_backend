/* DATA eventos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Evento){
return [ 
			Evento.id_empresa, 
			Evento.id, 
			Evento.descricao, 
			Evento.id_responsavel, 
			Evento.rua, 
			Evento.nro, 
			Evento.complemento, 
			Evento.bairro, 
			Evento.cidade, 
			Evento.uf, 
			Evento.cep, 
			Evento.inicio, 
			Evento.final, 
			Evento.obs, 
			Evento.status, 
			Evento.user_insert, 
			Evento.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getEvento = function(id_empresa,id){
	strSql = ` select   
			   evento.id_empresa as  id_empresa  
			,  evento.id as  id  
			,  evento.descricao as  descricao  
			,  evento.id_responsavel as  id_responsavel  
			,  evento.rua as  rua  
			,  evento.nro as  nro  
			,  evento.complemento as  complemento  
			,  evento.bairro as  bairro  
			,  evento.cidade as  cidade  
			,  evento.uf as  uf  
			,  evento.cep as  cep  
			, to_char(evento.inicio, 'YYYY-MM-DD HH24:MI GMT-0300') as inicio  
			, to_char(evento.final, 'YYYY-MM-DD HH24:MI GMT-0300') as final  
			,  evento.obs as  obs  
			,  evento.status as  status  
			,  evento.user_insert as  user_insert  
			,  evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao    
 			FROM eventos evento 	  
				 inner join usuarios usuario on evento.id_empresa = usuario.id_empresa and evento.id_responsavel = usuario.id   
			 where evento.id_empresa = ${id_empresa} and  evento.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getEventos = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'evento.id_empresa,evento.id';
	if(params.orderby == '000000') orderby = 'evento.id_empresa,evento.id';
	if(params.orderby == '000001') orderby = 'evento.id_empresa,evento.descricao';
	if(params.orderby == '000002') orderby = 'evento.id_empresa,evento.id,evento.id_responsavel';
	if(params.orderby == '000003') orderby = 'evento.id_empresa,evento.id,evento.status';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `evento.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `evento.id = ${params.id} `;
	}
	if(params.descricao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `evento.descricao = '${params.descricao}' `;
		} else 
		{
			where += `evento.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if(params.id_responsavel  !== 0 ){
		if (where != "") where += " and "; 
		where += `evento.id_responsavel = ${params.id_responsavel} `;
	}
	if(params.status.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `evento.status = '${params.status}' `;
		} else 
		{
			where += `evento.status like '%${params.status.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM eventos evento   
				 inner join usuarios usuario on evento.id_empresa = usuario.id_empresa and evento.id_responsavel = usuario.id   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   evento.id_empresa as  id_empresa  
			,  evento.id as  id  
			,  evento.descricao as  descricao  
			,  evento.id_responsavel as  id_responsavel  
			,  evento.rua as  rua  
			,  evento.nro as  nro  
			,  evento.complemento as  complemento  
			,  evento.bairro as  bairro  
			,  evento.cidade as  cidade  
			,  evento.uf as  uf  
			,  evento.cep as  cep  
			, to_char(evento.inicio, 'YYYY-MM-DD HH24:MI GMT-0300') as inicio  
			, to_char(evento.final, 'YYYY-MM-DD HH24:MI GMT-0300') as final  
			,  evento.obs as  obs  
			,  evento.status as  status  
			,  evento.user_insert as  user_insert  
			,  evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao     
			FROM eventos evento   
				 inner join usuarios usuario on evento.id_empresa = usuario.id_empresa and evento.id_responsavel = usuario.id   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   evento.id_empresa as  id_empresa  
			,  evento.id as  id  
			,  evento.descricao as  descricao  
			,  evento.id_responsavel as  id_responsavel  
			,  evento.rua as  rua  
			,  evento.nro as  nro  
			,  evento.complemento as  complemento  
			,  evento.bairro as  bairro  
			,  evento.cidade as  cidade  
			,  evento.uf as  uf  
			,  evento.cep as  cep  
			, to_char(evento.inicio, 'YYYY-MM-DD HH24:MI GMT-0300') as inicio  
			, to_char(evento.final, 'YYYY-MM-DD HH24:MI GMT-0300') as final  
			,  evento.obs as  obs  
			,  evento.status as  status  
			,  evento.user_insert as  user_insert  
			,  evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao    
			FROM eventos evento			   
				 inner join usuarios usuario on evento.id_empresa = usuario.id_empresa and evento.id_responsavel = usuario.id  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertEvento = function(evento){
	strSql = `insert into eventos (
		     id_empresa 
		 ,   descricao 
		 ,   id_responsavel 
		 ,   rua 
		 ,   nro 
		 ,   complemento 
		 ,   bairro 
		 ,   cidade 
		 ,   uf 
		 ,   cep 
		 ,   inicio 
		 ,   final 
		 ,   obs 
		 ,   status 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${evento.id_empresa} 
		 ,   '${evento.descricao}' 
		 ,   ${evento.id_responsavel} 
		 ,   '${evento.rua}' 
		 ,   '${evento.nro}' 
		 ,   '${evento.complemento}' 
		 ,   '${evento.bairro}' 
		 ,   '${evento.cidade}' 
		 ,   '${evento.uf}' 
		 ,   '${evento.cep}' 
		 ,   '${evento.inicio.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${evento.final.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${evento.obs}' 
		 ,   ${evento.status} 
		 ,   ${evento.user_insert} 
		 ,   ${evento.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateEvento = function(evento){
	strSql = `update   eventos set  
		     descricao = '${evento.descricao}' 
 		 ,   id_responsavel = ${evento.id_responsavel} 
 		 ,   rua = '${evento.rua}' 
 		 ,   nro = '${evento.nro}' 
 		 ,   complemento = '${evento.complemento}' 
 		 ,   bairro = '${evento.bairro}' 
 		 ,   cidade = '${evento.cidade}' 
 		 ,   uf = '${evento.uf}' 
 		 ,   cep = '${evento.cep}' 
 		 ,   inicio = '${evento.inicio.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   final = '${evento.final.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   obs = '${evento.obs}' 
 		 ,   status = ${evento.status} 
 		 ,   user_insert = ${evento.user_insert} 
 		 ,   user_update = ${evento.user_update} 
 		 where id_empresa = ${evento.id_empresa} and  id = ${evento.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteEvento = function(id_empresa,id){
	strSql = `delete from eventos 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


