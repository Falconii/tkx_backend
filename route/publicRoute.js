/* ROUTE cabplanilhas */
const db = require('../infra/database');
const tokenService = require('../service/tokenService');
const eventoService = require('../service/eventoService');
const express = require('express');
const router = express.Router(); 
/* ROTAS PUBLICAS */



router.post("/liberaevento", async function (req, res) {
  try {
    const { token, id_evento } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token não informado" });
    }

     if (!id_evento) {
      return res.status(400).json({ message: "Evento não informado" });
    }

    // 1. Validar token
    let payload;
    try {
      payload = await tokenService.verifyToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
    // 2. Extrair dados do token
    const { id_empresa, id_usuario } = payload;

    if (!id_empresa || !id_usuario) {
      return res
        .status(400)
        .json({ message: "Token inválido: dados incompletos" });
    }

    const evento = await eventoService.getEvento(id_empresa, id_evento);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    evento.status = "1"

    const registro = await eventoService.updateEvento(evento)

    return res.status(200).json({
      message: "Evento liberado com sucesso",
      evento: registro,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "MyExceptionDB") {
      return res.status(409).json(err);
    }

    return res.status(500).json({
      erro: "BACK-END",
      tabela: "Eventos",
      message: err.message,
    });
  }
});

module.exports = router;
