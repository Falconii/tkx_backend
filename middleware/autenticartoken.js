/* fonte autenticarToken.js */

const jwt = require("jsonwebtoken");
const usuarioService = require("../service/usuarioService");
const tokenService = require("../service/tokenService");

exports.autenticarToken = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Cabeçalho de autorização:", authHeader, req.headers);
  console.log("authorization:", req.headers.authorization);
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token recebido:", token);

  if (!token) return res.status(401).json({ mensagem: "Token ausente" });

  console.log(`token: ${token} `);

  tokenDB = await tokenService.getTokenOnly(1, token);

  console.log(`tokenDB: ${tokenDB} `);

  if (tokenDB == null)
    return res.status(401).json({ mensagem: "Credenciais Inválidas! DB" });

  const tokenVerificado = await tokenService.verifyToken(token);

  if (tokenVerificado.status !== 200) {
    return res
      .status(tokenVerificado.status)
      .json({ mensagem: tokenVerificado.mensagem });
  } else {
    req.id_empresa = tokenVerificado.id_empresa;
    req.id_usuario = tokenVerificado.id_usuario;

    const usuario = await usuarioService.getUsuario(
      req.id_empresa,
      req.id_usuario
    );

    if (usuario == null || usuario.ativo == "N") {
      return res.status(401).json({ mensagem: "Usuário Inativo" });
    } else {
      next();
    }
  }
};
