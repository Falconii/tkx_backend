const db = require("../infra/database");
const uploadFoto = require("../uploadConfig/uploadFoto");
const fotoUploadSrv = require("../service/uploadFotoService");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../middleware/autenticartoken");

router.use(autenticarToken);

router.post("/savefoto", uploadFoto.single("foto"), async function (req, res) {
  try {
    const { originalname, buffer } = req.file;

    await fotoUploadSrv.saveFoto(originalname, buffer);

    res.status(200).send("Imagem salva com sucesso!");
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "UPLOAD-Foto", message: err.message });
    }
  }
});

router.post("/foto", async function (req, res) {
  try {
    const id = req.body.id; // ID da foto a ser recuperada

    const result = await fotoUploadSrv.getFoto(id);

    if (result.length === 0) {
      return res.status(404).send("Imagem não encontrada");
    }

    const { nome, imagem } = result[0];

    // Define tipo de conteúdo baseado na extensão
    const ext = nome.split(".").pop().toLowerCase();
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.send(imagem);
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "GETFOTO-Foto",
        message: err.message,
      });
    }
  }
});

router.post(
  "/savefotoV2",
  uploadFoto.single("foto"),
  async function (req, res) {
    try {
      const { originalname, buffer } = req.file;
      const id_evento = req.body.id_evento;
      const id_empresa = req.id_empresa;
      const id_usuario = req.id_usuario;

      console.log("ID EMPRESA: ", id_empresa);
      console.log("ID USUARIO: ", id_usuario);
      console.log("ID EVENTO: ", id_evento);

      await fotoUploadSrv.saveFotoV2(
        id_empresa,
        id_evento,
        originalname,
        buffer,
        id_usuario,
      );

      res.status(200).send("Imagem salva com sucesso!");
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res.status(500).json({
          erro: "BAK-END",
          tabela: "UPLOAD-Foto",
          message: err.message,
        });
      }
    }
  },
);

router.post("/fotoV2", async function (req, res) {
  try {
    const id = req.body.id;
    const id_evento = req.body.id_evento;
    const id_empresa = req.id_empresa;
    const id_usuario = req.id_usuario;

    console.log("ID EMPRESA: ", id_empresa);
    console.log("ID USUARIO: ", id_usuario);
    console.log("ID EVENTO: ", id_evento);
    console.log("ID FOTO: ", id);

    const result = await fotoUploadSrv.getFotoV2(id_empresa, id_evento, id);

    if (result.length === 0) {
      return res.status(404).send("Imagem não encontrada");
    }

    const { file_name, imagem } = result[0];

    // Define tipo de conteúdo baseado na extensão
    const ext = file_name.split(".").pop().toLowerCase();
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.send(imagem);
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "GETFOTO-Foto",
        message: err.message,
      });
    }
  }
});

router.post("/fotoV2", uploadFoto.single("foto"), async function (req, res) {
  try {
    const id = req.body.id; // ID da foto a ser recuperada

    const result = await fotoUploadSrv.getFoto(id);

    if (result.length === 0) {
      return res.status(404).send("Imagem não encontrada");
    }

    const { nome, imagem } = result[0];

    // Define tipo de conteúdo baseado na extensão
    const ext = nome.split(".").pop().toLowerCase();
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.send(imagem);
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BAK-END",
        tabela: "GETFOTO-Foto",
        message: err.message,
      });
    }
  }
});

router.delete(
  "/deletefoto/:id_empresa/:id_evento/:id",
  async function (req, res) {
    try {
      await fotoUploadSrv.deleteFoto(
        req.params.id_empresa,
        req.params.id_evento,
        req.params.id,
      );
      res.status(200).json({ message: "Foto Excluída Com Sucesso!" });
    } catch (err) {
      if (err.name == "MyExceptionDB") {
        res.status(409).json(err);
      } else {
        res
          .status(500)
          .json({ erro: "BAK-END", tabela: "Link", message: err.message });
      }
    }
  },
);

module.exports = router;
