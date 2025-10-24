/* DATA categorias */
const db = require('../../infra/database');

/* CRUD GET */
exports.getInscritoByCpf = function(id_empresa,cnpj_cpf){
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
			 where inscrito.id_empresa = ${id_empresa} and  inscrito.cnpj_cpf = '${cnpj_cpf}' limit 1`;
	return  db.oneOrNone(strSql);
}