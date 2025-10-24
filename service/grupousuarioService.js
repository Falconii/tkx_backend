/* SERVICE gruposusuarios */
const grupousuarioData = require('../data/grupousuarioData');
const validacao = require('../util/validacao');
const parametros = require('../util/grupousuarioParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/grupousuarioRegra');
const TABELA = 'GRUPOSUSUARIOS';
/* CRUD GET SERVICE */
exports.getGrupousuario = async function(id_empresa,codigo){
	return grupousuarioData.getGrupousuario(id_empresa,codigo);
};
/* CRUD GET ALL SERVICE */
exports.getGruposusuarios = async function(params){
	return grupousuarioData.getGruposusuarios(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertGrupousuario = async function(grupousuario){
try 
{
	await regras.grupousuario_Inclusao(grupousuario);
	validacao.Validacao(TABELA,grupousuario, parametros.gruposusuarios());
	return grupousuarioData.insertGrupousuario(grupousuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateGrupousuario = async function(grupousuario){try 
{
	await regras.grupousuario_Alteracao(grupousuario);
	validacao.Validacao(TABELA,grupousuario, parametros.gruposusuarios());
	return grupousuarioData.updateGrupousuario(grupousuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteGrupousuario = async function(id_empresa,codigo){try 
{
	await  regras.grupousuario_Exclusao(id_empresa,codigo);
	return grupousuarioData.deleteGrupousuario(id_empresa,codigo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
