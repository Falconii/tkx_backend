/* DATA parametros */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Parametro){
return [ 
			Parametro.id_empresa, 
			Parametro.modulo, 
			Parametro.assinatura, 
			Parametro.id_usuario, 
			Parametro.parametro, 
			Parametro.user_insert, 
			Parametro.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getParametro = function(id_empresa,modulo,assinatura,id_usuario){
	strSql = ` select   
			   param.id_empresa as  id_empresa  
			,  param.modulo as  modulo  
			,  param.assinatura as  assinatura  
			,  param.id_usuario as  id_usuario  
			,  param.parametro as  parametro  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
 			FROM parametros param 	     
			 where param.id_empresa = ${id_empresa} and  param.modulo = '${modulo}' and  param.assinatura = '${assinatura}' and  param.id_usuario = ${id_usuario}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getParametros = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'param.id_empresa';
	if(params.orderby == 'Módulo') orderby = 'param.id_empresa,param.modulo';
	if(params.orderby == 'Usuário') orderby = 'param.id_empresa,param.id_usuario';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_empresa = ${params.id_empresa} `;
	}
	if(params.modulo.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `param.modulo = '${params.modulo}' `;
		} else 
		{
			where += `param.modulo like '%${params.modulo.trim()}%' `;
		}
	}
	if(params.assinatura.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `param.assinatura = '${params.assinatura}' `;
		} else 
		{
			where += `param.assinatura like '%${params.assinatura.trim()}%' `;
		}
	}
	if(params.id_usuario  !== 0 ){
		if (where != "") where += " and "; 
		where += `param.id_usuario = ${params.id_usuario} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM parametros param      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.modulo as  modulo  
			,  param.assinatura as  assinatura  
			,  param.id_usuario as  id_usuario  
			,  param.parametro as  parametro  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update     
			FROM parametros param      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   param.id_empresa as  id_empresa  
			,  param.modulo as  modulo  
			,  param.assinatura as  assinatura  
			,  param.id_usuario as  id_usuario  
			,  param.parametro as  parametro  
			,  param.user_insert as  user_insert  
			,  param.user_update as  user_update    
			FROM parametros param			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertParametro = function(parametro){
	strSql = `insert into parametros (
		     id_empresa 
		 ,   modulo 
		 ,   assinatura 
		 ,   id_usuario 
		 ,   parametro 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${parametro.id_empresa} 
		 ,   '${parametro.modulo}' 
		 ,   '${parametro.assinatura}' 
		 ,   ${parametro.id_usuario} 
		 ,   '${parametro.parametro}' 
		 ,   ${parametro.user_insert} 
		 ,   ${parametro.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateParametro = function(parametro){
	strSql = `update   parametros set  
		     parametro = '${parametro.parametro}' 
 		 ,   user_insert = ${parametro.user_insert} 
 		 ,   user_update = ${parametro.user_update} 
 		 where id_empresa = ${parametro.id_empresa} and  modulo = '${parametro.modulo}' and  assinatura = '${parametro.assinatura}' and  id_usuario = ${parametro.id_usuario}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteParametro = function(id_empresa,modulo,assinatura,id_usuario){
	strSql = `delete from parametros 
		 where id_empresa = ${id_empresa} and  modulo = '${modulo}' and  assinatura = '${assinatura}' and  id_usuario = ${id_usuario}  `;
 	return  db.oneOrNone(strSql);
}


