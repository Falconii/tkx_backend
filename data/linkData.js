/* DATA links */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Link){
return [ 
			Link.id_empresa, 
			Link.id_evento, 
			Link.id_inscrito, 
			Link.id_resp, 
			Link.hora_inicial, 
			Link.hora_final, 
			Link.token, 
			Link.link, 
			Link.status, 
			Link.user_insert, 
			Link.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getLink = function(id_empresa,id_evento,id_inscrito){
	strSql = ` select   
			   link.id_empresa as  id_empresa  
			,  link.id_evento as  id_evento  
			,  link.id_inscrito as  id_inscrito  
			,  link.id_resp as  id_resp  
			, to_char(link.hora_inicial, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_inicial  
			, to_char(link.hora_final, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_final  
			,  link.token as  token  
			,  link.link as  link  
			,  link.status as  status  
			,  link.user_insert as  user_insert  
			,  link.user_update as  user_update    
 			FROM links link 	     
			 where link.id_empresa = ${id_empresa} and  link.id_evento = ${id_evento} and  link.id_inscrito = ${id_inscrito}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getLnks = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'link.id_empresa,link.id_evento';
	if(params.orderby == '000000') orderby = 'link.id_empresa,link.id_evento';
	if(params.orderby == '000001') orderby = 'link.id_empresa,link.id_evento,link.id_inscrito';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `link.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `link.id_evento = ${params.id_evento} `;
	}
	if(params.id_inscrito  !== 0 ){
		if (where != "") where += " and "; 
		where += `link.id_inscrito = ${params.id_inscrito} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM links link      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   link.id_empresa as  id_empresa  
			,  link.id_evento as  id_evento  
			,  link.id_inscrito as  id_inscrito  
			,  link.id_resp as  id_resp  
			, to_char(link.hora_inicial, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_inicial  
			, to_char(link.hora_final, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_final  
			,  link.token as  token  
			,  link.link as  link  
			,  link.status as  status  
			,  link.user_insert as  user_insert  
			,  link.user_update as  user_update     
			FROM links link      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   link.id_empresa as  id_empresa  
			,  link.id_evento as  id_evento  
			,  link.id_inscrito as  id_inscrito  
			,  link.id_resp as  id_resp  
			, to_char(link.hora_inicial, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_inicial  
			, to_char(link.hora_final, 'YYYY-MM-DD HH24:MI GMT-0300') as hora_final  
			,  link.token as  token  
			,  link.link as  link  
			,  link.status as  status  
			,  link.user_insert as  user_insert  
			,  link.user_update as  user_update    
			FROM links link			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertLink = function(link){
	strSql = `insert into links (
		     id_empresa 
		 ,   id_evento 
		 ,   id_inscrito 
		 ,   id_resp 
		 ,   hora_inicial 
		 ,   hora_final 
		 ,   token 
		 ,   link 
		 ,   status 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${link.id_empresa} 
		 ,   ${link.id_evento} 
		 ,   ${link.id_inscrito} 
		 ,   ${link.id_resp} 
		 ,   '${link.hora_inicial.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${link.hora_final.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   '${link.token}' 
		 ,   '${link.link}' 
		 ,   '${link.status}' 
		 ,   ${link.user_insert} 
		 ,   ${link.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateLink = function(link){
	strSql = `update   links set  
		     id_resp = ${link.id_resp} 
 		 ,   hora_inicial = '${link.hora_inicial.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   hora_final = '${link.hora_final.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   token = '${link.token}' 
 		 ,   link = '${link.link}' 
 		 ,   status = '${link.status}' 
 		 ,   user_insert = ${link.user_insert} 
 		 ,   user_update = ${link.user_update} 
 		 where id_empresa = ${link.id_empresa} and  id_evento = ${link.id_evento} and  id_inscrito = ${link.id_inscrito}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteLink = function(id_empresa,id_evento,id_inscrito){
	strSql = `delete from links 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_inscrito = ${id_inscrito}  `;
 	return  db.oneOrNone(strSql);
}


