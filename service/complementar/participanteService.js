/* SERVICE participantes */
const participanteComplementarData = require('../../data/complementar/participanteData.js');
const shared = require('../../util/shared');
const erroDB = require('../../util/userfunctiondb');
const TABELA = 'PARTICIPANTES';/* CRUD GET ALL SERVICE */

exports.trocaParticipante = async function(participante,new_id_inscrito){

	try {

	   const participanteAlterado = await participanteComplementarData.trocaParticipante(participante,new_id_inscrito);	

	   return participanteAlterado;

	} catch (err) {

		return null;

	}
};	