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
const iconv = require('iconv-lite');

router.use(autenticarToken);

router.post(
  "/loadplanilha",
  uploadPlanilha.single("file"),
  async function (req, res) {
    try {
      const parametros = {
        id_empresa: req.id_empresa,
        id_usuario: req.id_usuario,
        id_evento: req.body.id_evento,
      };

      console.log("parametros", parametros);
      const file = req.file;

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
        iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8')
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


router.post("/processamentoV2", async function (req, res) {
  try {
    const parametros = {
      id_empresa: req.id_empresa,
      id_evento: req.body.id_evento,
      id_planilha: req.body.id_planilha,
      id_usuario: req.id_usuario,
    };

    evento = await eventoSrv.getEvento(
      parametros.id_empresa,
      parametros.id_evento,
    );

    if (evento == null) {
      res.status(401).json({ message: "Evento Não Existe!" });
      return;
    }

    if (evento.status !== "1") {
      res.status(401).json({ message: "Evento Deverá Estar Inativo!" });
      return;
    }

    cabec = await cabPlanilhaSrv.getCabplanilha(
      parametros.id_empresa,
      parametros.id_evento,
      parametros.id_planilha,
    );

    if (cabec == null) {
      res.status(401).json({
        message: "Planilha Não Existe! Ou Não Associada A Este Evento!",
      });
      return;
    }

    const par = {
      id_empresa: parametros.id_empresa,
      id_evento: parametros.id_evento,
      id_cabec: parametros.id_planilha,
      cnpj_cpf: "",
      nome: "",
      inscricao:-1,
      nro_peito:-1,
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

    cabec = await uploadPlanilhaSrv.processamentov2(req, cabec, detalhes);

    evento.status = "2";

    evento.user_update = parametros.id_usuario;

    await eventoSrv.updateEvento(evento);

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


router.post("/checkplanilha", async function(req, res) {

  id_empresa = req.id_empresa;
  id_usuario = req.id_usuario;

  console.log("planilha req.body:", req.body);

  const { id_evento, fileName, tentativa, maxTentativas } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "fileName é obrigatório" });
  }

   if (Number(tentativa) > Number(maxTentativas)) {
    return res.status(200).json({
      status: "exceeded",
      message: "Limite de tentativas excedido"
    });
  }


  const par = {
    id_empresa: id_empresa,
    id_evento: id_evento,
    id: 0,
    arquivo: fileName,
    status: '',
    pagina: 0,
    tamPagina: 50,
    contador: 'N',
    orderby: '',
    sharp: false,
  };

  const planilhas = await cabPlanilhaSrv.getCabplanilhas(par);

  if (planilhas.length == 0) {
      return res.status(404).json({
      status: "failed",
      message: "Planilha Não Encontrada",
      total_linhas      : 0,
      linhas_processadas: 0,
      total_linhas_erro : 0
    });
  }

  if (planilhas.status === '0') {
    return res.status(200).json({
      status:  "pending",
      message: "Planilha Ainda Não Disponível",
      total_linhas      : 0,
      linhas_processadas: 0,
      total_linhas_erro : 0
    });
  }
  
 
  return res.status(200).json({
    status: "ready",
    message: "Planilha Disponivel",
      total_linhas      : planilhas[0].total_linhas,
      linhas_processadas: planilhas[0].linhas_processadas,
      total_linhas_erro : planilhas[0].total_linhas_erro
  });
});


module.exports = router;
