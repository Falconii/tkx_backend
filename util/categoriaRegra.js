const categoriaSrv = require('../service/categoriaService');
const participantev2Srv = require('../service/participantev2Service');
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
		// Participantes (v2) vinculados a esta categoria. Valores neutros do v2: inscricao/nro_peito = -1
		// (0 FILTRARIA por "= 0"). contador 'S' so conta, sem carregar milhares de linhas.
		const par = {
			"id_empresa":id_empresa,
			"id_evento":0,
			"id":0,
			"id_entrega":0,
			"kit":false,
			"inscricao":-1,
			"nro_peito":-1,
			"id_categoria":id,
			"nome":"",
			"cnpj_cpf":"",
			"evento_descricao":"",
			"categoria_descricao":"",
			"pagina":0,
			"tamPagina":50,
			"contador":"S",
			"orderby":"",
			"sharp":false
		};
		const vinculados = await participantev2Srv.getParticipantesv2(par);
		if (Number(vinculados.total) > 0) {
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'CATEGORIA', message: `"EXCLUSÃO" Categoria Possui Participantes Vinculados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

