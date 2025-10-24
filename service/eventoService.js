/* SERVICE eventos */
const eventoData = require('../data/eventoData');
const validacao = require('../util/validacao');
const parametros = require('../util/eventoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/eventoRegra');
const TABELA = 'EVENTOS';
/* CRUD GET SERVICE */
exports.getEvento = async function(id_empresa,id){
	return eventoData.getEvento(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getEventos = async function(params){
	return eventoData.getEventos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertEvento = async function(evento){
try 
{
	await regras.evento_Inclusao(evento);
	validacao.Validacao(TABELA,evento, parametros.eventos());
	return eventoData.insertEvento(evento);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateEvento = async function(evento){try 
{
	await regras.evento_Alteracao(evento);
	validacao.Validacao(TABELA,evento, parametros.eventos());
	return eventoData.updateEvento(evento);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteEvento = async function(id_empresa,id){try 
{
	await  regras.evento_Exclusao(id_empresa,id);
	return eventoData.deleteEvento(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
