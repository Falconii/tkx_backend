/* DATA usuarios_eventos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Usuario_Evento){
return [ 
			Usuario_Evento.id_empresa, 
			Usuario_Evento.id_evento, 
			Usuario_Evento.id_usuario, 
			Usuario_Evento.link, 
			Usuario_Evento.ativo, 
			Usuario_Evento.user_insert, 
			Usuario_Evento.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getUsuario_Evento = function(id_empresa,id_evento,id_usuario){
	strSql = ` select   
			   usuario_evento.id_empresa as  id_empresa  
			,  usuario_evento.id_evento as  id_evento  
			,  usuario_evento.id_usuario as  id_usuario  
			,  usuario_evento.link as  link  
			,  usuario_evento.ativo as  ativo  
			,  usuario_evento.user_insert as  user_insert  
			,  usuario_evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao  
			,  usuario.cnpj_cpf as  usuario_cnpj_cpf    
 			FROM usuarios_eventos usuario_evento 	  
				 inner join usuarios usuario on usuario_evento.id_empresa = usuario.id_empresa and usuario_evento.id_usuario = usuario.id   
			 where usuario_evento.id_empresa = ${id_empresa} and  usuario_evento.id_evento = ${id_evento} and  usuario_evento.id_usuario = ${id_usuario}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getUsuarios_Eventos = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'usuario_evento.id_empresa,usuario_evento.id_evento,usuario.razao';
	if(params.orderby == '000001') orderby = 'usuario_evento.id_empresa,usuario_evento.id_evento,usuario.razao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `usuario_evento.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `usuario_evento.id_evento = ${params.id_evento} `;
	}
	if(params.id_usuario  !== 0 ){
		if (where != "") where += " and "; 
		where += `usuario_evento.id_usuario = ${params.id_usuario} `;
	}
	if(params.ativo.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `usuario_evento.ativo = '${params.ativo}' `;
		} else 
		{
			where += `usuario_evento.ativo like '%${params.ativo.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM usuarios_eventos usuario_evento   
				 inner join usuarios usuario on usuario_evento.id_empresa = usuario.id_empresa and usuario_evento.id_usuario = usuario.id   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   usuario_evento.id_empresa as  id_empresa  
			,  usuario_evento.id_evento as  id_evento  
			,  usuario_evento.id_usuario as  id_usuario  
			,  usuario_evento.link as  link  
			,  usuario_evento.ativo as  ativo  
			,  usuario_evento.user_insert as  user_insert  
			,  usuario_evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao  
			,  usuario.cnpj_cpf as  usuario_cnpj_cpf     
			FROM usuarios_eventos usuario_evento   
				 inner join usuarios usuario on usuario_evento.id_empresa = usuario.id_empresa and usuario_evento.id_usuario = usuario.id   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   usuario_evento.id_empresa as  id_empresa  
			,  usuario_evento.id_evento as  id_evento  
			,  usuario_evento.id_usuario as  id_usuario  
			,  usuario_evento.link as  link  
			,  usuario_evento.ativo as  ativo  
			,  usuario_evento.user_insert as  user_insert  
			,  usuario_evento.user_update as  user_update  
			,  usuario.razao as  usuario_razao  
			,  usuario.cnpj_cpf as  usuario_cnpj_cpf    
			FROM usuarios_eventos usuario_evento			   
				 inner join usuarios usuario on usuario_evento.id_empresa = usuario.id_empresa and usuario_evento.id_usuario = usuario.id  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertUsuario_Evento = function(usuario_evento){
	strSql = `insert into usuarios_eventos (
		     id_empresa 
		 ,   id_evento 
		 ,   id_usuario 
		 ,   link 
		 ,   ativo 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${usuario_evento.id_empresa} 
		 ,   ${usuario_evento.id_evento} 
		 ,   ${usuario_evento.id_usuario} 
		 ,   '${usuario_evento.link}' 
		 ,   '${usuario_evento.ativo}' 
		 ,   ${usuario_evento.user_insert} 
		 ,   ${usuario_evento.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateUsuario_Evento = function(usuario_evento){
	strSql = `update   usuarios_eventos set  
		     link = '${usuario_evento.link}' 
 		 ,   ativo = '${usuario_evento.ativo}' 
 		 ,   user_insert = ${usuario_evento.user_insert} 
 		 ,   user_update = ${usuario_evento.user_update} 
 		 where id_empresa = ${usuario_evento.id_empresa} and  id_evento = ${usuario_evento.id_evento} and  id_usuario = ${usuario_evento.id_usuario}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteUsuario_Evento = function(id_empresa,id_evento,id_usuario){
	strSql = `delete from usuarios_eventos 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_usuario = ${id_usuario}  `;
 	return  db.oneOrNone(strSql);
}


