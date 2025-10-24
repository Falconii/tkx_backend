/* DATA usuarios */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Usuario){
return [ 
			Usuario.id_empresa, 
			Usuario.id, 
			Usuario.cnpj_cpf, 
			Usuario.razao, 
			Usuario.cadastr, 
			Usuario.rua, 
			Usuario.nro, 
			Usuario.complemento, 
			Usuario.bairro, 
			Usuario.cidade, 
			Usuario.uf, 
			Usuario.cep, 
			Usuario.tel1, 
			Usuario.tel2, 
			Usuario.email, 
			Usuario.obs, 
			Usuario.senha, 
			Usuario.grupo, 
			Usuario.ativo, 
			Usuario.user_insert, 
			Usuario.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getUsuario = function(id_empresa,id){
	strSql = ` select   
			   usu.id_empresa as  id_empresa  
			,  usu.id as  id  
			,  usu.cnpj_cpf as  cnpj_cpf  
			,  usu.razao as  razao  
			, to_char(usu.cadastr, 'DD/MM/YYYY') as cadastr  
			,  usu.rua as  rua  
			,  usu.nro as  nro  
			,  usu.complemento as  complemento  
			,  usu.bairro as  bairro  
			,  usu.cidade as  cidade  
			,  usu.uf as  uf  
			,  usu.cep as  cep  
			,  usu.tel1 as  tel1  
			,  usu.tel2 as  tel2  
			,  usu.email as  email  
			,  usu.obs as  obs  
			,  usu.senha as  senha  
			,  usu.grupo as  grupo  
			,  usu.ativo as  ativo  
			,  usu.user_insert as  user_insert  
			,  usu.user_update as  user_update  
			,  gru.descricao as  grupo_descricao    
 			FROM usuarios usu 	  
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo   
			 where usu.id_empresa = ${id_empresa} and  usu.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getUsuarios = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'usu.id_empresa,usu.id';
	if(params.orderby == '000000') orderby = 'usu.id_empresa,usu.id';
	if(params.orderby == '000001') orderby = 'usu.id_empresa,usu.razao';
	if(params.orderby == '000002') orderby = 'usu.id_empresa,usu.grupo,usu.razao';
	if(params.orderby == '000003') orderby = 'usu.id_empresa,usu.id,usu.cnpj_cpf';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `usu.id_empresa = ${params.id_empresa} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `usu.id = ${params.id} `;
	}
	if(params.razao.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `usu.razao = '${params.razao}' `;
		} else 
		{
			where += `usu.razao like '%${params.razao.trim()}%' `;
		}
	}
	if(params.cnpj_cpf.trim()  !== ''){
		if (where != "") where += " and ";
		if (params.sharp) { 
			 where +=  `usu.cnpj_cpf = '${params.cnpj_cpf}' `;
		} else 
		{
			where += `usu.cnpj_cpf like '%${params.cnpj_cpf.trim()}%' `;
		}
	}
	if(params.grupo  !== 0 ){
		if (where != "") where += " and "; 
		where += `usu.grupo = ${params.grupo} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM usuarios usu   
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo   
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   usu.id_empresa as  id_empresa  
			,  usu.id as  id  
			,  usu.cnpj_cpf as  cnpj_cpf  
			,  usu.razao as  razao  
			, to_char(usu.cadastr, 'DD/MM/YYYY') as cadastr  
			,  usu.rua as  rua  
			,  usu.nro as  nro  
			,  usu.complemento as  complemento  
			,  usu.bairro as  bairro  
			,  usu.cidade as  cidade  
			,  usu.uf as  uf  
			,  usu.cep as  cep  
			,  usu.tel1 as  tel1  
			,  usu.tel2 as  tel2  
			,  usu.email as  email  
			,  usu.obs as  obs  
			,  usu.senha as  senha  
			,  usu.grupo as  grupo  
			,  usu.ativo as  ativo  
			,  usu.user_insert as  user_insert  
			,  usu.user_update as  user_update  
			,  gru.descricao as  grupo_descricao     
			FROM usuarios usu   
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo   
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   usu.id_empresa as  id_empresa  
			,  usu.id as  id  
			,  usu.cnpj_cpf as  cnpj_cpf  
			,  usu.razao as  razao  
			, to_char(usu.cadastr, 'DD/MM/YYYY') as cadastr  
			,  usu.rua as  rua  
			,  usu.nro as  nro  
			,  usu.complemento as  complemento  
			,  usu.bairro as  bairro  
			,  usu.cidade as  cidade  
			,  usu.uf as  uf  
			,  usu.cep as  cep  
			,  usu.tel1 as  tel1  
			,  usu.tel2 as  tel2  
			,  usu.email as  email  
			,  usu.obs as  obs  
			,  usu.senha as  senha  
			,  usu.grupo as  grupo  
			,  usu.ativo as  ativo  
			,  usu.user_insert as  user_insert  
			,  usu.user_update as  user_update  
			,  gru.descricao as  grupo_descricao    
			FROM usuarios usu			   
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo  `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertUsuario = function(usuario){
	strSql = `insert into usuarios (
		     id_empresa 
		 ,   cnpj_cpf 
		 ,   razao 
		 ,   cadastr 
		 ,   rua 
		 ,   nro 
		 ,   complemento 
		 ,   bairro 
		 ,   cidade 
		 ,   uf 
		 ,   cep 
		 ,   tel1 
		 ,   tel2 
		 ,   email 
		 ,   obs 
		 ,   senha 
		 ,   grupo 
		 ,   ativo 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${usuario.id_empresa} 
		 ,   '${usuario.cnpj_cpf}' 
		 ,   '${usuario.razao}' 
		 ,   '${usuario.cadastr}' 
		 ,   '${usuario.rua}' 
		 ,   '${usuario.nro}' 
		 ,   '${usuario.complemento}' 
		 ,   '${usuario.bairro}' 
		 ,   '${usuario.cidade}' 
		 ,   '${usuario.uf}' 
		 ,   '${usuario.cep}' 
		 ,   '${usuario.tel1}' 
		 ,   '${usuario.tel2}' 
		 ,   '${usuario.email}' 
		 ,   '${usuario.obs}' 
		 ,   '${usuario.senha}' 
		 ,   ${usuario.grupo} 
		 ,   '${usuario.ativo}' 
		 ,   ${usuario.user_insert} 
		 ,   ${usuario.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateUsuario = function(usuario){
	strSql = `update   usuarios set  
		     cnpj_cpf = '${usuario.cnpj_cpf}' 
 		 ,   razao = '${usuario.razao}' 
 		 ,   cadastr = '${usuario.cadastr}' 
 		 ,   rua = '${usuario.rua}' 
 		 ,   nro = '${usuario.nro}' 
 		 ,   complemento = '${usuario.complemento}' 
 		 ,   bairro = '${usuario.bairro}' 
 		 ,   cidade = '${usuario.cidade}' 
 		 ,   uf = '${usuario.uf}' 
 		 ,   cep = '${usuario.cep}' 
 		 ,   tel1 = '${usuario.tel1}' 
 		 ,   tel2 = '${usuario.tel2}' 
 		 ,   email = '${usuario.email}' 
 		 ,   obs = '${usuario.obs}' 
 		 ,   senha = '${usuario.senha}' 
 		 ,   grupo = ${usuario.grupo} 
 		 ,   ativo = '${usuario.ativo}' 
 		 ,   user_insert = ${usuario.user_insert} 
 		 ,   user_update = ${usuario.user_update} 
 		 where id_empresa = ${usuario.id_empresa} and  id = ${usuario.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteUsuario = function(id_empresa,id){
	strSql = `delete from usuarios 
		 where id_empresa = ${id_empresa} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


