/* SERVICE usuarios */
const usuarioComplementarData = require("../../data/complementar/usuarioData");
const validacao = require("../../util/validacao");
const parametros = require("../../util/usuarioParametros");
const erroDB = require("../../util/userfunctiondb");
const regras = require("../../util/usuarioRegra");
const TABELA = "USUARIOS";
/* CRUD GET SERVICE */

/* CRUD GET ALL SERVICE */
exports.getUsuarioByCpf = async function (id_empresa,cnpj_cpf) {
  return usuarioComplementarData.getUsuarioByCpf(id_empresa,cnpj_cpf);
};