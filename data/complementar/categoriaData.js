/* DATA categorias */
const db = require('../../infra/database');

/* CRUD GET */
exports.getCategoriaBySigla = function(id_empresa,sigla){
	strSql = ` select   
			   cat.id_empresa as  id_empresa  
			,  cat.id as  id  
			,  cat.descricao as  descricao  
			,  cat.contador as  contador  
			,  cat.sigla as  sigla  
			,  cat.user_insert as  user_insert  
			,  cat.user_update as  user_update    
 			FROM categorias cat 	     
			 where cat.id_empresa = ${id_empresa} and  cat.sigla= '${sigla}' limit 1  `;
	//console.log(strSql)
	return  db.oneOrNone(strSql);
}