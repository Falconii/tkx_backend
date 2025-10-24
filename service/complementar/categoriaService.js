/* SERVICE categorias */
const categoriaData = require('../../data/complementar/categoriaData.js');
const validacao = require('../../util/validacao');
const parametros = require('../../util/categoriaParametros');
const erroDB = require('../../util/userfunctiondb');
const regras = require('../../util/categoriaRegra');
const TABELA = 'CATEGORIAS';
/* CRUD GET SERVICE */
exports.getCategoriaBySigla = async function(id_empresa,sigla){
	return categoriaData.getCategoriaBySigla(id_empresa,sigla);
};