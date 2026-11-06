/*
  GERADOR GENERICO DE EXCEL (streaming)

  gerarExcelGenerico(rows, config, caminhoArquivo)

    rows            array (ou iteravel / async iteravel) de objetos { coluna: valor }
    config          objeto gerado por configrelatorios.js (excel/config/<sigla>.js):
                    {
                      sheetName, freezeHeader, autoFilter,
                      columns: [{ header, key, width, align, format, hidden }]
                    }
    caminhoArquivo  destino final do .xlsx

  - Escreve em "<arquivo>.tmp" e so renomeia para o nome final quando o arquivo estiver
    completo; quem consulta o status/arquivo nunca ve uma planilha pela metade.
  - Usa o WorkbookWriter (streaming): nao carrega a planilha inteira na memoria.
  - Colunas com "hidden: true" no config nao saem no Excel.
*/
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { finished } = require("stream/promises");

const LINHAS_POR_LOTE = 500;
const FORMATO_DATA =/d{1,2}[\/.-]m{1,2}|yy|hh|mm\/|\bdd\b/i;

function numeroParaColunaExcel(n) {
  let coluna = "";
  while (n > 0) {
    const resto = (n - 1) % 26;
    coluna = String.fromCharCode(65 + resto) + coluna;
    n = Math.floor((n - 1) / 26);
  }
  return coluna;
}

/* Excel nao aceita estes caracteres no nome da aba e limita a 31 caracteres */
function nomeAba(nome) {
  return String(nome || "Relatório").replace(/[\\\/?*\[\]:]/g, " ").trim().slice(0, 31) || "Relatório";
}

/* Date do JS -> Date "UTC" com os mesmos relogio/dia locais (o ExcelJS grava em UTC) */
function dataParaExcel(d) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
}

function converterNumero(valor) {
  if (typeof valor === "number") return valor;
  if (typeof valor !== "string") return valor;
  const s = valor.trim();
  if (s === "") return null;
  // "1.234,56" (formato BR, tem virgula) -> 1234.56 ; "1234.56" (pg/numeric) -> 1234.56
  const normal = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normal);
  return Number.isNaN(n) ? valor : n; // se nao for numero, mantem o texto original
}

function converterData(valor) {
  if (valor instanceof Date) return dataParaExcel(valor);
  if (typeof valor !== "string") return valor;
  const s = valor.trim();
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/); // DD/MM/YYYY [HH:MM[:SS]]
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)));
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/); // YYYY-MM-DD [HH:MM[:SS]]
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)));
  return valor; // formato desconhecido: mantem o texto
}

function converterValor(valor, col) {
  if (valor === null || valor === undefined) return null;
  if (!col.format) return valor instanceof Date ? dataParaExcel(valor) : valor;
  return FORMATO_DATA.test(col.format) ? converterData(valor) : converterNumero(valor);
}

async function gerarExcelGenerico(rows, config, caminhoArquivo) {
  const colunas = (config.columns || []).filter((c) => !c.hidden);
  if (colunas.length === 0) throw new Error("gerarExcelGenerico: config sem colunas.");

  const caminhoTmp = caminhoArquivo + ".tmp";
  await fs.promises.mkdir(path.dirname(caminhoArquivo), { recursive: true });

  const saida = fs.createWriteStream(caminhoTmp);
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: saida,
    useStyles: true,
    // false = memoria constante. Com true o ExcelJS guarda todo texto unico na memoria
    // (medido: +924MB para 100 mil linhas de texto diferente, contra +42MB com false).
    useSharedStrings: false,
  });

  try {
    const worksheet = workbook.addWorksheet(nomeAba(config.sheetName), {
      views: config.freezeHeader === false ? [] : [{ state: "frozen", ySplit: 1 }],
    });

    worksheet.columns = colunas.map((col) => {
      const style = {};
      if (col.align) style.alignment = { horizontal: col.align };
      if (col.format) style.numFmt = col.format;
      return { header: col.header ?? col.key, key: col.key, width: col.width || 20, style };
    });

    if (config.autoFilter !== false) {
      worksheet.autoFilter = { from: "A1", to: `${numeroParaColunaExcel(colunas.length)}1` };
    }

    // cabecalho: negrito, centralizado e com fundo cinza
    const cabecalho = worksheet.getRow(1);
    cabecalho.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.numFmt = "General";
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE7E6E6" } };
    });
    cabecalho.commit();

    let n = 0;
    for await (const origem of rows) {
      const linha = {};
      for (const col of colunas) linha[col.key] = converterValor(origem[col.key], col);
      worksheet.addRow(linha).commit();

      // Roda no mesmo processo da API: a cada lote cede a vez ao event loop, senao
      // as requisicoes ficam paradas ate a planilha terminar.
      if (++n % LINHAS_POR_LOTE === 0) await new Promise((r) => setImmediate(r));
    }

    worksheet.commit();
    await workbook.commit();
    await finished(saida); // espera o arquivo fechar de verdade antes do rename
    await fs.promises.rename(caminhoTmp, caminhoArquivo);
  } catch (err) {
    saida.destroy();
    await fs.promises.rm(caminhoTmp, { force: true }).catch(() => {});
    throw err;
  }

  return caminhoArquivo;
}

module.exports = { gerarExcelGenerico };
