const participantev2Srv = require('../service/participantev2Service');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO participantesv2 */

exports.participantev2_Inclusao = async function(participantev2) { 
	try { 
		const obj = await participantev2Srv.getParticipantev2(participantev2.id_empresa,participantev2.id_evento,participantev2.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.participantev2_Alteracao = async function(participantev2) { 
	try { 
		const obj = await participantev2Srv.getParticipantev2(participantev2.id_empresa,participantev2.id_evento,participantev2.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.participantev2_Exclusao = async function(id_empresa,id_evento,id) { 
	try { 
		const obj = await participantev2Srv.getParticipantev2(id_empresa,id_evento,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTEV2', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

