/* SERVICE categorias */
const categoriaData = require('../data/categoriaData');
const validacao = require('../util/validacao');
const parametros = require('../util/categoriaParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/categoriaRegra');
const TABELA = 'CATEGORIAS';
/* CRUD GET SERVICE */
exports.getCategoria = async function(id_empresa,id){
	return categoriaData.getCategoria(id_empresa,id);
};
/* CRUD GET ALL SERVICE */
exports.getCategorias = async function(params){
	return categoriaData.getCategorias(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCategoria = async function(categoria){
try 
{
	await regras.categoria_Inclusao(categoria);
	validacao.Validacao(TABELA,categoria, parametros.categorias());
	return categoriaData.insertCategoria(categoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCategoria = async function(categoria){try 
{
	await regras.categoria_Alteracao(categoria);
	validacao.Validacao(TABELA,categoria, parametros.categorias());
	return categoriaData.updateCategoria(categoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCategoria = async function(id_empresa,id){try 
{
	await  regras.categoria_Exclusao(id_empresa,id);
	return categoriaData.deleteCategoria(id_empresa,id);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
