/* ROUTE eventos */
const db = require("../../infra/database");
const express = require("express");
const router = express.Router();
const { autenticarToken } = require("../../middleware/autenticartoken");
const empresaSrv = require("../../service/empresaService");
const usuarioSrv = require("../../service/usuarioService");
const eventoService = require('../../service/eventoService');
const eventoSrv = require("../../service/complementar/eventoService");
const response = require("../../util/respostaPadrao");
const funcoes = require("../../email/funcoes");
const path = require('path');
const fs = require('fs');
const { gerarRelatorioParticipantes } = require('../../excel/eventorelatorio01.js');

router.use(autenticarToken);
/* ROTA UPDATE evento */

router.put("/updateStatusEvento", async function (req, res) {
  try {
    const evento = req.body;
    const registro = await eventoSrv.updateStatusEvento(evento);
    if (registro == null) {
      res.status(409).json({ message: "Situação Alterada Com Sucesso!" });
    } else {
      res.status(200).json(registro);
    }
  } catch (err) {
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res
        .status(500)
        .json({ erro: "BAK-END", tabela: "Evento", message: err.message });
    }
  }
});

router.post("/excelEvento", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      id_evento: req.body.id_evento,
      tipo: req.body.tipo
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "id_evento", "tipo"];
    const camposAusentes = camposObrigatorios.filter((campo) => !dados[campo]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const { id_empresa, id_usuario, id_evento, tipo } = dados;

    const empresa = await empresaSrv.getEmpresa(id_empresa);
    if (!empresa) return response.notFound(res, "Empresa", { id_empresa });

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);
    if (!usuario) return response.notFound(res, "Usuario", { id_usuario });

    const evento = await eventoService.getEvento(id_empresa, id_evento);
    if (!evento) return response.notFound(res, "Evento", { id_evento });

    const rows = await eventoSrv.consultaEvento01(evento);
    if (!rows) {
      return res.status(409).json({ message: "Não há dados para o relatório" });
    }

    const caminhoArquivo = path.join(__dirname, '..', '..', 'planilhas', 'relatorio_evento.xlsx');

    await gerarRelatorioParticipantes(rows, caminhoArquivo);

    // ---------------------------
    // TIPO 1 → E-MAIL
    // ---------------------------
    if (tipo == 1) {

      // Resposta imediata
      res.status(200).json({ message: "O e-mail está sendo enviado..." });

      // Processo em background
      funcoes.preparaEmailRelatorioEvento(usuario, evento, caminhoArquivo)
        .then(() => console.log("E-mail enviado com sucesso"))
        .catch((err) => console.error("Erro ao enviar e-mail:", err))
        .finally(() => {
          fs.unlink(caminhoArquivo, (erro) => {
            if (erro) console.error("Erro ao excluir arquivo:", erro);
            else console.log("Arquivo excluído:", caminhoArquivo);
          });
        });

      return; // impede segunda resposta
    }

    // ---------------------------
    // TIPO 2 → DOWNLOAD
    // ---------------------------
    if (tipo == 2) {

      res.download(caminhoArquivo, "relatorio_evento.xlsx", (err) => {

        if (err) {
          console.error("Erro ao enviar arquivo:", err);
        }

        // Apaga o arquivo após o download
        fs.unlink(caminhoArquivo, (erro) => {
          if (erro) console.error("Erro ao excluir arquivo:", erro);
          else console.log("Arquivo excluído:", caminhoArquivo);
        });
      });

      return; // impede segunda resposta
    }

  } catch (err) {
    console.log(err);
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BACK-END",
        tabela: "Importacao",
        message: err.message,
      });
    }
  }
});


router.post("/resumocategoria", async function (req, res) {
  try {
    const dados = {
      id_empresa: req.id_empresa,
      id_usuario: req.id_usuario,
      id_evento: req.body.id_evento,
    };

    const camposObrigatorios = ["id_empresa", "id_usuario", "id_evento"];
    const camposAusentes = camposObrigatorios.filter((campo) => !dados[campo]);

    if (camposAusentes.length > 0) {
      return response.validationError(res, camposAusentes);
    }

    const { id_empresa, id_usuario, id_evento} = dados;

    const empresa = await empresaSrv.getEmpresa(id_empresa);
    if (!empresa) return response.notFound(res, "Empresa", { id_empresa });

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);
    if (!usuario) return response.notFound(res, "Usuario", { id_usuario });

    const evento = await eventoService.getEvento(id_empresa, id_evento);
    if (!evento) return response.notFound(res, "Evento", { id_evento });

    const lsRegistros = await eventoSrv.resumoCategoria(evento);

    if (lsRegistros.length == 0) {
      res.status(409).json({ message: "Evento Nenhum Registro Encontrado!" });
    } else {
      res.status(200).json(lsRegistros);
    }

  } catch (err) {
    console.log(err);
    if (err.name == "MyExceptionDB") {
      res.status(409).json(err);
    } else {
      res.status(500).json({
        erro: "BACK-END",
        tabela: "Importacao",
        message: err.message,
      });
    }
  }
});


module.exports = router;

