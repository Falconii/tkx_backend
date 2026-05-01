/* ROUTE relatorios */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const gerarPlanilha = require("../Excel/relatorio");
const eventoSrv = require("../service/eventoService");

const { autenticarToken } = require("../middleware/autenticartoken");

router.use(autenticarToken);

/* ROTA relatorio evento */
router.post("/eventos", async function (req, res) {
  try {
    const param = {
      id_empresa: 1,
      id_evento: 12,
      id: 0,
      arquivo: "",
      pagina: 0,
      tamPagina: 50,
      contador: "N",
      orderby: "",
      sharp: false,
    };

    const result = await eventoSrv.getEventos(param);

    res.status(200).json(registro);
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Cabplanilha", message: err.message });
    }
  }
});
/* ROTA UPDATE cabplanilha */
router.put("/", async function (req, res) {
  try {
    const cabplanilha = req.body;
    const registro = await cabplanilhaSrv.updateCabplanilha(cabplanilha);
    if (registro == null) {
      res.status(409).json({ message: "Cabplanilha Alterado Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Cabplanilha", message: err.message });
    }
  }
});
/* ROTA DELETE cabplanilha */
router.delete("/:id_empresa/:id_evento/:id", async function (req, res) {
  try {
    await cabplanilhaSrv.deleteCabplanilha(
      req.params.id_empresa,
      req.params.id_evento,
      req.params.id,
    );
    res.status(200).json({ message: "Cabplanilha Excluído Com Sucesso!" });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Cabplanilha", message: err.message });
    }
  }
});
/* ROTA CONSULTA POST cabplanilhas */
router.post("/cabplanilhas", async function (req, res) {
  /*
    	{
    		"id_empresa":0, 
    		"id_evento":0, 
    		"id":0, 
    		"arquivo":"", 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
  try {
    const params = req.body;
    const lsRegistros = await cabplanilhaSrv.getCabplanilhas(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Cabplanilha Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Cabplanilha", message: err.message });
    }
  }
});

module.exports = router;
