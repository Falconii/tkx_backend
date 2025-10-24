/* DATA inscritos */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Inscrito){
return [ 
			Inscrito.id_empresa, 
			Inscrito.id, 
			Inscrito.cnpj_cpf, 
			Inscrito.nome, 
			Inscrito.estrangeiro, 
			Inscrito.sexo, 
			Inscrito.data_nasc, 
			Inscrito.origem, 
			Inscrito.user_insert, 
			Inscrito.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getInscrito = function(id_empresa,id){
	strSql = ` select   
			   inscrito.id_empresa as  id_empresa  
			,  inscrito.id as  id  
			,  inscrito.cnpj_cpf as  cnpj_cpf  
			,  inscrito.nome as  nome  
			,  inscrito.estrangeiro as  estrangeiro  
			,  inscrito.sexo as  sexo  
			, to_char(inscrito.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  inscrito.origem as  origem  
			,  inscrito.user_insert as  user_insert  
			,  inscrito.user_update as  user_update    
 			FROM inscritos inscrito 	     
			 where inscrito.id_empresa = ${id_empresa} and  inscrito.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getInscritos = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'inscrito.id_empresa,inscrito.id';
	if(params.orderby == '00001') orderby = 'inscrito.id_empresa,inscrito.id';
	if(params.orderby == '00002') orderby = 'inscrito.id_empresa,inscrito.cnpj_cpf';
	if(params.orderby == '00003') orderby = 'inscrito.id_empresa,inscrito.nome';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `inscrito.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `inscrito.id = ${params.id} `;
	}
	if(params.nome.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `inscrito.nome = '${params.nome}' `;
		} else 
		{
			where += `inscrito.nome like '%${params.nome.trim()}%' `;
		}
	}
	if(params.cnpj_cpf.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `inscrito.cnpj_cpf = '${params.cnpj_cpf}' `;
		} else 
		{
			where += `inscrito.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
		}
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM inscritos inscrito      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   inscrito.id_empresa as  id_empresa  
			,  inscrito.id as  id  
			,  inscrito.cnpj_cpf as  cnpj_cpf  
			,  inscrito.nome as  nome  
			,  inscrito.estrangeiro as  estrangeiro  
			,  inscrito.sexo as  sexo  
			, to_char(inscrito.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  inscrito.origem as  origem  
			,  inscrito.user_insert as  user_insert  
			,  inscrito.user_update as  user_update     
			FROM inscritos inscrito      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   inscrito.id_empresa as  id_empresa  
			,  inscrito.id as  id  
			,  inscrito.cnpj_cpf as  cnpj_cpf  
			,  inscrito.nome as  nome  
			,  inscrito.estrangeiro as  estrangeiro  
			,  inscrito.sexo as  sexo  
			, to_char(inscrito.data_nasc, 'DD/MM/YYYY') as data_nasc  
			,  inscrito.origem as  origem  
			,  inscrito.user_insert as  user_insert  
			,  inscrito.user_update as  user_update    
			FROM inscritos inscrito			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertInscrito = function(inscrito){
	strSql = `insert into inscritos (
		     id_empresa 
		 ,   cnpj_cpf 
		 ,   nome 
		 ,   estrangeiro 
		 ,   sexo 
		 ,   data_nasc 
		 ,   origem 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${inscrito.id_empresa} 
		 ,   '${inscrito.cnpj_cpf}' 
		 ,   '${inscrito.nome}' 
		 ,   '${inscrito.estrangeiro}' 
		 ,   '${inscrito.sexo}' 
		 ,   '${inscrito.data_nasc}' 
		 ,   '${inscrito.origem}' 
		 ,   ${inscrito.user_insert} 
		 ,   ${inscrito.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateInscrito = function(inscrito){
	strSql = `update   inscritos set  
		     cnpj_cpf = '${inscrito.cnpj_cpf}' 
 		 ,   nome = '${inscrito.nome}' 
 		 ,   estrangeiro = '${inscrito.estrangeiro}' 
 		 ,   sexo = '${inscrito.sexo}' 
 		 ,   data_nasc = '${inscrito.data_nasc}' 
 		 ,   origem = '${inscrito.origem}' 
 		 ,   user_insert = ${inscrito.user_insert} 
 		 ,   user_update = ${inscrito.user_update} 
 		 where id_empresa = ${inscrito.id_empresa} and  id = ${inscrito.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteInscrito = function(id_empresa,id){
	strSql = `delete from inscritos 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


