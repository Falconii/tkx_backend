/* SERVICE cabplanilhas */
const cabplanilhaData = require('../data/cabplanilhaData');
const validacao = require('../util/validacao');
const parametros = require('../util/cabplanilhaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/cabplanilhaRegra');
const TABELA = 'CABPLANILHAS';
/* CRUD GET SERVICE */
exports.getCabplanilha = async function(id_empresa,id_evento,id){
	return cabplanilhaData.getCabplanilha(id_empresa,id_evento,id);
};
/* CRUD GET ALL SERVICE */
exports.getCabplanilhas = async function(params){
	return cabplanilhaData.getCabplanilhas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCabplanilha = async function(cabplanilha){
try 
{
	await regras.cabplanilha_Inclusao(cabplanilha);
	validacao.Validacao(TABELA,cabplanilha, parametros.cabplanilhas());
	return cabplanilhaData.insertCabplanilha(cabplanilha);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCabplanilha = async function(cabplanilha){try 
{
	await regras.cabplanilha_Alteracao(cabplanilha);
	validacao.Validacao(TABELA,cabplanilha, parametros.cabplanilhas());
	return cabplanilhaData.updateCabplanilha(cabplanilha);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCabplanilha = async function(id_empresa,id_evento,id){try 
{
	await  regras.cabplanilha_Exclusao(id_empresa,id_evento,id);
	return cabplanilhaData.deleteCabplanilha(id_empresa,id_evento,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
