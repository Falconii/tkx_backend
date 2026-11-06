/*
  ROUTE tarefas (relatorios assincronos)

    POST /api/tarefa                 cria a tarefa  { sigla, parametros }
    GET  /api/tarefa                 lista as ultimas tarefas do usuario logado
    POST /api/tarefa/pesquisa        pesquisa paginada com filtro (tela de acompanhamento)
    GET  /api/tarefa/relatorios      relatorios disponiveis { sigla, titulo }
    GET  /api/tarefa/:id             status de uma tarefa (usado no polling da tela)
    GET  /api/tarefa/:id/download    baixa a planilha   (so se concluida)
    POST /api/tarefa/:id/email       envia a planilha por e-mail (so se concluida)

  id_empresa e id_usuario vem SEMPRE do token (req.id_empresa / req.id_usuario).
  Uma tarefa so e visivel para o usuario que a criou.
*/
const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middleware/autenticartoken");
const tarefaData = require("../data/complementar/tarefaData");
const usuarioSrv = require("../service/usuarioService");
const funcoes = require("../email/funcoes");
const relatorios = require("../excel/relatorios");
const processamento = require("../service/processamentoService");
const response = require("../util/respostaPadrao");

const { STATUS } = processamento;
const MAX_PARAMETROS = 20000; // caracteres do JSON do filtro

router.use(autenticarToken);

function erroInterno(res, err) {
  console.error("tarefaRoute:", err);
  return res.status(500).json({ erro: "BACK-END", tabela: "Tarefa", message: err.message });
}

/* id numerico valido ou null */
function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/* nome unico do arquivo: evento01_20261105-142530_a1b2c3.xlsx */
function gerarNomeArquivo(sigla) {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const carimbo = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  return `${sigla}_${carimbo}_${crypto.randomBytes(3).toString("hex")}.xlsx`;
}

/* ---------- cria a tarefa ---------- */
router.post("/", async function (req, res) {
  try {
    const { sigla } = req.body;
    let { parametros } = req.body;

    const ausentes = ["sigla", "parametros"].filter((c) => req.body[c] === undefined || req.body[c] === null || req.body[c] === "");
    if (ausentes.length > 0) return response.validationError(res, ausentes);

    if (typeof sigla !== "string" || !relatorios.existe(sigla)) {
      return response.error(res, "Relatório desconhecido", 400, { sigla });
    }

    // aceita o filtro como objeto ou como JSON em texto
    if (typeof parametros === "string") {
      try {
        parametros = JSON.parse(parametros);
      } catch {
        return response.error(res, "Parâmetros não são um JSON válido", 400);
      }
    }
    if (parametros === null || typeof parametros !== "object" || Array.isArray(parametros)) {
      return response.error(res, "Parâmetros devem ser um objeto", 400);
    }

    const texto = JSON.stringify(parametros);
    if (texto.length > MAX_PARAMETROS) {
      return response.error(res, "Parâmetros muito grandes", 400);
    }

    const tarefa = await tarefaData.incluir({
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      name_file: gerarNomeArquivo(sigla),
      sigla,
      parametros: texto,
    });

    processamento.solicitarCiclo(); // nao espera o proximo intervalo do job

    return response.success(res, "Relatório em processamento!", { tarefa }, 201);
  } catch (err) {
    return erroInterno(res, err);
  }
});

/* nome amigavel do relatorio (vem do registro excel/relatorios.js, uma fonte so) */
function comTitulo(tarefa) {
  return { ...tarefa, titulo: relatorios.RELATORIOS[tarefa.sigla]?.titulo || tarefa.sigla };
}

/* ---------- lista as tarefas do usuario ---------- */
router.get("/", async function (req, res) {
  try {
    const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 100, 1), 500);
    const lista = await tarefaData.listarDoUsuario(req.id_empresa, req.id_usuario, limite);
    return res.status(200).json(lista.map(comTitulo));
  } catch (err) {
    return erroInterno(res, err);
  }
});

/* ---------- relatorios disponiveis (sigla + titulo), para o filtro da tela ---------- */
router.get("/relatorios", function (req, res) {
  const lista = Object.entries(relatorios.RELATORIOS)
    .map(([sigla, r]) => ({ sigla, titulo: r.titulo }))
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt", { sensitivity: "base" }));
  return res.status(200).json(lista);
});

