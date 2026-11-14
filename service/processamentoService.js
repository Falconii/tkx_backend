/*
  SERVICE de processamento da fila de relatorios (tabela "tarefas")

  Roda dentro do proprio processo da API: nao ha worker separado.

    - A cada INTERVALO_SEGUNDOS procura tarefas pendentes (status '0').
    - Alem disso, quando uma tarefa e criada a rota chama solicitarCiclo(), entao o
      relatorio comeca em instantes em vez de esperar o proximo intervalo.
    - Um ciclo nunca sobrepoe outro. As tarefas sao processadas uma de cada vez.
    - Ao iniciar, devolve para a fila o que ficou "processando" por queda do servidor.
    - Apaga as planilhas concluidas ha mais de DIAS_RETENCAO dias.

  Como cada tarefa vira um relatorio:  sigla -> excel/relatorios.js (consulta + colunas).
*/
const fs = require("fs");
const path = require("path");
const tarefaData = require("../data/complementar/tarefaData");
const relatorios = require("../excel/relatorios");
const { gerarExcelGenerico } = require("../excel/excelgenerator");

const LOTE = 5; // tarefas reservadas por vez
const DIAS_RETENCAO = 7; // dias que a planilha fica disponivel para download
const LIMPEZA_A_CADA_MS = 6 * 60 * 60 * 1000;

const PASTA = process.env.RELATORIOS_DIR || path.join(__dirname, "..", "rel_excel");

const STATUS = { PENDENTE: "0", PROCESSANDO: "1", CONCLUIDA: "2", ERRO: "3", SEM_DADOS: "4" };

/* caminho seguro: so o nome do arquivo, nunca um caminho vindo de fora */
function caminhoArquivo(nameFile) {
  return path.join(PASTA, path.basename(String(nameFile)));
}

/* ---------- uma tarefa ---------- */
function montarParametros(tarefa) {
  let params;
  try {
    params = JSON.parse(tarefa.parametros);
  } catch {
    throw new Error("Parâmetros da tarefa não são um JSON válido.");
  }
  if (params === null || typeof params !== "object" || Array.isArray(params)) {
    throw new Error("Parâmetros da tarefa inválidos.");
  }
  return {
    ...params,
    id_empresa: tarefa.id_empresa, // sempre a da tarefa (vem do token), nunca a enviada pelo cliente
    pagina: Number(params.pagina) || 0, // 0 = toda a consulta
    tamPagina: Number(params.tamPagina) || 50,
    contador: "N",
    sharp: params.sharp === true,
    orderby: params.orderby ?? "",
  };
}

async function processar(tarefa) {
  try {
    const relatorio = relatorios.obter(tarefa.sigla);
    const params = montarParametros(tarefa);

    if (relatorio.gerar) {
      const linhas = await relatorio.gerar(params, caminhoArquivo(tarefa.name_file));
      if (!linhas) await tarefaData.encerrar(tarefa.id, STATUS.SEM_DADOS, "Consulta sem resultados");
      else await tarefaData.encerrar(tarefa.id, STATUS.CONCLUIDA, "");
      return;
    }

    const rows = await relatorio.consulta(params);

    if (!Array.isArray(rows) || rows.length === 0) {
      await tarefaData.encerrar(tarefa.id, STATUS.SEM_DADOS, "Consulta sem resultados");
      return;
    }

    await gerarExcelGenerico(rows, { ...relatorio.config, titulo: relatorio.titulo }, caminhoArquivo(tarefa.name_file));
    await tarefaData.encerrar(tarefa.id, STATUS.CONCLUIDA, "");
  } catch (err) {
    console.error(`Tarefa ${tarefa.id} (${tarefa.sigla}) falhou:`, err);
    await tarefaData.encerrar(tarefa.id, STATUS.ERRO, err.message).catch((e) => {
      console.error(`Tarefa ${tarefa.id}: não consegui gravar o erro:`, e);
    });
  }
}

/* ---------- ciclo ---------- */
let rodando = false;

async function ciclo() {
  if (rodando) return;
  rodando = true;
  try {
    let tarefas;
    do {
      tarefas = await tarefaData.reservarPendentes(LOTE);
      for (const tarefa of tarefas) await processar(tarefa);
    } while (tarefas.length === LOTE); // se o lote veio cheio, pode haver mais na fila
  } catch (err) {
    console.error("Erro no ciclo de processamento de tarefas:", err);
  } finally {
    rodando = false;
  }
}

/* chamada pela rota logo apos criar a tarefa */
function solicitarCiclo() {
  if (!rodando) setImmediate(ciclo);
}

/* ---------- limpeza de planilhas antigas ---------- */
async function limparExpiradas() {
  try {
    const antigas = await tarefaData.concluidasAntigas(DIAS_RETENCAO);
    for (const t of antigas) {
      await fs.promises.rm(caminhoArquivo(t.name_file), { force: true });
      await tarefaData.marcarExpirada(t.id);
    }
    if (antigas.length) console.log(`Planilhas expiradas removidas: ${antigas.length}`);
  } catch (err) {
    console.error("Erro ao limpar planilhas expiradas:", err);
  }
}

/* ---------- inicio ---------- */
let timer = null;

async function startProcessamentoTarefas(intervaloSegundos = 20) {
  if (timer) return; // ja iniciado

  const devolvidas = await tarefaData.recuperarTravadas().catch((e) => {
    console.error("Erro ao recuperar tarefas travadas:", e);
    return 0;
  });
  if (devolvidas) console.log(`Tarefas que estavam em processamento voltaram para a fila: ${devolvidas}`);

  const agendar = () => {
    timer = setTimeout(async () => {
      await ciclo();
      agendar();
    }, intervaloSegundos * 1000);
    timer.unref?.(); // o timer sozinho nao impede o processo de encerrar
  };

  agendar();
  ciclo();
  limparExpiradas();
  setInterval(limparExpiradas, LIMPEZA_A_CADA_MS).unref();

  console.log(`Processamento de tarefas ativo (a cada ${intervaloSegundos}s).`);
}

function stopProcessamentoTarefas() {
  if (timer) clearTimeout(timer);
  timer = null;
}

module.exports = {
  startProcessamentoTarefas,
  stopProcessamentoTarefas,
  solicitarCiclo,
  ciclo,
  limparExpiradas,
  caminhoArquivo,
  STATUS,
};
