/*
  REGISTRO DOS RELATORIOS  (sigla da tarefa -> consulta + config de colunas)

  Fonte unica usada pelo job (service/processamentoService.js) e pelo gerador de config
  (configrelatorios.js). Para criar um relatorio novo:
    1. acrescente a sigla aqui (servico + funcao de pesquisa do CRUD);
    2. rode  node configrelatorios.js <sigla>  para gerar excel/config/<sigla>.js;
    3. ajuste as colunas a mao, se quiser.

  Os services so sao carregados quando o relatorio e usado (require preguicoso).
*/
const path = require("path");

const RAIZ = path.join(__dirname, "..");

/* servico = caminho a partir da raiz do backend ; funcao = pesquisa paginada do CRUD */
const RELATORIOS = {
  evento01: { titulo: "Eventos", servico: "service/eventoService", funcao: "getEventos" },
  empresa01: { titulo: "Empresas", servico: "service/empresaService", funcao: "getEmpresas" },
  usuario01: { titulo: "Usuários", servico: "service/usuarioService", funcao: "getUsuarios" },
  grupousuario01: { titulo: "Grupos de Usuários", servico: "service/grupousuarioService", funcao: "getGruposusuarios" },
  categoria01: { titulo: "Categorias", servico: "service/categoriaService", funcao: "getCategorias" },
  categoriacontador01: { titulo: "Contadores de Categoria", servico: "service/categoriacontadorService", funcao: "getCategoriacontadores" },
  participantev201: { titulo: "Participantes V2", servico: "service/participantev2Service", funcao: "getParticipantesv2" },
  entregav201: { titulo: "Entregas V2", servico: "service/entregav2Service", funcao: "getEntregasv2" },
  cabplanilha01: { titulo: "Planilhas", servico: "service/cabplanilhaService", funcao: "getCabplanilhas" },
  detplanilha01: { titulo: "Detalhes de Planilhas", servico: "service/detPlanilhaService", funcao: "getDetplanilhas" },
  usuario_evento01: { titulo: "Usuários por Evento", servico: "service/usuario_eventoService", funcao: "getUsuarios_Eventos" },
  link01: { titulo: "Links", servico: "service/linkService", funcao: "getLnks" },
  token01: { titulo: "Tokens", servico: "service/tokenService", funcao: "getTokens" },
  parametro01: { titulo: "Parâmetros", servico: "service/parametroService", funcao: "getParametros" },
  tarefa01: { titulo: "Tarefas", servico: "service/tarefaService", funcao: "getTarefas" },
};

function existe(sigla) {
  return Object.prototype.hasOwnProperty.call(RELATORIOS, sigla);
}

/* Devolve { titulo, consulta(params), config } ou lanca erro claro */
function obter(sigla) {
  if (!existe(sigla)) throw new Error(`Relatório desconhecido: "${sigla}"`);
  const r = RELATORIOS[sigla];

  let config;
  try {
    config = require(path.join(__dirname, "config", sigla));
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      throw new Error(`Config de colunas não encontrada para "${sigla}". Rode: node configrelatorios.js ${sigla}`);
    }
    throw e;
  }

  const servico = require(path.join(RAIZ, r.servico));
  return { titulo: r.titulo, config, consulta: (params) => servico[r.funcao](params) };
}

module.exports = { RELATORIOS, RAIZ, existe, obter };
