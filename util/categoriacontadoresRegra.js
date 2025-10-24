const categoriacontadoresSrv = require('../service/categoriacontadoresService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO categoriacontadores */

exports.categoriacontadores_Inclusao = async function(categoriacontadores) { 
	try { 
		const obj = await categoriacontadoresSrv.getCategoriacontadores(categoriacontadores.id_empresa,categoriacontadores.id_evento,categoriacontadores.id_categoria);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADORES', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoriacontadores_Alteracao = async function(categoriacontadores) { 
	try { 
		const obj = await categoriacontadoresSrv.getCategoriacontadores(categoriacontadores.id_empresa,categoriacontadores.id_evento,categoriacontadores.id_categoria);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADORES', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoriacontadores_Exclusao = async function(id_empresa,id_evento,id_categoria) { 
	try { 
		const obj = await categoriacontadoresSrv.getCategoriacontadores(id_empresa,id_evento,id_categoria);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADORES', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

