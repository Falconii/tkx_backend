const parametroSrv = require('../service/parametroService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO parametros */

exports.parametro_Inclusao = async function(parametro) { 
	try { 
		const obj = await parametroSrv.getParametro(parametro.id_empresa,parametro.modulo,parametro.assinatura,parametro.id_usuario);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.parametro_Alteracao = async function(parametro) { 
	try { 
		const obj = await parametroSrv.getParametro(parametro.id_empresa,parametro.modulo,parametro.assinatura,parametro.id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.parametro_Exclusao = async function(id_empresa,modulo,assinatura,id_usuario) { 
	try { 
		const obj = await parametroSrv.getParametro(id_empresa,modulo,assinatura,id_usuario);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'PARAMETRO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

