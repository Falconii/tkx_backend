const eventoSrv = require('../service/eventoService');
const participanteSrv = require('../service/participanteService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO eventos */

exports.evento_Inclusao = async function(evento) { 
	try { 
		const obj = await eventoSrv.getEvento(evento.id_empresa,evento.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'EVENTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.evento_Alteracao = async function(evento) { 
	try { 
		const obj = await eventoSrv.getEvento(evento.id_empresa,evento.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'EVENTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.evento_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await eventoSrv.getEvento(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'EVENTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const par = {
			"id_empresa":id_empresa, 
			"id_evento":id, 
			"id_inscrito":0, 
			"inscricao":0, 
			"nro_peito":0, 
			"id_categoria":0, 
			"evento_descricao":"", 
			"inscrito_nome":"", 
			"inscrito_cpf":"", 
			"categoria_descricao":"", 
			"pagina":0, 
			"tamPagina":50, 
			"contador":"N", 
			"orderby":"", 
			"sharp":false
		};
		const participantes = await participanteSrv.getParticipantes(par);
		if (participantes.length > 0) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'EVENTO', message: `"EXCLUSÃO" Evento Possui Participantes Vinculados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}
	return; 
} 

