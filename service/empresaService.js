/* SERVICE empresas */
const empresaData = require('../data/empresaData');
const validacao = require('../util/validacao');
const parametros = require('../util/empresaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/empresaRegra');
const TABELA = 'EMPRESAS';
/* CRUD GET SERVICE */
exports.getEmpresa = async function(id){
	return empresaData.getEmpresa(id);
};
/* CRUD GET ALL SERVICE */
exports.getEmpresas = async function(params){
	return empresaData.getEmpresas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertEmpresa = async function(empresa){
try 
{
	await regras.empresa_Inclusao(empresa);
	validacao.Validacao(TABELA,empresa, parametros.empresas());
	return empresaData.insertEmpresa(empresa);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateEmpresa = async function(empresa){try 
{
	await regras.empresa_Alteracao(empresa);
	validacao.Validacao(TABELA,empresa, parametros.empresas());
	return empresaData.updateEmpresa(empresa);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteEmpresa = async function(id){try 
{
	await  regras.empresa_Exclusao(id);
	return empresaData.deleteEmpresa(id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
