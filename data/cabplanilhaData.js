/* DATA cabplanilhas */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Cabplanilha){
return [ 
			Cabplanilha.id_empresa, 
			Cabplanilha.id_evento, 
			Cabplanilha.id, 
			Cabplanilha.arquivo, 
			Cabplanilha.total_linhas, 
			Cabplanilha.linhas_processadas, 
			Cabplanilha.total_linhas_erro, 
			Cabplanilha.user_insert, 
			Cabplanilha.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getCabplanilha = function(id_empresa,id_evento,id){
	strSql = ` select   
			   cab.id_empresa as  id_empresa  
			,  cab.id_evento as  id_evento  
			,  cab.id as  id  
			,  cab.arquivo as  arquivo  
			,  cab.total_linhas as  total_linhas  
			,  cab.linhas_processadas as  linhas_processadas  
			,  cab.total_linhas_erro as  total_linhas_erro  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update  
			,  evento.descricao as  evento_descricao    
 			FROM cabplanilhas cab 	  
				 inner join eventos evento on evento.id_empresa = cab.id_empresa and evento.id = cab.id_evento   
			 where cab.id_empresa = ${id_empresa} and  cab.id_evento = ${id_evento} and  cab.id = ${id}  `;

			console.log(strSql);
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getCabplanilhas = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'cab.id_empresa,cab.id_evento,cab.id';
	if(params.orderby == '000000') orderby = 'cab.id_empresa,cab.id_evento,cab.id';
	if(params.orderby == '000001') orderby = 'cab.id_empresa,cab.id_evento,cab.arquivo';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `cab.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `cab.id_evento = ${params.id_evento} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `cab.id = ${params.id} `;
	}
	if(params.arquivo.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `cab.arquivo = '${params.arquivo}' `;
		} else 
		{
			where += `cab.arquivo like '%${params.arquivo.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM cabplanilhas cab   
				 inner join eventos evento on evento.id_empresa = cab.id_empresa and evento.id = cab.id_evento   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   cab.id_empresa as  id_empresa  
			,  cab.id_evento as  id_evento  
			,  cab.id as  id  
			,  cab.arquivo as  arquivo  
			,  cab.total_linhas as  total_linhas  
			,  cab.linhas_processadas as  linhas_processadas  
			,  cab.total_linhas_erro as  total_linhas_erro  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update  
			,  evento.descricao as  evento_descricao     
			FROM cabplanilhas cab   
				 inner join eventos evento on evento.id_empresa = cab.id_empresa and evento.id = cab.id_evento   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   cab.id_empresa as  id_empresa  
			,  cab.id_evento as  id_evento  
			,  cab.id as  id  
			,  cab.arquivo as  arquivo  
			,  cab.total_linhas as  total_linhas  
			,  cab.linhas_processadas as  linhas_processadas  
			,  cab.total_linhas_erro as  total_linhas_erro  
			,  cab.user_insert as  user_insert  
			,  cab.user_update as  user_update  
			,  evento.descricao as  evento_descricao    
			FROM cabplanilhas cab			   
				 inner join eventos evento on evento.id_empresa = cab.id_empresa and evento.id = cab.id_evento  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertCabplanilha = function(cabplanilha){
	strSql = `insert into cabplanilhas (
		     id_empresa 
		 ,   id_evento 
		 ,   arquivo 
		 ,   total_linhas 
		 ,   linhas_processadas 
		 ,   total_linhas_erro 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${cabplanilha.id_empresa} 
		 ,   ${cabplanilha.id_evento} 
		 ,   '${cabplanilha.arquivo}' 
		 ,   ${cabplanilha.total_linhas} 
		 ,   ${cabplanilha.linhas_processadas} 
		 ,   ${cabplanilha.total_linhas_erro} 
		 ,   ${cabplanilha.user_insert} 
		 ,   ${cabplanilha.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateCabplanilha = function(cabplanilha){
	strSql = `update   cabplanilhas set  
		     arquivo = '${cabplanilha.arquivo}' 
 		 ,   total_linhas = ${cabplanilha.total_linhas} 
 		 ,   linhas_processadas = ${cabplanilha.linhas_processadas} 
 		 ,   total_linhas_erro = ${cabplanilha.total_linhas_erro} 
 		 ,   user_insert = ${cabplanilha.user_insert} 
 		 ,   user_update = ${cabplanilha.user_update} 
 		 where id_empresa = ${cabplanilha.id_empresa} and  id_evento = ${cabplanilha.id_evento} and  id = ${cabplanilha.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteCabplanilha = function(id_empresa,id_evento,id){
	strSql = `delete from cabplanilhas 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


