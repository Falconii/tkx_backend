/* ROUTE participantes */
const db = require("../infra/database");
const express = require("express");
const router = express.Router();
const cabPlanilhaSrv = require("../service/cabplanilhaService.js");
const detPlanilhaSrv = require("../service/detPlanilhaService.js");
const eventoSrv = require("../service/eventoService.js");
const uploadPlanilha = require("../config_multer/config_multer_planilha");
const uploadPlanilhaSrv = require("../service/uploadPlanilhaService.js");
const shared = require("../util/shared.js");
const { autenticarToken } = require("../middleware/autenticartoken");
router.use(autenticarToken);

router.post(
  "/loadplanilha",
  uploadPlanilha.single("file"),
  async function (req, res) {
    try {
      const parametros = {
        id_empresa: req.id_empresa,
        id_evento: req.body.id_evento,
        id_usuario: req.id_usuario,
      };

      const file = req.file;
      ``;
      const existeEvento = await eventoSrv.getEvento(
        parametros.id_empresa,
        parametros.id_evento,
      );

      if (existeEvento == null) {
        res
          .status(401)
          .json({ message: `Evento N ª ${parametros.id_evento} Não Existe!` });
        return;
      }

      const existePlanilha = await shared.verfica_planilha(
        parametros.id_empresa,
        parametros.id_evento,
        file.originalname,
      );

      if (existePlanilha.existe) {
        res.status(401).json({ message: "Planilha Já Cadastrada!" });
      } else {
        const linhas_processadas = await uploadPlanilhaSrv.inclusao(req, res);

        res.status(200).json({
          message: "Planilha Importada com Sucesso!",
          linhas_processadas: linhas_processadas,
        });
      }
    } catch (err) {
      console.log(err);

      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "Importacao",
          message: err.message,
        });
      }
    }
  },
);
router.post("/processamento", async function (req, res) {
  try {
    const parametros = {
      id_empresa: req.id_empresa,
      id_evento: req.body.id_evento,
      id_planilha: req.body.id_planilha,
      id_usuario: req.id_usuario,
    };

    cabec = await cabPlanilhaSrv.getCabplanilha(
      parametros.id_empresa,
      parametros.id_evento,
      parametros.id_planilha,
    );

    if (cabec == null) {
      res.status(401).json({ message: "Planilha Não Existe!" });
      return;
    }

    const par = {
      id_empresa: parametros.id_empresa,
      id_evento: parametros.id_evento,
      id_cabec: parametros.id_planilha,
      cnpj_cpf: "",
      nome: "",
      status: 0,
      pagina: 0,
      tamPagina: 50,
      contador: "N",
      orderby: "",
      sharp: false,
    };

    const detalhes = await detPlanilhaSrv.getDetplanilhas(par);

    if (detalhes.length == 0) {
      res.status(401).json({
        message: "Planilha Não Contém Linhas Para Serem Processadas!",
      });
      return;
    }

    cabec = await uploadPlanilhaSrv.processamento(req, cabec, detalhes);

    res
      .status(200)
      .json({ cabec: cabec, message: "Processamento da Planilha Finalizado!" });
  } catch (err) {
    console.log(err);

    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Importacao", message: err.message });
    }
  }
});

module.exports = router;
