const usuario_eventoSrv = require('../service/usuario_eventoService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO usuarios_eventos */

exports.usuario_evento_Inclusao = async function(usuario_evento) { 
	try { 
		const obj = await usuario_eventoSrv.getUsuario_Evento(usuario_evento.id_empresa,usuario_evento.id_evento,usuario_evento.id_usuario);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIO_EVENTO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.usuario_evento_Alteracao = async function(usuario_evento) { 
	try { 
		const obj = await usuario_eventoSrv.getUsuario_Evento(usuario_evento.id_empresa,usuario_evento.id_evento,usuario_evento.id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIO_EVENTO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.usuario_evento_Exclusao = async function(id_empresa,id_evento,id_usuario) { 
	try { 
		const obj = await usuario_eventoSrv.getUsuario_Evento(id_empresa,id_evento,id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'USUARIO_EVENTO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

