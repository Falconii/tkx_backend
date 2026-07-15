const ExcelJS = require("exceljs");

async function gerarPlanilha({
  rows,
  regras = {},
  nomeAba = "Planilha",
  arquivo = "saida.xlsx",
}) {
  if (!rows || rows.length === 0) {
    throw new Error("Nenhum dado recebido para gerar a planilha");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(nomeAba);

  // Colunas dinâmicas
  const colunas = Object.keys(rows[0]);

  worksheet.columns = colunas.map((col) => ({
    header: col.toUpperCase(),
    key: col,
    width: 20,
  }));

  // Estilizar cabeçalho
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCCCCC" },
    };
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // Congelar cabeçalho
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // AutoFiltro
  worksheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + colunas.length)}1`,
  };

  // Inserir linhas com formatação dinâmica
  rows.forEach((row) => {
    const newRow = worksheet.addRow(row);

    colunas.forEach((col, index) => {
      const cell = newRow.getCell(index + 1);
      const regra = regras[col] || {};

      cell.alignment = {
        horizontal: regra.align || "left",
        vertical: "middle",
      };

      if (typeof regra.decimals === "number") {
        const casas = regra.decimals;
        cell.numFmt = `#,##0${casas > 0 ? "." + "0".repeat(casas) : ""}`;
      }
    });
  });

  // 🔧 Ajuste automático da largura das colunas
  worksheet.columns.forEach((column) => {
    let maxLength = 10;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const valor = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, valor.length + 2);
    });

    column.width = maxLength;
  });

  await workbook.xlsx.writeFile(arquivo);
  console.log(`Planilha gerada: ${arquivo}`);
}

module.exports = gerarPlanilha;
