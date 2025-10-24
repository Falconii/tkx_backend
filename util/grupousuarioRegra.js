const grupousuarioSrv = require('../service/grupousuarioService');
const usuarioSrv = require('../service/usuarioService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO gruposusuarios */

exports.grupousuario_Inclusao = async function(grupousuario) { 
	try { 
		const obj = await grupousuarioSrv.getGrupousuario(grupousuario.id_empresa,grupousuario.codigo);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPOUSUARIO', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.grupousuario_Alteracao = async function(grupousuario) { 
	try { 
		const obj = await grupousuarioSrv.getGrupousuario(grupousuario.id_empresa,grupousuario.codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPOUSUARIO', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.grupousuario_Exclusao = async function(id_empresa,codigo) { 
	try { 
		const obj = await grupousuarioSrv.getGrupousuario(id_empresa,codigo);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPOUSUARIO', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
		const par = 
		{   "id_empresa":id_empresa, 
			"id":0, 
			"razao":"", 
			"cnpj_cpf":"", 
			"grupo":codigo, 
			"pagina":0, 
			"tamPagina":50, 
			"contador":"N", 
			"orderby":"000001", 
			"sharp":false 
		};
		const usuarios = await usuarioSrv.getUsuarios(par);
		if (usuarios.length > 0) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'GRUPOUSUARIO', message: `"EXCLUSÃO" Grupo Possui Usuários Vinculados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