/*
  ---------- pesquisa paginada (tela de acompanhamento) ----------
  body: { status, sigla, pagina, tamPagina, contador, orderby }
    pagina 0 = sem paginacao (limitado a 500 linhas) | contador 'S' devolve { total }
  Sempre restrita ao usuario logado.
*/
const MAX_SEM_PAGINACAO = 500;

router.post("/pesquisa", async function (req, res) {
  try {
    const b = req.body || {};
    const texto = (v) => (typeof v === "string" ? v.trim() : "");

    const status = texto(b.status);
    if (status && !Object.values(STATUS).includes(status)) {
      return response.error(res, "Situação inválida", 400, { status });
    }
    const sigla = texto(b.sigla);
    if (sigla && !relatorios.existe(sigla)) {
      return response.error(res, "Relatório desconhecido", 400, { sigla });
    }

    const pagina = Math.max(parseInt(b.pagina, 10) || 0, 0);
    const tamPagina = Math.min(Math.max(parseInt(b.tamPagina, 10) || 50, 1), 200);

    const filtro = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      status,
      sigla,
      orderby: texto(b.orderby),
    };

    if (b.contador === "S") {
      return res.status(200).json(await tarefaData.contarDoUsuario(filtro));
    }

    const lista = await tarefaData.pesquisarDoUsuario({
      ...filtro,
      limite: pagina === 0 ? MAX_SEM_PAGINACAO : tamPagina,
      deslocamento: pagina === 0 ? 0 : (pagina - 1) * tamPagina,
    });
    return res.status(200).json(lista.map(comTitulo));
  } catch (err) {
    return erroInterno(res, err);
  }
});

/* ---------- status de uma tarefa ---------- */
router.get("/:id", async function (req, res) {
  try {
    const id = lerId(req);
    if (!id) return response.error(res, "Id inválido", 400);

    const tarefa = await tarefaData.buscarDoUsuario(req.id_empresa, req.id_usuario, id);
    if (!tarefa) return response.notFound(res, "Tarefa", { id });

    return res.status(200).json(comTitulo(tarefa));
  } catch (err) {
    return erroInterno(res, err);
  }
});

/* tarefa concluida do usuario + caminho do arquivo, ou responde o erro e devolve null */
async function tarefaPronta(req, res) {
  const id = lerId(req);
  if (!id) {
    response.error(res, "Id inválido", 400);
    return null;
  }

  const tarefa = await tarefaData.buscarDoUsuario(req.id_empresa, req.id_usuario, id);
  if (!tarefa) {
    response.notFound(res, "Tarefa", { id });
    return null;
  }

  if (tarefa.status !== STATUS.CONCLUIDA) {
    response.error(res, "Relatório ainda não está disponível", 409, { status: tarefa.status, mensagem: tarefa.mensagem });
    return null;
  }

  const caminho = processamento.caminhoArquivo(tarefa.name_file);
  if (!fs.existsSync(caminho)) {
    response.error(res, "Arquivo expirado ou não encontrado. Gere o relatório novamente.", 410);
    return null;
  }

  return { tarefa, caminho };
}

/* ---------- download ---------- */
router.get("/:id/download", async function (req, res) {
  try {
    const pronta = await tarefaPronta(req, res);
    if (!pronta) return;

    return res.download(pronta.caminho, pronta.tarefa.name_file, (err) => {
      if (err && !res.headersSent) erroInterno(res, err);
    });
  } catch (err) {
    return erroInterno(res, err);
  }
});

/* ---------- e-mail ---------- */
router.post("/:id/email", async function (req, res) {
  try {
    const pronta = await tarefaPronta(req, res);
    if (!pronta) return;

    const usuario = await usuarioSrv.getUsuario(req.id_empresa, req.id_usuario);
    if (!usuario) return response.notFound(res, "Usuário", { usuario: req.id_usuario });

    const titulo = relatorios.RELATORIOS[pronta.tarefa.sigla]?.titulo || pronta.tarefa.sigla;
    const resultado = await funcoes.preparaEmailRelatorioEvento(usuario, { descricao: titulo }, pronta.caminho);

    // a funcao de e-mail nao lanca erro: devolve { message } e as falhas comecam com "Falha"
    if (/^falha/i.test(resultado.message)) {
      return response.error(res, resultado.message, 502);
    }
    return response.success(res, resultado.message, { destinatario: usuario.email });
  } catch (err) {
    return erroInterno(res, err);
  }
});

module.exports = router;
