/* ROUTE importacao de planilhas de participantes */
const express = require("express");
const router = express.Router();
const multer = require("multer");
const iconv = require("iconv-lite");
const cabPlanilhaSrv = require("../service/cabplanilhaService.js");
const importacaoSrv = require("../service/importacaoService.js");
const uploadPlanilha = require("../config_multer/config_multer_planilha");
const { autenticarToken } = require("../middleware/autenticartoken");

const { ErroImportacao } = importacaoSrv;

router.use(autenticarToken);

/*
  Erros de negocio NAO usam 401: o front trata 401 como "sessao expirada" e manda o usuario para o login.
    400 entrada invalida | 404 nao existe | 409 conflito de estado | 413 arquivo grande | 422 conteudo do arquivo
*/
function responderErro(res, err) {
  if (err instanceof ErroImportacao) {
    return res.status(err.status).json({ erro: "BAK-END", tabela: "Importacao", message: err.message, detalhes: err.detalhes });
  }
  console.log(err);
  // indice unico (empresa, evento, peito): outra operacao usou o mesmo numero no meio do caminho; a transacao foi desfeita
  if (err && err.code === "23505") {
    return res.status(409).json({ erro: "BAK-END", tabela: "Importacao", message: "Já existe participante com o mesmo número de peito neste evento. Nada foi processado." });
  }
  if (err && err.name == "MyExceptionDB") return res.status(409).json(err);
  return res.status(500).json({ erro: "BAK-END", tabela: "Importacao", message: err.message });
}

/* o multer entrega o nome em latin1: decodifica para utf8 */
function nomeDoArquivo(file) {
  return iconv.decode(Buffer.from(file.originalname, "latin1"), "utf8");
}

/* recebe o arquivo e traduz os erros do multer em respostas JSON */
function receberArquivo(req, res, next) {
  uploadPlanilha.single("file")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ erro: "BAK-END", tabela: "Importacao", message: "Arquivo maior que o limite de 10 MB." });
    }
    return responderErro(res, err);
  });
}

router.post("/loadplanilha", receberArquivo, async function (req, res) {
  try {
    if (!req.file) throw new ErroImportacao(400, "Arquivo não informado.");

    const resultado = await importacaoSrv.carregarPlanilha({
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      id_evento: Number(req.body.id_evento),
      arquivo: nomeDoArquivo(req.file),
      conteudo: req.file.buffer.toString("utf8"),
    });

    res.status(200).json({
      message: "Planilha Importada com Sucesso!",
      linhas_processadas: resultado.cabec.linhas_processadas,
      total_linhas: resultado.total_linhas,
      linhas_ok: resultado.linhas_ok,
      total_linhas_erro: resultado.total_linhas_erro,
      linhas_ignoradas: resultado.linhas_ignoradas,
      peitos_gerados: resultado.peitos_gerados,
      linhas_com_aviso: resultado.linhas_com_aviso,
      cabec: resultado.cabec,
    });
  } catch (err) {
    responderErro(res, err);
  }
});

router.post("/processamentoV2", async function (req, res) {
  try {
    const resultado = await importacaoSrv.processarPlanilha({
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      id_evento: Number(req.body.id_evento),
      id_planilha: Number(req.body.id_planilha),
    });

    res.status(200).json({
      cabec: resultado.cabec,
      participantes_incluidos: resultado.participantes_incluidos,
      participantes_com_cpf_invalido: resultado.participantes_com_cpf_invalido,
      message: "Processamento da Planilha Finalizado!",
    });
  } catch (err) {
    responderErro(res, err);
  }
});

/*
  Mantida por compatibilidade com o dialogo de importacao atual. A carga agora termina na propria
  requisicao de upload (ou nao deixa nada gravado), entao a planilha ja nasce pronta.
*/
router.post("/checkplanilha", async function (req, res) {
  try {
    const { id_evento, fileName, tentativa, maxTentativas } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "fileName é obrigatório" });
    }

    if (Number(tentativa) > Number(maxTentativas)) {
      return res.status(200).json({ status: "exceeded", message: "Limite de tentativas excedido" });
    }

    const planilhas = await cabPlanilhaSrv.getCabplanilhas({
      id_empresa: req.id_empresa,
      id_evento: Number(id_evento) || 0,
      id: 0,
      arquivo: fileName,
      status: "",
      pagina: 0,
      tamPagina: 50,
      contador: "N",
      orderby: "",
      sharp: true, // nome exato
    });

    if (planilhas.length == 0) {
      return res.status(404).json({
        status: "failed",
        message: "Planilha Não Encontrada",
        total_linhas: 0,
        linhas_processadas: 0,
        total_linhas_erro: 0,
      });
    }

    const planilha = planilhas[0];

    return res.status(200).json({
      status: "ready",
      message: "Planilha Disponivel",
      total_linhas: planilha.total_linhas,
      linhas_processadas: planilha.linhas_processadas,
      total_linhas_erro: planilha.total_linhas_erro,
    });
  } catch (err) {
    responderErro(res, err);
  }
});

module.exports = router;
