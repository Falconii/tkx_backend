/* SERVICE inscritos */
const inscritoData = require('../data/inscritoData');
const validacao = require('../util/validacao');
const parametros = require('../util/inscritoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/inscritoRegra');
const TABELA = 'INSCRITOS';
/* CRUD GET SERVICE */
exports.getInscrito = async function(id_empresa,id){
	return inscritoData.getInscrito(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getInscritos = async function(params){
	return inscritoData.getInscritos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertInscrito = async function(inscrito){
try 
{
	await regras.inscrito_Inclusao(inscrito);
	validacao.Validacao(TABELA,inscrito, parametros.inscritos());
	return inscritoData.insertInscrito(inscrito);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateInscrito = async function(inscrito){try 
{
	await regras.inscrito_Alteracao(inscrito);
	validacao.Validacao(TABELA,inscrito, parametros.inscritos());
	return inscritoData.updateInscrito(inscrito);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteInscrito = async function(id_empresa,id){try 
{
	await  regras.inscrito_Exclusao(id_empresa,id);
	return inscritoData.deleteInscrito(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
