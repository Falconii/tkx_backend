const detPlanilhaSrv = require('../service/detPlanilhaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO detPlanilhas */

exports.detPlanilha_Inclusao = async function(detPlanilha) { 
	try { 
		const obj = await detPlanilhaSrv.getDetplanilha(detPlanilha.id_empresa,detPlanilha.id_evento,detPlanilha.id_cabec,detPlanilha.cnpj_cpf,detPlanilha.inscricao);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.detPlanilha_Alteracao = async function(detPlanilha) { 
	try { 
		const obj = await detPlanilhaSrv.getDetplanilha(detPlanilha.id_empresa,detPlanilha.id_evento,detPlanilha.id_cabec,detPlanilha.cnpj_cpf,detPlanilha.inscricao);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.detPlanilha_Exclusao = async function(id_empresa,id_evento,id_cabec,cnpj_cpf,inscricao) { 
	try { 
		const obj = await detPlanilhaSrv.getDetplanilha(id_empresa,id_evento,id_cabec,cnpj_cpf,inscricao);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'DETPLANILHA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

