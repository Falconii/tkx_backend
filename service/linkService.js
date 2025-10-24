/* SERVICE links */
const linkData = require('../data/linkData');
const validacao = require('../util/validacao');
const parametros = require('../util/linkParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/linkRegra');
const TABELA = 'LINKS';
/* CRUD GET SERVICE */
exports.getLink = async function(id_empresa,id_evento,id_inscrito){
	return linkData.getLink(id_empresa,id_evento,id_inscrito);
};
/* CRUD GET ALL SERVICE */
exports.getLnks = async function(params){
	return linkData.getLnks(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertLink = async function(link){
try 
{
	await regras.link_Inclusao(link);
	validacao.Validacao(TABELA,link, parametros.links());
	return linkData.insertLink(link);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateLink = async function(link){try 
{
	await regras.link_Alteracao(link);
	validacao.Validacao(TABELA,link, parametros.links());
	return linkData.updateLink(link);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteLink = async function(id_empresa,id_evento,id_inscrito){try 
{
	await  regras.link_Exclusao(id_empresa,id_evento,id_inscrito);
	return linkData.deleteLink(id_empresa,id_evento,id_inscrito);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
