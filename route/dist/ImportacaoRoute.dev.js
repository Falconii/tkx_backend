"use strict";

/* ROUTE participantes */
var db = require("../infra/database");

var express = require("express");

var router = express.Router();

var cabPlanilhaSrv = require("../service/cabplanilhaService.js");

var detPlanilhaSrv = require("../service/detPlanilhaService.js");

var eventoSrv = require("../service/eventoService.js");

var uploadPlanilha = require("../config_multer/config_multer_planilha");

var uploadPlanilhaSrv = require("../service/uploadPlanilhaService.js");

var shared = require("../util/shared.js");

var _require = require("../middleware/autenticartoken"),
    autenticarToken = _require.autenticarToken;

var iconv = require('iconv-lite');

router.use(autenticarToken);
router.post("/loadplanilha", uploadPlanilha.single("file"), function _callee(req, res) {
  var parametros, file, existeEvento, existePlanilha, linhas_processadas;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          parametros = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_evento: req.body.id_evento
          };
          console.log("parametros", parametros);
          file = req.file;
          _context.next = 6;
          return regeneratorRuntime.awrap(eventoSrv.getEvento(parametros.id_empresa, parametros.id_evento));

        case 6:
          existeEvento = _context.sent;

          if (!(existeEvento == null)) {
            _context.next = 10;
            break;
          }

          res.status(401).json({
            message: "Evento N \xAA ".concat(parametros.id_evento, " N\xE3o Existe!")
          });
          return _context.abrupt("return");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(shared.verfica_planilha(parametros.id_empresa, parametros.id_evento, iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8')));

        case 12:
          existePlanilha = _context.sent;

          if (!existePlanilha.existe) {
            _context.next = 17;
            break;
          }

          res.status(401).json({
            message: "Planilha Já Cadastrada!"
          });
          _context.next = 21;
          break;

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(uploadPlanilhaSrv.inclusao(req, res));

        case 19:
          linhas_processadas = _context.sent;
          res.status(200).json({
            message: "Planilha Importada com Sucesso!",
            linhas_processadas: linhas_processadas
          });

        case 21:
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

          if (_context.t0.name == "MyExceptionDB") {
            res.status(409).json(_context.t0);
          } else {
            res.status(500).json({
              erro: "BAK-END",
              tabela: "Importacao",
              message: _context.t0.message
            });
          }

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.post("/processamentoV2", function _callee2(req, res) {
  var parametros, par, detalhes;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          parametros = {
            id_empresa: req.id_empresa,
            id_evento: req.body.id_evento,
            id_planilha: req.body.id_planilha,
            id_usuario: req.id_usuario
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(eventoSrv.getEvento(parametros.id_empresa, parametros.id_evento));

        case 4:
          evento = _context2.sent;

          if (!(evento == null)) {
            _context2.next = 8;
            break;
          }

          res.status(401).json({
            message: "Evento Não Existe!"
          });
          return _context2.abrupt("return");

        case 8:
          if (!(evento.status !== "1")) {
            _context2.next = 11;
            break;
          }

          res.status(401).json({
            message: "Evento Deverá Estar Inativo!"
          });
          return _context2.abrupt("return");

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.getCabplanilha(parametros.id_empresa, parametros.id_evento, parametros.id_planilha));

        case 13:
          cabec = _context2.sent;

          if (!(cabec == null)) {
            _context2.next = 17;
            break;
          }

          res.status(401).json({
            message: "Planilha Não Existe! Ou Não Associada A Este Evento!"
          });
          return _context2.abrupt("return");

        case 17:
          par = {
            id_empresa: parametros.id_empresa,
            id_evento: parametros.id_evento,
            id_cabec: parametros.id_planilha,
            cnpj_cpf: "",
            nome: "",
            inscricao: -1,
            nro_peito: -1,
            status: 0,
            pagina: 0,
            tamPagina: 50,
            contador: "N",
            orderby: "",
            sharp: false
          };
          _context2.next = 20;
          return regeneratorRuntime.awrap(detPlanilhaSrv.getDetplanilhas(par));

        case 20:
          detalhes = _context2.sent;

          if (!(detalhes.length == 0)) {
            _context2.next = 24;
            break;
          }

          res.status(401).json({
            message: "Planilha Não Contém Linhas Para Serem Processadas!"
          });
          return _context2.abrupt("return");

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(uploadPlanilhaSrv.processamentov2(req, cabec, detalhes));

        case 26:
          cabec = _context2.sent;
          evento.status = "2";
          evento.user_update = parametros.id_usuario;
          _context2.next = 31;
          return regeneratorRuntime.awrap(eventoSrv.updateEvento(evento));

        case 31:
          res.status(200).json({
            cabec: cabec,
            message: "Processamento da Planilha Finalizado!"
          });
          _context2.next = 38;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

          if (_context2.t0.name == "MyExceptionDB") {
            res.status(409).json(_context2.t0);
          } else {
            res.status(500).json({
              erro: "BAK-END",
              tabela: "Importacao",
              message: _context2.t0.message
            });
          }

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 34]]);
});
router.post("/checkplanilha", function _callee3(req, res) {
  var _req$body, id_evento, fileName, tentativa, maxTentativas, par, planilhas;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id_empresa = req.id_empresa;
          id_usuario = req.id_usuario;
          console.log("planilha req.body:", req.body);
          _req$body = req.body, id_evento = _req$body.id_evento, fileName = _req$body.fileName, tentativa = _req$body.tentativa, maxTentativas = _req$body.maxTentativas;

          if (fileName) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "fileName é obrigatório"
          }));

        case 6:
          if (!(Number(tentativa) > Number(maxTentativas))) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(200).json({
            status: "exceeded",
            message: "Limite de tentativas excedido"
          }));

        case 8:
          par = {
            id_empresa: id_empresa,
            id_evento: id_evento,
            id: 0,
            arquivo: fileName,
            status: '',
            pagina: 0,
            tamPagina: 50,
            contador: 'N',
            orderby: '',
            sharp: false
          };
          _context3.next = 11;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.getCabplanilhas(par));

        case 11:
          planilhas = _context3.sent;

          if (!(planilhas.length == 0)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            status: "failed",
            message: "Planilha Não Encontrada",
            total_linhas: 0,
            linhas_processadas: 0,
            total_linhas_erro: 0
          }));

        case 14:
          if (!(planilhas.status === '0')) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", res.status(200).json({
            status: "pending",
            message: "Planilha Ainda Não Disponível",
            total_linhas: 0,
            linhas_processadas: 0,
            total_linhas_erro: 0
          }));

        case 16:
          return _context3.abrupt("return", res.status(200).json({
            status: "ready",
            message: "Planilha Disponivel",
            total_linhas: planilhas[0].total_linhas,
            linhas_processadas: planilhas[0].linhas_processadas,
            total_linhas_erro: planilhas[0].total_linhas_erro
          }));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;