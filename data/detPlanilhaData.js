/* DATA detPlanilhas */
const db = require('../infra/database');
const shared = require("../util/shared.js");

/* GET CAMPOS */
exports.getCampos = function(Detplanilha){
return [ 
			Detplanilha.id_empresa, 
			Detplanilha.id_evento, 
			Detplanilha.id_cabec, 
			Detplanilha.cnpj_cpf, 
			Detplanilha.nome, 
			Detplanilha.estrangeiro, 
			Detplanilha.sexo, 
			Detplanilha.data_nasc, 
			Detplanilha.inscricao, 
			Detplanilha.nro_peito, 
			Detplanilha.id_categoria, 
			Detplanilha.id_inscrito, 
			Detplanilha.status, 
			Detplanilha.mensagem_erro, 
			Detplanilha.user_insert, 
			Detplanilha.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getDetplanilha = function(id_empresa,id_evento,id_cabec,nro_peito){
	strSql = ` select   
			   det.id_empresa as  id_empresa  
			,  det.id_evento as  id_evento  
			,  det.id_cabec as  id_cabec  
			,  det.cnpj_cpf as  cnpj_cpf  
			,  det.nome as  nome  
			,  det.estrangeiro as  estrangeiro  
			,  det.sexo as  sexo  
			,  det.data_nasc as  data_nasc  
			,  det.inscricao as  inscricao  
			,  det.nro_peito as  nro_peito  
			,  det.id_categoria as  id_categoria  
			,  det.id_inscrito as  id_inscrito  
			,  det.status as  status  
			,  det.mensagem_erro as  mensagem_erro  
			,  det.user_insert as  user_insert  
			,  det.user_update as  user_update  
			,  evento.descricao as  evento_descricao   
			,  coalesce(cat.descricao,'') as cat_descricao    
 			FROM detPlanilhas det 	  
				 inner join eventos evento on evento.id_empresa = det.id_empresa and evento.id = det.id_evento  
				 left  join categorias cat on cat.id_empresa = det.id_empresa and cat.id = id_categoria
			 where det.id_empresa = ${id_empresa} and  det.id_evento = ${id_evento} and  det.id_cabec = ${id_cabec} and  det.nro_peito = ${nro_peito}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getDetplanilhas = function(params){
console.log("getDetplanilhas",params);	
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'det.id_empresa,det.id_evento,det.nome';
	if(params.orderby == '000000') orderby = 'det.id_empresa,det.id_evento,det.nome';
	if(params.orderby == '000001') orderby = 'det.id_empresa,det.id_evento,det.cnpj_cpf';
	if(params.orderby == '000002') orderby = 'det.id_empresa,det.id_evento,det.nro_peito';
	if(params.orderby == '000003') orderby = 'det.id_empresa,det.id_evento,det.inscricao';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `det.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `det.id_evento = ${params.id_evento} `;
	}
	if(params.id_cabec  !== 0 ){
		if (where != "") where += " and "; 
		where += `det.id_cabec = ${params.id_cabec} `;
	}
	if(params.nro_peito  !== -1 ){
		if (where != "") where += " and "; 
		where += `det.nro_peito = ${params.nro_peito} `;
	}
	if(params.cnpj_cpf.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `det.cnpj_cpf = '${params.cnpj_cpf}' `;
		} else 
		{
			where += `det.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
		}
	}
	if(params.inscricao  !== -1 ){
		if (where != "") where += " and "; 
		where += `det.inscricao = ${params.inscricao} `;
	}
	if(params.nome.trim()  !== '' ){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `unaccent(det.nome) = '${shared.semAcento(params.nome.trim())}' `
		} else 
		{
			where += `unaccent(det.nome) like '%${shared.semAcento(params.nome.trim())}%' `;
		}
	}
	if(params.status  !== -1 ){
		if (where != "") where += " and "; 
		where += `det.status = ${params.status} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM detPlanilhas det   
				 inner join eventos evento on evento.id_empresa = det.id_empresa and evento.id = det.id_evento   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   det.id_empresa as  id_empresa  
			,  det.id_evento as  id_evento  
			,  det.id_cabec as  id_cabec  
			,  det.cnpj_cpf as  cnpj_cpf  
			,  det.nome as  nome  
			,  det.estrangeiro as  estrangeiro  
			,  det.sexo as  sexo  
			,  det.data_nasc as  data_nasc  
			,  det.inscricao as  inscricao  
			,  det.nro_peito as  nro_peito  
			,  det.id_categoria as  id_categoria  
			,  det.id_inscrito as  id_inscrito  
			,  det.status as  status  
			,  det.mensagem_erro as  mensagem_erro  
			,  det.user_insert as  user_insert  
			,  det.user_update as  user_update  
			,  evento.descricao as  evento_descricao  
			,  coalesce(cat.descricao,'') as cat_descricao   
			FROM detPlanilhas det   
				 inner join eventos evento on evento.id_empresa = det.id_empresa and evento.id = det.id_evento   
				 left  join categorias cat on cat.id_empresa = det.id_empresa and cat.id = id_categoria
			${where} 			${ orderby} ${ paginacao} `;
			console.log("getDetplanilhas->",strSql);
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   det.id_empresa as  id_empresa  
			,  det.id_evento as  id_evento  
			,  det.id_cabec as  id_cabec  
			,  det.cnpj_cpf as  cnpj_cpf  
			,  det.nome as  nome  
			,  det.estrangeiro as  estrangeiro  
			,  det.sexo as  sexo  
			,  det.data_nasc as  data_nasc  
			,  det.inscricao as  inscricao  
			,  det.nro_peito as  nro_peito  
			,  det.id_categoria as  id_categoria  
			,  det.id_inscrito as  id_inscrito  
			,  det.status as  status  
			,  det.mensagem_erro as  mensagem_erro  
			,  det.user_insert as  user_insert  
			,  det.user_update as  user_update  
			,  evento.descricao as  evento_descricao    
			FROM detPlanilhas det			   
				 inner join eventos evento on evento.id_empresa = det.id_empresa and evento.id = det.id_evento  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertDetplanilha = function(detPlanilha){
	strSql = `insert into detPlanilhas (
		     id_empresa 
		 ,   id_evento 
		 ,   id_cabec 
		 ,   cnpj_cpf 
		 ,   nome 
		 ,   estrangeiro 
		 ,   sexo 
		 ,   data_nasc 
		 ,   inscricao 
		 ,   nro_peito 
		 ,   id_categoria 
		 ,   id_inscrito 
		 ,   status 
		 ,   mensagem_erro 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${detPlanilha.id_empresa} 
		 ,   ${detPlanilha.id_evento} 
		 ,   ${detPlanilha.id_cabec} 
		 ,   '${detPlanilha.cnpj_cpf}' 
		 ,   '${detPlanilha.nome}' 
		 ,   '${detPlanilha.estrangeiro}' 
		 ,   '${detPlanilha.sexo}' 
		 ,   '${detPlanilha.data_nasc}' 
		 ,   ${detPlanilha.inscricao} 
		 ,   ${detPlanilha.nro_peito} 
		 ,   ${detPlanilha.id_categoria} 
		 ,   ${detPlanilha.id_inscrito} 
		 ,   ${detPlanilha.status} 
		 ,   '${detPlanilha.mensagem_erro}' 
		 ,   ${detPlanilha.user_insert} 
		 ,   ${detPlanilha.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateDetplanilha = function(detPlanilha){
	strSql = `update   detPlanilhas set  
		     cnpj_cpf = '${detPlanilha.cnpj_cpf}' 
 		 ,   nome = '${detPlanilha.nome}' 
 		 ,   estrangeiro = '${detPlanilha.estrangeiro}' 
 		 ,   sexo = '${detPlanilha.sexo}' 
 		 ,   data_nasc = '${detPlanilha.data_nasc}' 
 		 ,   inscricao = ${detPlanilha.inscricao} 
 		 ,   id_categoria = ${detPlanilha.id_categoria} 
 		 ,   id_inscrito = ${detPlanilha.id_inscrito} 
 		 ,   status = ${detPlanilha.status} 
 		 ,   mensagem_erro = '${detPlanilha.mensagem_erro}' 
 		 ,   user_insert = ${detPlanilha.user_insert} 
 		 ,   user_update = ${detPlanilha.user_update} 
 		 where id_empresa = ${detPlanilha.id_empresa} and  id_evento = ${detPlanilha.id_evento} and  id_cabec = ${detPlanilha.id_cabec} and  nro_peito = ${detPlanilha.nro_peito}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteDetplanilha = function(id_empresa,id_evento,id_cabec,nro_peito){
	strSql = `delete from detPlanilhas 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_cabec = ${id_cabec} and  nro_peito = ${nro_peito}  `;
 	return  db.oneOrNone(strSql);
}


