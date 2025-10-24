const entregaSrv = require('../service/entregaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO entregas */

exports.entrega_Inclusao = async function(entrega) { 
	try { 
		const obj = await entregaSrv.getEntrega(entrega.id_empresa,entrega.id_evento,entrega.id_inscrito);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}
	return; 
} 

exports.entrega_Alteracao = async function(entrega) { 
	try { 
		const obj = await entregaSrv.getEntrega(entrega.id_empresa,entrega.id_evento,entrega.id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.entrega_Exclusao = async function(id_empresa,id_evento,id_inscrito) { 
	try { 
		const obj = await entregaSrv.getEntrega(id_empresa,id_evento,id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'ENTREGA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

