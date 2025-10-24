/* SERVICE categoriacontadores */
const categoriacontadorData = require('../data/categoriacontadorData');
const validacao = require('../util/validacao');
const parametros = require('../util/categoriacontadorParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/categoriacontadorRegra');
const TABELA = 'CATEGORIACONTADORES';
/* CRUD GET SERVICE */
exports.getCategoriacontador = async function(id_empresa,id_evento,id_categoria){
	return categoriacontadorData.getCategoriacontador(id_empresa,id_evento,id_categoria);
};
/* CRUD GET ALL SERVICE */
exports.getCategoriacontadores = async function(params){
	return categoriacontadorData.getCategoriacontadores(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCategoriacontador = async function(categoriacontador){
try 
{
	await regras.categoriacontador_Inclusao(categoriacontador);
	validacao.Validacao(TABELA,categoriacontador, parametros.categoriacontadores());
	return categoriacontadorData.insertCategoriacontador(categoriacontador);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCategoriacontador = async function(categoriacontador){
try 
{
	await regras.categoriacontador_Alteracao(categoriacontador);
	validacao.Validacao(TABELA,categoriacontador, parametros.categoriacontadores());
	return categoriacontadorData.updateCategoriacontador(categoriacontador);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCategoriacontador = async function(id_empresa,id_evento,id_categoria){
try 
{
	await  regras.categoriacontador_Exclusao(id_empresa,id_evento,id_categoria);
	return categoriacontadorData.deleteCategoriacontador(id_empresa,id_evento,id_categoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };

 
 exports.popula_contadores = async function(params){
	return categoriacontadorData.popula_contadores(params);
};
