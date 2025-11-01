/* SERVICE participantes */
const participanteData = require('../data/participanteData');
const validacao = require('../util/validacao');
const parametros = require('../util/participanteParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/participanteRegra');
const TABELA = 'PARTICIPANTES';
/* CRUD GET SERVICE */
exports.getParticipante = async function(id_empresa,id_evento,id_inscrito,inscricao){
	return participanteData.getParticipante(id_empresa,id_evento,id_inscrito,inscricao);
};
/* CRUD GET ALL SERVICE */
exports.getParticipantes = async function(params){
	return participanteData.getParticipantes(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertParticipante = async function(participante){
try 
{
	await regras.participante_Inclusao(participante);
	validacao.Validacao(TABELA,participante, parametros.participantes());
	return participanteData.insertParticipante(participante);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateParticipante = async function(participante){try 
{
	await regras.participante_Alteracao(participante);
	validacao.Validacao(TABELA,participante, parametros.participantes());
	return participanteData.updateParticipante(participante);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteParticipante = async function(id_empresa,id_evento,id_inscrito,inscricao){try 
{
	await  regras.participante_Exclusao(id_empresa,id_evento,id_inscrito,inscricao);
	return participanteData.deleteParticipante(id_empresa,id_evento,id_inscrito,inscricao);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
