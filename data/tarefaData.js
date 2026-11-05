/* DATA tarefas */
const db = require('../infra/database');




/* GET CAMPOS */
exports.getCampos = function(Tarefa){
return [ 
			Tarefa.id_empresa, 
			Tarefa.id, 
			Tarefa.id_usuario, 
			Tarefa.id_file, 
			Tarefa.folder_id, 
			Tarefa.name_file, 
			Tarefa.sigla, 
			Tarefa.data_solicitacao, 
			Tarefa.data_conclusao, 
			Tarefa.parametros, 
			Tarefa.status,
			Tarefa.user_insert, 
			Tarefa.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getTarefa = function(id_empresa,name_file){
	strSql =  `SELECT
				tarefa.id_empresa      AS id_empresa,
				tarefa.id              AS id,
				tarefa.id_usuario      AS id_usuario,
				tarefa.id_file         AS id_file,
				tarefa.folder_id       AS folder_id,
				tarefa.name_file       AS name_file,
				tarefa.sigla           AS sigla,
			    tarefa.data_solicitacao as data_solicitacao  ,
			    tarefa.data_conclusao as data_conclusao , 
				tarefa.parametros      AS parametros,
				tarefa.status          AS status,
				tarefa.user_insert     AS user_insert,
				tarefa.user_update     AS user_update
			FROM tarefas tarefa
			 where tarefa.id_empresa = ${id_empresa} and  tarefa.name_file = '${name_file}'  `;
			 console.log(strSql);
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getTarefas = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'tarefa.id_empresa,tarefa.name_file';
	if(params.orderby == '000001') orderby = 'tarefa.id_empresa,tarefa.name_file';
	if(params.orderby == '000002') orderby = 'tarefa.id_empresa,tarefa.id_usuario,tarefa.name_file';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `tarefa.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `tarefa.id = ${params.id} `;
	}
	if(params.id_usuario  !== 0 ){
		if (where != "") where += " and "; 
		where += `tarefa.id_usuario = ${params.id_usuario} `;
	}
	if(params.sigla.trim()  !== 0 ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `tarefa.sigla = '${params.sigla}' `;
		} else 
		{
			where += `tarefa.sigla like '%${params.sigla.trim()}%' `;
		}
	}
	if(params.name_file.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `tarefa.name_file = '${params.name_file}' `;
		} else 
		{
			where += `tarefa.name_file like '%${params.name_file.trim()}%' `;
		}
	}
	if(params.status.trim()  !== '' ){
		if (where != "") where += " and ";
			 where +=  `tarefa.status = '${params.status}' `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM tarefas tarefa      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `SELECT
				tarefa.id_empresa      AS id_empresa,
				tarefa.id              AS id,
				tarefa.id_usuario      AS id_usuario,
				tarefa.id_file         AS id_file,
				tarefa.folder_id       AS folder_id,
				tarefa.name_file       AS name_file,
				tarefa.sigla           AS sigla,
			    tarefa.data_solicitacao as data_solicitacao , 
			    tarefa.data_conclusao as data_conclusao,  
				tarefa.parametros      AS parametros,
				tarefa.status          AS status
				tarefa.user_insert     AS user_insert,
				tarefa.user_update     AS user_update,
			FROM tarefas tarefa
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   tarefa.id_empresa as  id_empresa  
			,  tarefa.id as  id  
			,  tarefa.id_usuario as  id_usuario  
			,  tarefa.id_file as  id_file  
			,  tarefa.folder_id as  folder_id  
			,  tarefa.name_file as  name_file  
			,  tarefa.sigla as  sigla  
			,  tarefa.data_solicitacao as data_solicitacao  
			,  tarefa.data_conclusao as data_conclusao  
			,  tarefa.parametros as  parametros  
			,  tarefa.user_insert as  user_insert  
			,  tarefa.user_update as  user_update    
			FROM tarefas tarefa			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertTarefa = function(tarefa){
	const strSql = `
	INSERT INTO tarefas (
		id_empresa,
		id_usuario,
		id_file,
		folder_id,
		name_file,
		sigla,
		data_solicitacao,
		data_conclusao,
		parametros,
		status,
		user_insert,
		user_update
	)
	VALUES (
		${tarefa.id_empresa},
		${tarefa.id_usuario},
		'${tarefa.id_file}',
		'${tarefa.folder_id}',
		'${tarefa.name_file}',
		'${tarefa.sigla}',
		'${tarefa.data_solicitacao}', 
		'${tarefa.data_conclusao}',
		'${tarefa.parametros}',
		'${tarefa.status}',
		${tarefa.user_insert},
		${tarefa.user_update}
	)
	RETURNING *;
	`;

	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateTarefa = function(tarefa){
	strSql = `update   tarefas set  
		     id = ${tarefa.id} 
 		 ,   id_usuario = ${tarefa.id_usuario} 
 		 ,   id_file = '${tarefa.id_file}' 
 		 ,   folder_id = '${tarefa.folder_id}' 
 		 ,   sigla = '${tarefa.sigla}' 
 		 ,   data_solicitacao = '${tarefa.data_solicitacao}' 
 		 ,   data_conclusao = '${tarefa.data_conclusao}' 
 		 ,   parametros = '${tarefa.parametros}' 
 		 ,   status = '${tarefa.status}' 
 		 ,   user_insert = ${tarefa.user_insert} 
 		 ,   user_update = ${tarefa.user_update} 
 		 where id_empresa = ${tarefa.id_empresa} and  name_file = '${tarefa.name_file}'  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteTarefa = function(id_empresa,name_file){
	strSql = `delete from tarefas 
		 where id_empresa = ${id_empresa} and  name_file = '${name_file}'  `;
 	return  db.oneOrNone(strSql);
}


