/* ROUTE usuarios */
const db = require("../../infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../middleware/autenticartoken");
const bcrypt = require("bcryptjs");
const usuarioSrv = require("../../service/complementar/usuarioService");
const tokenSrv = require("../../service/tokenService");
const erroDB = require("../../util/userfunctiondb");


router.use(autenticarToken);

/* ROTA GETONE usuario */
router.get("/:id_empresa/:cnpj_cpf", async function (req, res) {
  try {
    limparCnpj_Cpf
    const usuario = await usuarioSrv.getUsuarioByCpf(
      req.params.id_empresa,
      req.params.cnpj_cpf,
    );
    if (usuario == null) {
      res.status(409).json({ message: "Usuario Não Encontrado." });
    } else {
      res.status(200).json(usuario);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "usuario", message: err.message });
    }
  }
});
module.exports = router;
