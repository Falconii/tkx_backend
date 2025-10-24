const categoriacontadorSrv = require('../service/categoriacontadorService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO categoriacontadores */

exports.categoriacontador_Inclusao = async function(categoriacontador) { 
	try { 
		const obj = await categoriacontadorSrv.getCategoriacontador(categoriacontador.id_empresa,categoriacontador.id_evento,categoriacontador.id_categoria);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADOR', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoriacontador_Alteracao = async function(categoriacontador) { 
	try { 
		const obj = await categoriacontadorSrv.getCategoriacontador(categoriacontador.id_empresa,categoriacontador.id_evento,categoriacontador.id_categoria);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADOR', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoriacontador_Exclusao = async function(id_empresa,id_evento,id_categoria) { 
	try { 
		const obj = await categoriacontadorSrv.getCategoriacontador(id_empresa,id_evento,id_categoria);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIACONTADOR', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

