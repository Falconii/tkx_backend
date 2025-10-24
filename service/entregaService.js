/* SERVICE entregas */
const entregaData = require('../data/entregaData');
const validacao = require('../util/validacao');
const parametros = require('../util/entregaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/entregaRegra');
const TABELA = 'ENTREGAS';
/* CRUD GET SERVICE */
exports.getEntrega = async function(id_empresa,id_evento,id_inscrito){
	return entregaData.getEntrega(id_empresa,id_evento,id_inscrito);
};
/* CRUD GET ALL SERVICE */
exports.getEntregas = async function(params){
	return entregaData.getEntregas(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertEntrega = async function(entrega){
try 
{
	await regras.entrega_Inclusao(entrega);
	validacao.Validacao(TABELA,entrega, parametros.entregas());
	return entregaData.insertEntrega(entrega);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateEntrega = async function(entrega){try 
{
	await regras.entrega_Alteracao(entrega);
	validacao.Validacao(TABELA,entrega, parametros.entregas());
	return entregaData.updateEntrega(entrega);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteEntrega = async function(id_empresa,id_evento,id_inscrito){try 
{
	await  regras.entrega_Exclusao(id_empresa,id_evento,id_inscrito);
	return entregaData.deleteEntrega(id_empresa,id_evento,id_inscrito);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
