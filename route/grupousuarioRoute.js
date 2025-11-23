/* ROUTE gruposusuarios */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middleware/autenticartoken");
const grupousuarioSrv = require("../service/grupousuarioService");

router.use(autenticarToken);

/* ROTA GETONE grupousuario */
router.get("/:id_empresa/:codigo", async function (req, res) {
  try {
    const lsLista = await grupousuarioSrv.getGrupousuario(
      req.params.id_empresa,
      req.params.codigo
    );
    if (lsLista == null) {
      res.status(409).json({ message: "Grupousuario Não Encontrada." });
    } else {
      res.status(200).json(lsLista);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "grupousuario",
          message: err.message,
        });
    }
  }
});
/* ROTA GETALL grupousuario */
router.get("/", async function (req, res) {
  try {
    const lsLista = await grupousuarioSrv.getGruposusuarios();
    if (lsLista.length == 0) {
      res
        .status(409)
        .json({ message: "Nehuma Informação Para Esta Consulta." });
    } else {
      res.status(200).json(lsLista);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "grupousuario",
          message: err.message,
        });
    }
  }
});
/* ROTA INSERT grupousuario */
router.post("/", async function (req, res) {
  try {
    const grupousuario = req.body;
    const registro = await grupousuarioSrv.insertGrupousuario(grupousuario);
    if (registro == null) {
      res.status(409).json({ message: "Grupousuario Cadastrado!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "Grupousuario",
          message: err.message,
        });
    }
  }
});
/* ROTA UPDATE grupousuario */
router.put("/", async function (req, res) {
  try {
    const grupousuario = req.body;
    const registro = await grupousuarioSrv.updateGrupousuario(grupousuario);
    if (registro == null) {
      res.status(409).json({ message: "Grupousuario Alterado Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "Grupousuario",
          message: err.message,
        });
    }
  }
});
/* ROTA DELETE grupousuario */
router.delete("/:id_empresa/:codigo", async function (req, res) {
  try {
    await grupousuarioSrv.deleteGrupousuario(
      req.params.id_empresa,
      req.params.codigo
    );
    res.status(200).json({ message: "Grupousuario Excluído Com Sucesso!" });
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "Grupousuario",
          message: err.message,
        });
    }
  }
});
/* ROTA CONSULTA POST gruposusuarios */
router.post("/gruposusuarios", async function (req, res) {
  /*
    	{
    		"id_empresa":0, 
    		"codigo":0, 
    		"descricao":"", 
    		"pagina":0, 
    		"tamPagina":50, 
    		"contador":"N", 
    		"orderby":"", 
    		"sharp":false 
    	}
    */
  try {
    const params = req.body;
    const lsRegistros = await grupousuarioSrv.getGruposusuarios(params);
    if (lsRegistros.length == 0) {
      res
        .status(409)
        .json({ message: "Grupousuario Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({
          erro: "BAK-END",
          tabela: "Grupousuario",
          message: err.message,
        });
    }
  }
});

module.exports = router;
