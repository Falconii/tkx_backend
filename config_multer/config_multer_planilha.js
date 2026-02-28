const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "planilhas/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const uploadPlanilha = multer({ storage });

module.exports = uploadPlanilha;
