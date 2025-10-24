const inscritoSrv = require('../service/inscritoService');
const participanteSrv = require('../service/participanteService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO inscritos */

exports.inscrito_Inclusao = async function(inscrito) { 
	try { 
		const obj = await inscritoSrv.getInscrito(inscrito.id_empresa,inscrito.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INSCRITO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.inscrito_Alteracao = async function(inscrito) { 
	try { 
		const obj = await inscritoSrv.getInscrito(inscrito.id_empresa,inscrito.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INSCRITO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.inscrito_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await inscritoSrv.getInscrito(id_empresa,id);
		if (obj == null)
		{ 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INSCRITO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const par = {
			"id_empresa":id_empresa, 
			"id_evento":0, 
			"id_inscrito":id, 
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
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'INSCRITO', message: `"EXCLUSÃO" Inscrito Possui Participações Vinculadas.!` }]);
		}
	} catch (err) { 
		throw err; 
	}



	return; 
} 

