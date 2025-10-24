/* DATA categorias */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Categoria){
return [ 
			Categoria.id_empresa, 
			Categoria.id, 
			Categoria.descricao, 
			Categoria.contador, 
			Categoria.sigla, 
			Categoria.user_insert, 
			Categoria.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getCategoria = function(id_empresa,id){
	strSql = ` select   
			   cat.id_empresa as  id_empresa  
			,  cat.id as  id  
			,  cat.descricao as  descricao  
			,  cat.contador as  contador  
			,  cat.sigla as  sigla  
			,  cat.user_insert as  user_insert  
			,  cat.user_update as  user_update    
 			FROM categorias cat 	     
			 where cat.id_empresa = ${id_empresa} and  cat.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getCategorias = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'cat.id_empresa,cat.id';
	if(params.orderby == '000000') orderby = 'cat.id_empresa,cat.id';
	if(params.orderby == '000001') orderby = 'cat.id_empresa,cat.descricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `cat.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `cat.id = ${params.id} `;
	}
	if(params.descricao.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `cat.descricao = '${params.descricao}' `;
		} else 
		{
			where += `cat.descricao like '%${params.descricao.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM categorias cat      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   cat.id_empresa as  id_empresa  
			,  cat.id as  id  
			,  cat.descricao as  descricao  
			,  cat.contador as  contador  
			,  cat.sigla as  sigla  
			,  cat.user_insert as  user_insert  
			,  cat.user_update as  user_update     
			FROM categorias cat      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   cat.id_empresa as  id_empresa  
			,  cat.id as  id  
			,  cat.descricao as  descricao  
			,  cat.contador as  contador  
			,  cat.sigla as  sigla  
			,  cat.user_insert as  user_insert  
			,  cat.user_update as  user_update    
			FROM categorias cat			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertCategoria = function(categoria){
	strSql = `insert into categorias (
		     id_empresa 
		 ,   descricao 
		 ,   contador 
		 ,   sigla 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${categoria.id_empresa} 
		 ,   '${categoria.descricao}' 
		 ,   '${categoria.contador}' 
		 ,   '${categoria.sigla}' 
		 ,   ${categoria.user_insert} 
		 ,   ${categoria.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateCategoria = function(categoria){
	strSql = `update   categorias set  
		     descricao = '${categoria.descricao}' 
 		 ,   contador = '${categoria.contador}' 
 		 ,   sigla = '${categoria.sigla}' 
 		 ,   user_insert = ${categoria.user_insert} 
 		 ,   user_update = ${categoria.user_update} 
 		 where id_empresa = ${categoria.id_empresa} and  id = ${categoria.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteCategoria = function(id_empresa,id){
	strSql = `delete from categorias 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


