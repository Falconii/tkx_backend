const partipanteSrv = require('../service/partipanteService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO participantes */

exports.partipante_Inclusao = async function(partipante) { 
	try { 
		const obj = await partipanteSrv.getPartipante(partipante.id_empresa,partipante.id_evento,partipante.id_inscrito);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTIPANTE', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.partipante_Alteracao = async function(partipante) { 
	try { 
		const obj = await partipanteSrv.getPartipante(partipante.id_empresa,partipante.id_evento,partipante.id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTIPANTE', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.partipante_Exclusao = async function(id_empresa,id_evento,id_inscrito) { 
	try { 
		const obj = await partipanteSrv.getPartipante(id_empresa,id_evento,id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARTIPANTE', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

