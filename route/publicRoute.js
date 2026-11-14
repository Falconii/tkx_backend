/* ROUTE cabplanilhas */
const db = require('../infra/database');
const tokenService = require('../service/tokenService');
const eventoService = require('../service/eventoService');
const liberacao = require('../util/liberacaoEvento');
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

    // 1. Validar token: precisa ser um token de LIBERACAO e valer para ESTE evento
    //    (token de login ou de redefinir senha nao libera nada)
    let payload;
    try {
      payload = tokenService.verifyTokenFinalidade(token, tokenService.FINALIDADE_LIBERA_EVENTO);
    } catch (err) {
      return res.status(err.http || 400).json({ message: err.message });
    }
    if (Number(payload.id_evento) !== Number(id_evento)) {
      return res.status(403).json({ message: "Este link não vale para este evento" });
    }
    // 2. Extrair dados do token
    const { id_empresa, id_usuario } = payload;

    if (!id_empresa || !id_usuario) {
      return res
        .status(400)
        .json({ message: "Token inválido: dados incompletos" });
    }

    // so master/TI (o usuario do token) libera, e so um evento AGUARDANDO LIBERACAO ('0')
    const evento = await liberacao.validarLiberacaoPorLink(id_empresa, id_usuario, id_evento);

    evento.status = "1"

    const registro = await eventoService.updateEvento(evento)

    return res.status(200).json({
      message: "Evento liberado com sucesso",
      evento: registro,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof liberacao.ErroLiberacao) {
      return res.status(err.http).json({ message: err.message });
    }
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
