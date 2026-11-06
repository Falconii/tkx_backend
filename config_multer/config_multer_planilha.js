const multer = require("multer");

/*
  Planilha de participantes (CSV): fica em MEMORIA e e lida direto do buffer.
  Nada e gravado em disco (antes o arquivo era salvo em planilhas/ com o nome original, sobrescrevendo
  o anterior de mesmo nome e nunca sendo apagado).
*/
const LIMITE_BYTES = 10 * 1024 * 1024; // 10 MB (uma planilha de ~10 mil linhas tem cerca de 1 MB)

const uploadPlanilha = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITE_BYTES, files: 1 },
});

module.exports = uploadPlanilha;
module.exports.LIMITE_BYTES = LIMITE_BYTES;
