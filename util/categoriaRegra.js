const categoriaSrv = require('../service/categoriaService');
const participanteSrv = require('../service/participanteService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO categorias */

exports.categoria_Inclusao = async function(categoria) { 
	try { 
		const obj = await categoriaSrv.getCategoria(categoria.id_empresa,categoria.id);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoria_Alteracao = async function(categoria) { 
	try { 
		const obj = await categoriaSrv.getCategoria(categoria.id_empresa,categoria.id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.categoria_Exclusao = async function(id_empresa,id) { 
	try { 
		const obj = await categoriaSrv.getCategoria(id_empresa,id);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const par = {
			"id_empresa":id_empresa, 
			"id_evento":0, 
			"id_inscrito":0, 
			"inscricao":0, 
			"nro_peito":0, 
			"id_categoria":id, 
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
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIA', message: `"EXCLUSÃO" Categoria Possui Participantes Vinculados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

