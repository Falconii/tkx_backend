/* SERVICE tarefas */
const tarefaData = require('../data/tarefaData');
const validacao = require('../util/validacao');
const parametros = require('../util/tarefaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/tarefaRegra');
const TABELA = 'TAREFAS';
/* CRUD GET SERVICE */
exports.getTarefa = async function(id_empresa,name_file){
	return tarefaData.getTarefa(id_empresa,name_file);
};
/* CRUD GET ALL SERVICE */
exports.getTarefas = async function(params){
	return tarefaData.getTarefas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertTarefa = async function(tarefa){
try 
{
	await regras.tarefa_Inclusao(tarefa);
	validacao.Validacao(TABELA,tarefa, parametros.tarefas());
	return tarefaData.insertTarefa(tarefa);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateTarefa = async function(tarefa){try 
{
	await regras.tarefa_Alteracao(tarefa);
	validacao.Validacao(TABELA,tarefa, parametros.tarefas());
	return tarefaData.updateTarefa(tarefa);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteTarefa = async function(id_empresa,name_file){try 
{
	await  regras.tarefa_Exclusao(id_empresa,name_file);
	return tarefaData.deleteTarefa(id_empresa,name_file);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
