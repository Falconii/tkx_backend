/* SERVICE participantesv2 */
const participantev2Data = require('../data/participantev2Data');
const validacao = require('../util/validacao');
const parametros = require('../util/participantev2Parametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/participantev2Regra');
const TABELA = 'PARTICIPANTESV2';
/* CRUD GET SERVICE */
exports.getParticipantev2 = async function(id_empresa,id_evento,id){
	return participantev2Data.getParticipantev2(id_empresa,id_evento,id);
};
/* CRUD GET ALL SERVICE */
exports.getParticipantesv2 = async function(params){
	return participantev2Data.getParticipantesv2(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertParticipantev2 = async function(participantev2){
try 
{
	await regras.participantev2_Inclusao(participantev2);
	validacao.Validacao(TABELA,participantev2, parametros.participantesv2());
	return participantev2Data.insertParticipantev2(participantev2);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateParticipantev2 = async function(participantev2){try 
{
	await regras.participantev2_Alteracao(participantev2);
	validacao.Validacao(TABELA,participantev2, parametros.participantesv2());
	return participantev2Data.updateParticipantev2(participantev2);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteParticipantev2 = async function(id_empresa,id_evento,id){try 
{
	await  regras.participantev2_Exclusao(id_empresa,id_evento,id);
	return participantev2Data.deleteParticipantev2(id_empresa,id_evento,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
