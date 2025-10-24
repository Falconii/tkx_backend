/* DATA gruposusuarios */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Grupousuario){
return [ 
			Grupousuario.id_empresa, 
			Grupousuario.codigo, 
			Grupousuario.descricao, 
			Grupousuario.user_insert, 
			Grupousuario.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getGrupousuario = function(id_empresa,codigo){
	strSql = ` select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update    
 			FROM gruposusuarios grupo 	     
			 where grupo.id_empresa = ${id_empresa} and  grupo.codigo = ${codigo}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getGruposusuarios = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'grupo.id_empresa,grupo.codigo';
	if(params.orderby == '000000') orderby = 'grupo.id_empresa,grupo.codigo';
	if(params.orderby == '000001') orderby = 'grupo.id_empresa,grupo.codigo';
	if(params.orderby == '000002') orderby = 'grupo.id_empresa,grupo.descricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `grupo.id_empresa = ${params.id_empresa} `;
	}
	if(params.codigo  !== 0 ){
		if (where != "") where += " and "; 
		where += `grupo.codigo = ${params.codigo} `;
	}
	if(params.descricao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `grupo.descricao = '${params.descricao}' `;
		} else 
		{
			where += `grupo.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM gruposusuarios grupo      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update     
			FROM gruposusuarios grupo      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   grupo.id_empresa as  id_empresa  
			,  grupo.codigo as  codigo  
			,  grupo.descricao as  descricao  
			,  grupo.user_insert as  user_insert  
			,  grupo.user_update as  user_update    
			FROM gruposusuarios grupo			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertGrupousuario = function(grupousuario){
	strSql = `insert into gruposusuarios (
		     id_empresa 
		 ,   descricao 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${grupousuario.id_empresa} 
		 ,   '${grupousuario.descricao}' 
		 ,   ${grupousuario.user_insert} 
		 ,   ${grupousuario.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateGrupousuario = function(grupousuario){
	strSql = `update   gruposusuarios set  
		     descricao = '${grupousuario.descricao}' 
 		 ,   user_insert = ${grupousuario.user_insert} 
 		 ,   user_update = ${grupousuario.user_update} 
 		 where id_empresa = ${grupousuario.id_empresa} and  codigo = ${grupousuario.codigo}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteGrupousuario = function(id_empresa,codigo){
	strSql = `delete from gruposusuarios 
		 where id_empresa = ${id_empresa} and  codigo = ${codigo}  `;
 	return  db.oneOrNone(strSql);
}


