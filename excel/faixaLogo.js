/*
  FAIXA COM O LOGO NO TOPO DOS RELATORIOS EXCEL

    linhas 1-3   faixa: bloco do logo (largura do logo, fundo branco) + titulo do relatorio na faixa colorida
    linha 4      cabecalho das colunas (os dados comecam na linha 5)
    congelamento: as 4 primeiras linhas (faixa + cabecalho) ficam fixas ao rolar

  Duas formas de colocar a imagem:
    - Workbook normal (resumo do evento):  adicionarLogo(wb, ws)
    - Arquivo gerado em STREAMING (relatorios genericos): o ExcelJS 4.x nao aceita imagem no modo streaming
      (e o modo normal gasta ~4x mais memoria: 672 MB x 155 MB com 50 mil linhas). Entao o arquivo e gerado
      normalmente e, no final, injetarLogoNoArquivo() acrescenta a imagem ao pacote .xlsx (so mexe em
      arquivos pequenos: a planilha de dados e so acrescida de um elemento <drawing>).

  Se o arquivo do logo nao existir, a faixa sai so com o titulo (nunca quebra o relatorio).
*/
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

const LOGO = path.join(__dirname, "..", "logo", "logo-tkx.jpg");
const LOGO_LARGURA_PX = 137;
const LOGO_ALTURA_PX = 70;
const EMU_POR_PX = 9525;

const FAIXA_LINHAS = 3;
const ALTURA_LINHA_PT = 18; // 3 x 18 pt = 72 px  >=  70 px do logo
const LINHA_CABECALHO = FAIXA_LINHAS + 1;
const COR_FAIXA = "FF3F51B5";

const temLogo = () => fs.existsSync(LOGO);

function letraColuna(n) {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/* largura de coluna do Excel (em caracteres) -> pixels */
const pxDaColuna = (largura) => Math.round(largura * 7 + 5);

/* quantas colunas (a partir da A) o logo ocupa */
function colunasDoLogo(larguras) {
  let px = 0;
  let n = 0;
  for (const w of larguras) {
    px += pxDaColuna(w);
    n++;
    if (px >= LOGO_LARGURA_PX) break;
  }
  return n;
}

/*
  Escreve a faixa (linhas 1-3) numa planilha (normal ou streaming).
    larguras  largura (em caracteres) de cada coluna, na ordem
    titulo    texto da faixa
    commit    true no modo streaming (as linhas precisam ser confirmadas em ordem)
*/
function aplicarFaixa(ws, { larguras, titulo, commit = false }) {
  const total = larguras.length;
  const nLogo = temLogo() ? Math.min(colunasDoLogo(larguras), total) : 0;

  for (let r = 1; r <= FAIXA_LINHAS; r++) ws.getRow(r).height = ALTURA_LINHA_PT;

  if (nLogo > 0) ws.mergeCells(`A1:${letraColuna(nLogo)}${FAIXA_LINHAS}`);

  const ini = nLogo + 1;
  if (ini <= total) {
    ws.mergeCells(`${letraColuna(ini)}1:${letraColuna(total)}${FAIXA_LINHAS}`);
    const c = ws.getRow(1).getCell(ini);
    c.value = titulo;
    c.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    c.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COR_FAIXA } };
  }

  if (commit) for (let r = 1; r <= FAIXA_LINHAS; r++) ws.getRow(r).commit();
}

/* Workbook normal: coloca a imagem na planilha */
function adicionarLogo(wb, ws) {
  if (!temLogo()) return;
  const id = wb.addImage({ filename: LOGO, extension: "jpeg" });
  ws.addImage(id, { tl: { col: 0, row: 0 }, ext: { width: LOGO_LARGURA_PX, height: LOGO_ALTURA_PX } });
}

/* ---------- arquivo gerado em streaming: injeta a imagem na 1a planilha ---------- */
const NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

function xmlDesenho() {
  const cx = LOGO_LARGURA_PX * EMU_POR_PX;
  const cy = LOGO_ALTURA_PX * EMU_POR_PX;
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">` +
    `<xdr:oneCellAnchor>` +
    `<xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>` +
    `<xdr:ext cx="${cx}" cy="${cy}"/>` +
    `<xdr:pic>` +
    `<xdr:nvPicPr><xdr:cNvPr id="1" name="Logo"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>` +
    `<xdr:blipFill><a:blip xmlns:r="${NS_REL}" r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>` +
    `<xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>` +
    `</xdr:pic>` +
    `<xdr:clientData/>` +
    `</xdr:oneCellAnchor>` +
    `</xdr:wsDr>`
  );
}

const rels = (id, tipo, destino) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="${id}" Type="${NS_REL}/${tipo}" Target="${destino}"/></Relationships>`;

/* devolve true se a imagem foi inserida; em qualquer duvida deixa o arquivo como esta (relatorio sem logo) */
async function injetarLogoNoArquivo(caminho) {
  if (!temLogo()) return false;

  const zip = await JSZip.loadAsync(await fs.promises.readFile(caminho));
  // sem entradas de pasta no pacote (igual ao que o ExcelJS escreve)
  const adicionar = (nome, conteudo) => zip.file(nome, conteudo, { createFolders: false });
  const pastaPlanilha = "xl/worksheets/sheet1.xml";
  const arqPlanilha = zip.file(pastaPlanilha);
  const arqTipos = zip.file("[Content_Types].xml");
  if (!arqPlanilha || !arqTipos) return false;
  if (zip.file("xl/worksheets/_rels/sheet1.xml.rels")) return false; // ja tem relacionamentos: nao mexe

  const planilha = await arqPlanilha.async("string");
  if (!planilha.endsWith("</worksheet>") || planilha.includes("<drawing ") || !planilha.includes("xmlns:r=")) return false;
  adicionar(pastaPlanilha, planilha.slice(0, -"</worksheet>".length) + '<drawing r:id="rId1"/></worksheet>');

  adicionar("xl/worksheets/_rels/sheet1.xml.rels", rels("rId1", "drawing", "../drawings/drawing1.xml"));
  adicionar("xl/drawings/drawing1.xml", xmlDesenho());
  adicionar("xl/drawings/_rels/drawing1.xml.rels", rels("rId1", "image", "../media/logo1.jpeg"));
  adicionar("xl/media/logo1.jpeg", await fs.promises.readFile(LOGO));

  let tipos = await arqTipos.async("string");
  if (!/Extension="jpeg"/i.test(tipos)) tipos = tipos.replace("<Override ", '<Default Extension="jpeg" ContentType="image/jpeg"/><Override ');
  tipos = tipos.replace(
    "</Types>",
    '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>',
  );
  adicionar("[Content_Types].xml", tipos);

  const novo = caminho + ".logo";
  await fs.promises.writeFile(novo, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } }));
  await fs.promises.rename(novo, caminho);
  return true;
}

module.exports = {
  FAIXA_LINHAS,
  LINHA_CABECALHO,
  COR_FAIXA,
  temLogo,
  aplicarFaixa,
  adicionarLogo,
  injetarLogoNoArquivo,
};
