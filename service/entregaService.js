/* SERVICE entregasv2 */
const entregaData = require('../data/entregaData');
const validacao = require('../util/validacao');
const parametros = require('../util/entregaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/entregaRegra');
const TABELA = 'ENTREGASV2';
/* CRUD GET SERVICE */
exports.getEntrega = async function(id_empresa,id_evento,id){
	return entregaData.getEntrega(id_empresa,id_evento,id);
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
	validacao.Validacao(TABELA,entrega, parametros.entregasv2());
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
	validacao.Validacao(TABELA,entrega, parametros.entregasv2());
	return entregaData.updateEntrega(entrega);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteEntrega = async function(id_empresa,id_evento,id){try 
{
	await  regras.entrega_Exclusao(id_empresa,id_evento,id);
	return entregaData.deleteEntrega(id_empresa,id_evento,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
