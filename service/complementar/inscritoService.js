/* SERVICE categorias */
const inscritoData = require('../../data/complementar/inscritoData.js');
const validacao = require('../../util/validacao.js');
const parametros = require('../../util/categoriaParametros.js');
const erroDB = require('../../util/userfunctiondb.js');
const regras = require('../../util/categoriaRegra.js');
const TABELA = 'CATEGORIAS';
/* CRUD GET SERVICE */
exports.getInscritoByCpf = async function(id_empresa,sigla){
	return inscritoData.getInscritoByCpf(id_empresa,sigla);
};