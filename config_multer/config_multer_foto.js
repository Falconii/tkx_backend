const multer = require("multer");

// Armazenamento em memória
const storage = multer.memoryStorage();

// Limite de tamanho: 800KB
const uploadFoto = multer({
  storage,
  limits: { fileSize: 800 * 1024 }, // 800KB
});

module.exports = uploadFoto;
