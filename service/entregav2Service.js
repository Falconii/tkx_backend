/* SERVICE entregasv2 */
const entregav2Data = require('../data/entregav2Data');
const validacao = require('../util/validacao');
const parametros = require('../util/entregav2Parametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/entregav2Regra');
const TABELA = 'ENTREGASV2';
/* CRUD GET SERVICE */
exports.getEntregav2 = async function(id_empresa,id_evento,id){
	return entregav2Data.getEntregav2(id_empresa,id_evento,id);
};
/* CRUD GET ALL SERVICE */
exports.getEntregasv2 = async function(params){
	return entregav2Data.getEntregasv2(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertEntregav2 = async function(entregav2){
try 
{
	await regras.entregav2_Inclusao(entregav2);
	validacao.Validacao(TABELA,entregav2, parametros.entregasv2());
	return entregav2Data.insertEntregav2(entregav2);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateEntregav2 = async function(entregav2){try 
{
	await regras.entregav2_Alteracao(entregav2);
	validacao.Validacao(TABELA,entregav2, parametros.entregasv2());
	return entregav2Data.updateEntregav2(entregav2);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteEntregav2 = async function(id_empresa,id_evento,id){try 
{
	await  regras.entregav2_Exclusao(id_empresa,id_evento,id);
	return entregav2Data.deleteEntregav2(id_empresa,id_evento,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
