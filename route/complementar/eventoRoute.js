/* ROUTE eventos */
const db = require("../../infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../middleware/autenticartoken");
const eventoSrv = require("../../service/complementar/eventoService");
router.use(autenticarToken);
/* ROTA UPDATE evento */

router.put("/updateStatusEvento", async function (req, res) {
  try {
    const evento = req.body;
    const registro = await eventoSrv.updateEvento(evento);
    if (registro == null) {
      res.status(409).json({ message: "Situação Alterada Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Evento", message: err.message });
    }
  }
});
module.exports = router;
