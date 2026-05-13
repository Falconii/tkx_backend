const entregav2Srv = require('../service/entregav2Service');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO entregasv2 */

exports.entregav2_Inclusao = async function(entregav2) { 
	try { 
		const obj = await entregav2Srv.getEntregav2(entregav2.id_empresa,entregav2.id_evento,entregav2.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGAV2', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.entregav2_Alteracao = async function(entregav2) { 
	try { 
		const obj = await entregav2Srv.getEntregav2(entregav2.id_empresa,entregav2.id_evento,entregav2.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGAV2', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.entregav2_Exclusao = async function(id_empresa,id_evento,id) { 
	try { 
		const obj = await entregav2Srv.getEntregav2(id_empresa,id_evento,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGAV2', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

