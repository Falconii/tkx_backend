/* SERVICE parametros */
const parametroData = require('../data/parametroData');
const validacao = require('../util/validacao');
const parametros = require('../util/parametroParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/parametroRegra');
const TABELA = 'PARAMETROS';
/* CRUD GET SERVICE */
exports.getParametro = async function(id_empresa,modulo,assinatura,id_usuario){
	return parametroData.getParametro(id_empresa,modulo,assinatura,id_usuario);
};
/* CRUD GET ALL SERVICE */
exports.getParametros = async function(params){
	return parametroData.getParametros(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertParametro = async function(parametro){
try 
{
	await regras.parametro_Inclusao(parametro);
	validacao.Validacao(TABELA,parametro, parametros.parametros());
	return parametroData.insertParametro(parametro);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateParametro = async function(parametro){try 
{
	await regras.parametro_Alteracao(parametro);
	validacao.Validacao(TABELA,parametro, parametros.parametros());
	return parametroData.updateParametro(parametro);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteParametro = async function(id_empresa,modulo,assinatura,id_usuario){try 
{
	await  regras.parametro_Exclusao(id_empresa,modulo,assinatura,id_usuario);
	return parametroData.deleteParametro(id_empresa,modulo,assinatura,id_usuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
