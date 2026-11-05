const tarefaSrv = require('../service/tarefaService');
const erroDB = require('../util/userfunctiondb');
const shared = require('../util/shared');
/* REGRA DE NEGOCIO tarefas */

exports.tarefa_Inclusao = async function(tarefa) { 
	try { 
		const obj = await tarefaSrv.getTarefa(tarefa.id_empresa,tarefa.name_file);
		if (obj != null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TAREFA', message: `"INCLUSÃO" Registro Já Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.tarefa_Alteracao = async function(tarefa) { 
	try { 
		const obj = await tarefaSrv.getTarefa(tarefa.id_empresa,tarefa.name_file);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TAREFA', message: `"ALTERAÇÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

exports.tarefa_Exclusao = async function(id_empresa,name_file) { 
	try { 
		const obj = await tarefaSrv.getTarefa(id_empresa,name_file);
		if (obj == null) { 
		   throw new erroDB.UserException('Regra de negócio', [{ tabela: 'TAREFA', message: `"EXCLUSÃO" Registro Não Existe Na Base De Dados.!` }]);
		}
	} catch (err) { 
		throw err; 
	}


	return; 
} 

