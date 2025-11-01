const participanteSrv = require('../service/participanteService');
const eventoSrv = require('../service/eventoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO participantes */

exports.participante_Inclusao = async function(participante) { 
	try { 
		const obj = await participanteSrv.getParticipante(participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.inscricao);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.participante_Alteracao = async function(participante) { 
	try { 
		const obj = await participanteSrv.getParticipante(participante.id_empresa,participante.id_evento,participante.id_inscrito,participante.inscricao);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.participante_Exclusao = async function(id_empresa,id_evento,id_inscrito,inscricao) { 
	try { 
		const obj = await participanteSrv.getParticipante(id_empresa,id_evento,id_inscrito,inscricaocd);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const par ={
					"id_empresa":id_empresa, 
					"id":id_evento, 
					"descricao":"", 
					"id_responsavel":0, 
					"status":"", 
					"pagina":0, 
					"tamPagina":50, 
					"contador":"N", 
					"orderby":"", 
					"sharp":false 
		};
		const eventos = await eventoSrv.getEventos(par);
		if (eventos.length >  0) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTICIPANTE', message: `"EXCLUSÃO" Participante Possui Eventos Vinculados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

