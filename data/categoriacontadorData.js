/* DATA categoriacontadores */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Categoriacontador){
return [ 
			Categoriacontador.id_empresa, 
			Categoriacontador.id_evento, 
			Categoriacontador.id_categoria, 
			Categoriacontador.contador, 
			Categoriacontador.user_insert, 
			Categoriacontador.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getCategoriacontador = function(id_empresa,id_evento,id_categoria){
	strSql = ` select   
			   catcon.id_empresa as  id_empresa  
			,  catcon.id_evento as  id_evento  
			,  catcon.id_categoria as  id_categoria  
			,  catcon.contador as  contador  
			,  catcon.user_insert as  user_insert  
			,  catcon.user_update as  user_update    
 			FROM categoriacontadores catcon 	     
			 where catcon.id_empresa = ${id_empresa} and  catcon.id_evento = ${id_evento} and  catcon.id_categoria = ${id_categoria}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getCategoriacontadores = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'catcon.id_empresa,catcon.id_evento,catcon.id_categoria';
	if(params.orderby == '000000') orderby = 'catcon.id_empresa,catcon.id_evento,catcon.id_categoria';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `catcon.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `catcon.id_evento = ${params.id_evento} `;
	}
	if(params.id_categoria  !== 0 ){
		if (where != "") where += " and "; 
		where += `catcon.id_categoria = ${params.id_categoria} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM categoriacontadores catcon      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   catcon.id_empresa as  id_empresa  
			,  catcon.id_evento as  id_evento  
			,  catcon.id_categoria as  id_categoria  
			,  catcon.contador as  contador  
			,  catcon.user_insert as  user_insert  
			,  catcon.user_update as  user_update     
			FROM categoriacontadores catcon      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   catcon.id_empresa as  id_empresa  
			,  catcon.id_evento as  id_evento  
			,  catcon.id_categoria as  id_categoria  
			,  catcon.contador as  contador  
			,  catcon.user_insert as  user_insert  
			,  catcon.user_update as  user_update    
			FROM categoriacontadores catcon			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertCategoriacontador = function(categoriacontador){
	strSql = `insert into categoriacontadores (
		     id_empresa 
		 ,   id_evento 
		 ,   id_categoria 
		 ,   contador 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${categoriacontador.id_empresa} 
		 ,   ${categoriacontador.id_evento} 
		 ,   ${categoriacontador.id_categoria} 
		 ,   ${categoriacontador.contador} 
		 ,   ${categoriacontador.user_insert} 
		 ,   ${categoriacontador.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateCategoriacontador = function(categoriacontador){
	strSql = `update   categoriacontadores set  
		     contador = ${categoriacontador.contador} 
 		 ,   user_insert = ${categoriacontador.user_insert} 
 		 ,   user_update = ${categoriacontador.user_update} 
 		 where id_empresa = ${categoriacontador.id_empresa} and  id_evento = ${categoriacontador.id_evento} and  id_categoria = ${categoriacontador.id_categoria}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteCategoriacontador = function(id_empresa,id_evento,id_categoria){
	strSql = `delete from categoriacontadores 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_categoria = ${id_categoria}  `;
 	return  db.oneOrNone(strSql);
}


exports.popula_contadores = function(params){
	strSql = `select _contador from popula_contadores(${params.id_empresa},${params.id_evento},${params.id_planilha})`;
 	return  db.oneOrNone(strSql);
}