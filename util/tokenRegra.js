const tokenSrv = require('../service/tokenService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO tokens */

exports.token_Inclusao = async function(token) { 
	try { 
		const obj = await tokenSrv.getToken(token.id_empresa,token.id_usuario,token.token,token.tipo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TOKEN', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.token_Alteracao = async function(token) { 
	try { 
		const obj = await tokenSrv.getToken(token.id_empresa,token.id_usuario,token.token,token.tipo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TOKEN', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.token_Exclusao = async function(id_empresa,id_usuario,token,tipo) { 
	try { 
		const obj = await tokenSrv.getToken(id_empresa,id_usuario,token,tipo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TOKEN', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

