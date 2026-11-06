/*
  GERADOR DE CONFIG DE COLUNAS DOS RELATORIOS (Excel)

  Uso (rodar a partir da pasta tkx_backend, por causa do ./conexoes_local.json):

    node configrelatorios.js                      -> lista as siglas disponiveis
    node configrelatorios.js evento01             -> gera/atualiza excel/config/evento01.js
    node configrelatorios.js evento01 --dry       -> so imprime, nao grava
    node configrelatorios.js evento01 --empresa 2 -> usa id_empresa 2 na consulta (padrao 1)
    node configrelatorios.js evento01 --force     -> sobrescreve, ignorando ajustes manuais

  Como funciona:
    1. Chama a MESMA funcao de pesquisa do CRUD (service) com so os parametros comuns
       (id_empresa, pagina 0, ...). Os data/*.js ignoram parametros ausentes.
    2. O data/*.js nao devolve o SQL (nao tem "saida"), entao o infra/database e trocado
       por um gravador que captura o SQL montado e devolve vazio.
    3. Esse SQL e executado de verdade (com LIMIT) para ler o tipo de cada coluna
       (result.fields[].dataTypeID) e medir a largura pelos valores.
    4. Se o arquivo de config ja existe, faz MERGE: colunas existentes mantem os seus
       ajustes manuais, colunas novas sao acrescentadas, as que sumiram da consulta
       sao apenas avisadas (nao sao removidas).
*/
const fs = require("fs");
const path = require("path");
const { types } = require("pg");

const T = types.builtins;

/* sigla -> service + funcao de pesquisa: fonte unica em excel/relatorios.js */
const { RELATORIOS, RAIZ } = require("./excel/relatorios");

const LIMITE_AMOSTRA = 200; // linhas lidas so para medir a largura
const LARGURA_MAX = 60;

/* ---------- argumentos ---------- */
const args = process.argv.slice(2);
const sigla = args.find((a) => !a.startsWith("--"));
const dry = args.includes("--dry");
const force = args.includes("--force");
const iEmp = args.indexOf("--empresa");
const idEmpresa = iEmp >= 0 ? Number(args[iEmp + 1]) : 1;

if (!sigla || !RELATORIOS[sigla]) {
  if (sigla) console.log(`Sigla desconhecida: ${sigla}\n`);
  console.log("Siglas disponiveis:");
  Object.keys(RELATORIOS).forEach((s) => console.log("  " + s));
  process.exit(sigla ? 1 : 0);
}

/* ---------- regra por tipo do dado ---------- */
function regraPorTipo(oid) {
  switch (oid) {
    case T.INT2:
    case T.INT4:
    case T.INT8:
      return { align: "right", format: "0" };
    case T.FLOAT4:
    case T.FLOAT8:
    case T.NUMERIC:
      return { align: "right", format: "#,##0.00;#,##0.00;0" };
    case T.DATE:
    case T.TIMESTAMP:
    case T.TIMESTAMPTZ:
      return { align: "center", format: "dd/mm/yyyy" };
    case T.BOOL:
      return { align: "center", format: null };
    default:
      return { align: "left", format: null };
  }
}

function formatoExibicao(v) {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return "dd/mm/yyyy";
  return String(v);
}

/* ---------- 1 e 2: captura o SQL da consulta real ---------- */
async function capturarSql() {
  const dbPath = require.resolve("./infra/database");
  const dbReal = require(dbPath); // abre a conexao real (so para executar o SQL capturado)

  let sqlCapturado = "";
  const gravador = new Proxy(
    {},
    {
      get: () => async (sql) => {
        if (typeof sql === "string" && /^\s*select/i.test(sql)) sqlCapturado = sql;
        return [];
      },
    },
  );
  // a partir daqui os data/*.js recebem o gravador no lugar do banco
  require.cache[dbPath].exports = gravador;

  const log = console.log;
  console.log = () => {}; // os data/*.js imprimem o SQL; silencia durante a captura
  try {
    const { servico, funcao } = RELATORIOS[sigla];
    const params = {
      id_empresa: idEmpresa,
      saida: 3,
      pagina: 0,
      tamPagina: 50,
      contador: "N",
      orderby: "",
      sharp: false,
    };
    await require(path.join(RAIZ, servico))[funcao](params);
  } finally {
    console.log = log;
  }

  if (!sqlCapturado) throw new Error("Nao consegui capturar o SQL da consulta.");
  return { dbReal, sql: sqlCapturado };
}

/* ---------- 3: colunas a partir do banco ---------- */
async function gerarColunas(dbReal, sql) {
  const base = sql.trim().replace(/;\s*$/, "");
  const result = await dbReal.result(`SELECT * FROM (${base}) t LIMIT ${LIMITE_AMOSTRA}`);

  return result.fields.map((f) => {
    const { align, format } = regraPorTipo(f.dataTypeID);
    let maxLen = f.name.length;
    for (const r of result.rows) {
      const len = formatoExibicao(r[f.name]).length;
      if (len > maxLen) maxLen = len;
    }
    return {
      header: f.name,
      key: f.name,
      width: Math.min(maxLen + 2, LARGURA_MAX),
      align,
      format,
    };
  });
}

/* ---------- 4: merge com o arquivo existente ---------- */
function mesclar(existente, geradas) {
  const porKey = new Map(existente.columns.map((c) => [c.key, c]));
  const novas = [];
  const colunas = geradas.map((g) => {
    if (porKey.has(g.key)) return porKey.get(g.key); // mantem ajuste manual
    novas.push(g.key);
    return g;
  });
  const chavesGeradas = new Set(geradas.map((g) => g.key));
  const orfas = existente.columns.filter((c) => !chavesGeradas.has(c.key));
  // colunas que sairam da consulta continuam no arquivo (no fim); so avisa
  return {
    config: { ...existente, columns: [...colunas, ...orfas] },
    novas,
    sumidas: orfas.map((c) => c.key),
  };
}

(async () => {
  const { dbReal, sql } = await capturarSql();
  const geradas = await gerarColunas(dbReal, sql);

  let config = { sheetName: "Relatório", freezeHeader: true, autoFilter: true, columns: geradas };

  const pasta = path.join(__dirname, "excel", "config");
  const arquivo = path.join(pasta, `${sigla}.js`);
  const existe = fs.existsSync(arquivo);

  if (existe && !force) {
    const { config: mesclada, novas, sumidas } = mesclar(require(arquivo), geradas);
    config = mesclada;
    console.log(`Arquivo existente: merge feito (${novas.length} nova(s), ${sumidas.length} fora da consulta).`);
    if (novas.length) console.log("  novas colunas   :", novas.join(", "));
    if (sumidas.length) console.log("  nao estao mais na consulta (mantidas):", sumidas.join(", "));
  }

  const conteudo = `// Gerado por configrelatorios.js (${sigla}). Pode ser ajustado a mao:\n` +
    `// colunas ja existentes NAO sao sobrescritas numa nova geracao.\n` +
    `module.exports = ${JSON.stringify(config, null, 2)};\n`;

  console.log(`\nSQL capturado:\n${sql.trim().replace(/\s+/g, " ")}\n`);
  console.log(`Colunas (${config.columns.length}):`);
  console.table(config.columns.map(({ key, width, align, format }) => ({ key, width, align, format })));

  if (dry) {
    console.log("--dry: nada foi gravado.");
  } else {
    fs.mkdirSync(pasta, { recursive: true });
    fs.writeFileSync(arquivo, conteudo);
    console.log("Gravado em", path.relative(process.cwd(), arquivo));
  }
  process.exit(0);
})().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
