/* SERVICE categoriacontadores */
const categoriacontadoresData = require('../data/categoriacontadoresData');
const validacao = require('../util/validacao');
const parametros = require('../util/categoriacontadoresParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/categoriacontadoresRegra');
const TABELA = 'CATEGORIACONTADORES';
/* CRUD GET SERVICE */
exports.getCategoriacontadores = async function(id_empresa,id_evento,id_categoria){
	return categoriacontadoresData.getCategoriacontadores(id_empresa,id_evento,id_categoria);
};
/* CRUD GET ALL SERVICE */
exports.getCategoriacontador = async function(params){
	return categoriacontadoresData.getCategoriacontador(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertCategoriacontadores = async function(categoriacontadores){
try 
{
	await regras.categoriacontadores_Inclusao(categoriacontadores);
	validacao.Validacao(TABELA,categoriacontadores, parametros.categoriacontadores());
	return categoriacontadoresData.insertCategoriacontadores(categoriacontadores);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateCategoriacontadores = async function(categoriacontadores){try 
{
	await regras.categoriacontadores_Alteracao(categoriacontadores);
	validacao.Validacao(TABELA,categoriacontadores, parametros.categoriacontadores());
	return categoriacontadoresData.updateCategoriacontadores(categoriacontadores);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteCategoriacontadores = async function(id_empresa,id_evento,id_categoria){try 
{
	await  regras.categoriacontadores_Exclusao(id_empresa,id_evento,id_categoria);
	return categoriacontadoresData.deleteCategoriacontadores(id_empresa,id_evento,id_categoria);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
