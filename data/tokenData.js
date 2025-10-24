/* DATA tokens */
const db = require('../infra/database');


/* GET CAMPOS */
exports.getCampos = function(Token){
return [ 
			Token.id_empresa, 
			Token.token, 
			Token.tipo, 
			Token.validade, 
			Token.id_usuario, 
			Token.status, 
			Token.user_insert, 
			Token.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getToken = function(id_empresa,id_usuario,token,tipo){
	console.log(token.id_empresa,token.id_usuario,token.token,token.tipo);
	strSql = ` select   
			   token.id_empresa as  id_empresa  
			,  token.token as  token  
			,  token.tipo as  tipo  
			, to_char(token.validade, 'YYYY-MM-DD HH24:MI GMT-0300') as validade  
			,  token.id_usuario as  id_usuario  
			,  token.status as  status  
			,  token.user_insert as  user_insert  
			,  token.user_update as  user_update    
 			FROM tokens token 	     
			 where token.id_empresa = ${id_empresa} and  token.token = '${token}' and  token.tipo = '${tipo}' and  token.id_usuario = ${id_usuario}  `;
	return  db.oneOrNone(strSql);
}

/* CRUD - INSERT */
 exports.insertToken = function(token){
	const query = `
	INSERT INTO tokens (
		id_empresa, token, tipo, validade, id_usuario, status, user_insert, user_update
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8
	) RETURNING *;
	`;

	const values = [
	token.id_empresa,
	token.token,
	token.tipo,
	token.validade,
	token.id_usuario,
	token.status,
	token.user_insert,
	token.user_update
	];
	return db.oneOrNone(query, values);
};

/* CRUD - UPDATE */
 exports.updateToken = function(token){
	strSql = `update   tokens set  
		     validade = '${token.validade}' 
 		 ,   status = ${token.status} 
 		 ,   user_insert = ${token.user_insert} 
 		 ,   user_update = ${token.user_update} 
 		 where id_empresa = ${token.id_empresa} and  token = '${token.token}' and  tipo = '${token.tipo}' and  id_usuario = ${token.id_usuario}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteToken = function(id_empresa,token,tipo,id_usuario){
	strSql = `delete from tokens 
		 where id_empresa = ${id_empresa} and  token = '${token}' and  tipo = '${tipo}' and  id_usuario = ${id_usuario}  `;
 	return  db.oneOrNone(strSql);
}

 exports.deleteTokenByUser = function(id_empresa,id_usuario){
	strSql = `delete from tokens 
		 where id_empresa = ${id_empresa} and  id_usuario = ${id_usuario}  `;
 	return  db.oneOrNone(strSql);
}


exports.getTokenOnly = function(id_empresa, token) {
	  strSql = `SELECT * FROM tokens WHERE id_empresa = ${id_empresa} AND token = '${token}'`;
  return db.oneOrNone(strSql);
}



/* CRUD GET ALL*/
exports.getTokens = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'param.id_empresa,,id_usuario,token,tipo';
	if(params.orderby == '0001') orderby = 'param.id_empresa,,id_usuario,token,tipo';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `token.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_usuario  !== 0  ){
		if (where != "") where += " and "; 
		where += `token.id_usuario = ${params.id_usuario} `;
	}
	if(params.token.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `token.token = '${params.token}' `;
		} else 
		{
			where += `token.token like '%${params.token.trim()}%' `;
		}
	}
	if(params.tipo.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `token.tipo = '${params.tipo}' `;
		} else 
		{
			where += `token.tipo like '%${params.tipo.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM tokens token      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   token.id_empresa as  id_empresa  
			,  token.id_usuario as  id_usuario  
			,  token.token as  token  
			,  token.tipo as  tipo  
			, to_char(token.validade, 'YYYY-MM-DD HH24:MI GMT-0300') as validade  
			,  token.status as  status  
			,  token.user_insert as  user_insert  
			,  token.user_update as  user_update     
			FROM tokens token      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   token.id_empresa as  id_empresa  
			,  token.id_usuario as  id_usuario  
			,  token.token as  token  
			,  token.tipo as  tipo  
			, to_char(token.validade, 'YYYY-MM-DD HH24:MI GMT-0300') as validade  
			,  token.status as  status  
			,  token.user_insert as  user_insert  
			,  token.user_update as  user_update    
			FROM tokens token			     `;
		return  db.manyOrNone(strSql);
	}
}


exports.deleteTokenByUser = function(id_empresa,id_usuario){
	strSql = `delete from tokens 
		 where id_empresa = ${id_empresa} and  id_usuario = ${id_usuario}  `;
 	return  db.oneOrNone(strSql);
}


exports.getTokenOnly = function(id_empresa, token) {
	  strSql = `SELECT * FROM tokens WHERE id_empresa = ${id_empresa} AND token = '${token}'`;
  return db.oneOrNone(strSql);
}


