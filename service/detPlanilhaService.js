/* SERVICE detPlanilhas */
const detPlanilhaData = require('../data/detPlanilhaData');
const validacao = require('../util/validacao');
const parametros = require('../util/detPlanilhaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/detPlanilhaRegra');
const TABELA = 'DETPLANILHAS';
/* CRUD GET SERVICE */
exports.getDetplanilha = async function(id_empresa,id_evento,id_cabec,nro_peito){
	return detPlanilhaData.getDetplanilha(id_empresa,id_evento,id_cabec,nro_peito);
};
/* CRUD GET ALL SERVICE */
exports.getDetplanilhas = async function(params){
	return detPlanilhaData.getDetplanilhas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertDetplanilha = async function(detPlanilha){
try 
{
	await regras.detPlanilha_Inclusao(detPlanilha);
	validacao.Validacao(TABELA,detPlanilha, parametros.detPlanilhas());
	return detPlanilhaData.insertDetplanilha(detPlanilha);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateDetplanilha = async function(detPlanilha){try 
{
	await regras.detPlanilha_Alteracao(detPlanilha);
	validacao.Validacao(TABELA,detPlanilha, parametros.detPlanilhas());
	return detPlanilhaData.updateDetplanilha(detPlanilha);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteDetplanilha = async function(id_empresa,id_evento,id_cabec,nro_peito){try 
{
	await  regras.detPlanilha_Exclusao(id_empresa,id_evento,id_cabec,nro_peito);
	return detPlanilhaData.deleteDetplanilha(id_empresa,id_evento,id_cabec,nro_peito);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
