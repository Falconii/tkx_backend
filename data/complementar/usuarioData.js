/* DATA usuarios */
const db = require("../../infra/database");

const shared = require("../../util/shared.js");

/* CRUD GET */
exports.getUsuarioByCpf = function (id_empresa,cnpj_cpf) {
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
			,  usu.trocarsenha as  trocarsenha  
			,  usu.user_insert as  user_insert  
			,  usu.user_update as  user_update  
			,  gru.descricao as  grupo_descricao    
 			FROM usuarios usu 	  
				 inner join gruposusuarios gru on gru.id_empresa = usu.id_empresa and gru.codigo = usu.grupo   
			 where usu.id_empresa = ${id_empresa} and  usu.cnpj_cpf = '${cnpj_cpf}' limit 1 `;
			 console.log("getUsuario", strSql);
  return db.oneOrNone(strSql);
};