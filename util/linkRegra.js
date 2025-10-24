const linkSrv = require('../service/linkService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO links */

exports.link_Inclusao = async function(link) { 
	try { 
		const obj = await linkSrv.getLink(link.id_empresa,link.id_evento,link.id_inscrito);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LINK', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.link_Alteracao = async function(link) { 
	try { 
		const obj = await linkSrv.getLink(link.id_empresa,link.id_evento,link.id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LINK', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.link_Exclusao = async function(id_empresa,id_evento,id_inscrito) { 
	try { 
		const obj = await linkSrv.getLink(id_empresa,id_evento,id_inscrito);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'LINK', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

