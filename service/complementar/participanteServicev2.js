/* SERVICE participantes */
const participanteComplementarData = require('../../data/complementar/participanteData.js');
const shared = require('../../util/shared.js');
const erroDB = require('../../util/userfunctiondb.js');
const TABELA = 'PARTICIPANTESV2';/* CRUD GET ALL SERVICE */

exports.getCountParticipantesNroPeito = async function(id_empresa,id_evento,nro_peito){

	try {

	   const total = await participanteComplementarData.trocaParticipante(id_empresa,id_evento,nro_peito);	

	   return total;

	} catch (err) {

		return null;

	}
};	


exports.getCountParticipantesInscricao = async function(id_empresa,id_evento,incricao){

	try {

	   const total = await participanteComplementarData.trocaParticipante(id_empresa,id_evento,nro_peito);	

	   return total;

	} catch (err) {

		return null;

	}
};	



