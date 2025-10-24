const cabplanilhaSrv = require('../service/cabplanilhaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO cabplanilhas */

exports.cabplanilha_Inclusao = async function(cabplanilha) { 
	try { 
		const obj = await cabplanilhaSrv.getCabplanilha(cabplanilha.id_empresa,cabplanilha.id_evento,cabplanilha.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CABPLANILHA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.cabplanilha_Alteracao = async function(cabplanilha) { 
	try { 
		const obj = await cabplanilhaSrv.getCabplanilha(cabplanilha.id_empresa,cabplanilha.id_evento,cabplanilha.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CABPLANILHA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.cabplanilha_Exclusao = async function(id_empresa,id_evento,id) { 
	try { 
		const obj = await cabplanilhaSrv.getCabplanilha(id_empresa,id_evento,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CABPLANILHA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

