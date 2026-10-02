"use strict";

/* ROUTE eventos */
var db = require("../../infra/database");

var express = require("express");

var router = express.Router();

var _require = require("../../middleware/autenticartoken"),
    autenticarToken = _require.autenticarToken;

var empresaSrv = require("../../service/empresaService");

var usuarioSrv = require("../../service/usuarioService");

var eventoService = require('../../service/eventoService');

var eventoSrv = require("../../service/complementar/eventoService");

var response = require("../../util/respostaPadrao");

var funcoes = require("../../email/funcoes");

var path = require('path');

var fs = require('fs');

var _require2 = require('../../excel/eventorelatorio01.js'),
    gerarRelatorioParticipantes = _require2.gerarRelatorioParticipantes;

router.use(autenticarToken);
/* ROTA UPDATE evento */

router.put("/updateStatusEvento", function _callee(req, res) {
  var evento, registro;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          evento = req.body;
          _context.next = 4;
          return regeneratorRuntime.awrap(eventoSrv.updateStatusEvento(evento));

        case 4:
          registro = _context.sent;

          if (registro == null) {
            res.status(409).json({
              message: "Situação Alterada Com Sucesso!"
            });
          } else {
            res.status(200).json(registro);
          }

          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);

          if (_context.t0.name == "MyExceptionDB") {
            res.status(409).json(_context.t0);
          } else {
            res.status(500).json({
              erro: "BAK-END",
              tabela: "Evento",
              message: _context.t0.message
            });
          }

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post("/excelEvento", function _callee2(req, res) {
  var dados, camposObrigatorios, camposAusentes, id_empresa, id_usuario, id_evento, tipo, empresa, usuario, evento, rows, caminhoArquivo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dados = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_evento: req.body.id_evento,
            tipo: req.body.tipo
          };
          camposObrigatorios = ["id_empresa", "id_usuario", "id_evento", "tipo"];
          camposAusentes = camposObrigatorios.filter(function (campo) {
            return !dados[campo];
          });

          if (!(camposAusentes.length > 0)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", response.validationError(res, camposAusentes));

        case 6:
          id_empresa = dados.id_empresa, id_usuario = dados.id_usuario, id_evento = dados.id_evento, tipo = dados.tipo;
          _context2.next = 9;
          return regeneratorRuntime.awrap(empresaSrv.getEmpresa(id_empresa));

        case 9:
          empresa = _context2.sent;

          if (empresa) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", response.notFound(res, "Empresa", {
            id_empresa: id_empresa
          }));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(usuarioSrv.getUsuario(id_empresa, id_usuario));

        case 14:
          usuario = _context2.sent;

          if (usuario) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.notFound(res, "Usuario", {
            id_usuario: id_usuario
          }));

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(eventoService.getEvento(id_empresa, id_evento));

        case 19:
          evento = _context2.sent;

          if (evento) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.notFound(res, "Evento", {
            id_evento: id_evento
          }));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(eventoSrv.consultaEvento01(evento));

        case 24:
          rows = _context2.sent;

          if (rows) {
            _context2.next = 27;
            break;
          }

          return _context2.abrupt("return", res.status(409).json({
            message: "Não há dados para o relatório"
          }));

        case 27:
          caminhoArquivo = path.join(__dirname, '..', '..', 'planilhas', 'relatorio_evento.xlsx');
          _context2.next = 30;
          return regeneratorRuntime.awrap(gerarRelatorioParticipantes(rows, caminhoArquivo));

        case 30:
          if (!(tipo == 1)) {
            _context2.next = 34;
            break;
          }

          // Resposta imediata
          res.status(200).json({
            message: "O e-mail está sendo enviado..."
          }); // Processo em background

          funcoes.preparaEmailRelatorioEvento(usuario, evento, caminhoArquivo).then(function () {
            return console.log("E-mail enviado com sucesso");
          })["catch"](function (err) {
            return console.error("Erro ao enviar e-mail:", err);
          })["finally"](function () {
            fs.unlink(caminhoArquivo, function (erro) {
              if (erro) console.error("Erro ao excluir arquivo:", erro);else console.log("Arquivo excluído:", caminhoArquivo);
            });
          });
          return _context2.abrupt("return");

        case 34:
          if (!(tipo == 2)) {
            _context2.next = 37;
            break;
          }

          res.download(caminhoArquivo, "relatorio_evento.xlsx", function (err) {
            if (err) {
              console.error("Erro ao enviar arquivo:", err);
            } // Apaga o arquivo após o download


            fs.unlink(caminhoArquivo, function (erro) {
              if (erro) console.error("Erro ao excluir arquivo:", erro);else console.log("Arquivo excluído:", caminhoArquivo);
            });
          });
          return _context2.abrupt("return");

        case 37:
          _context2.next = 43;
          break;

        case 39:
          _context2.prev = 39;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

          if (_context2.t0.name == "MyExceptionDB") {
            res.status(409).json(_context2.t0);
          } else {
            res.status(500).json({
              erro: "BACK-END",
              tabela: "Importacao",
              message: _context2.t0.message
            });
          }

        case 43:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 39]]);
});
router.post("/resumocategoria", function _callee3(req, res) {
  var dados, camposObrigatorios, camposAusentes, id_empresa, id_usuario, id_evento, empresa, usuario, evento, lsRegistros;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dados = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_evento: req.body.id_evento
          };
          camposObrigatorios = ["id_empresa", "id_usuario", "id_evento"];
          camposAusentes = camposObrigatorios.filter(function (campo) {
            return !dados[campo];
          });

          if (!(camposAusentes.length > 0)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", response.validationError(res, camposAusentes));

        case 6:
          id_empresa = dados.id_empresa, id_usuario = dados.id_usuario, id_evento = dados.id_evento;
          _context3.next = 9;
          return regeneratorRuntime.awrap(empresaSrv.getEmpresa(id_empresa));

        case 9:
          empresa = _context3.sent;

          if (empresa) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", response.notFound(res, "Empresa", {
            id_empresa: id_empresa
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(usuarioSrv.getUsuario(id_empresa, id_usuario));

        case 14:
          usuario = _context3.sent;

          if (usuario) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", response.notFound(res, "Usuario", {
            id_usuario: id_usuario
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(eventoService.getEvento(id_empresa, id_evento));

        case 19:
          evento = _context3.sent;

          if (evento) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("return", response.notFound(res, "Evento", {
            id_evento: id_evento
          }));

        case 22:
          _context3.next = 24;
          return regeneratorRuntime.awrap(eventoSrv.resumoCategoria(id_empresa, id_evento));

        case 24:
          lsRegistros = _context3.sent;

          if (lsRegistros.length == 0) {
            res.status(409).json({
              message: "Evento Nenhum Registro Encontrado!"
            });
          } else {
            res.status(200).json(lsRegistros);
          }

          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

          if (_context3.t0.name == "MyExceptionDB") {
            res.status(409).json(_context3.t0);
          } else {
            res.status(500).json({
              erro: "BACK-END",
              tabela: "Importacao",
              message: _context3.t0.message
            });
          }

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
router.post("/resumooperador", function _callee4(req, res) {
  var dados, camposObrigatorios, camposAusentes, id_empresa, id_usuario, id_evento, empresa, usuario, evento, lsRegistros;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dados = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_evento: req.body.id_evento
          };
          camposObrigatorios = ["id_empresa", "id_usuario", "id_evento"];
          camposAusentes = camposObrigatorios.filter(function (campo) {
            return !dados[campo];
          });

          if (!(camposAusentes.length > 0)) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", response.validationError(res, camposAusentes));

        case 6:
          id_empresa = dados.id_empresa, id_usuario = dados.id_usuario, id_evento = dados.id_evento;
          _context4.next = 9;
          return regeneratorRuntime.awrap(empresaSrv.getEmpresa(id_empresa));

        case 9:
          empresa = _context4.sent;

          if (empresa) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", response.notFound(res, "Empresa", {
            id_empresa: id_empresa
          }));

        case 12:
          _context4.next = 14;
          return regeneratorRuntime.awrap(usuarioSrv.getUsuario(id_empresa, id_usuario));

        case 14:
          usuario = _context4.sent;

          if (usuario) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", response.notFound(res, "Usuario", {
            id_usuario: id_usuario
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(eventoService.getEvento(id_empresa, id_evento));

        case 19:
          evento = _context4.sent;

          if (evento) {
            _context4.next = 22;
            break;
          }

          return _context4.abrupt("return", response.notFound(res, "Evento", {
            id_evento: id_evento
          }));

        case 22:
          _context4.next = 24;
          return regeneratorRuntime.awrap(eventoSrv.resumoOperador(id_empresa, id_evento));

        case 24:
          lsRegistros = _context4.sent;

          if (lsRegistros.length == 0) {
            res.status(409).json({
              message: "Evento Nenhum Registro Encontrado!"
            });
          } else {
            res.status(200).json(lsRegistros);
          }

          _context4.next = 32;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

          if (_context4.t0.name == "MyExceptionDB") {
            res.status(409).json(_context4.t0);
          } else {
            res.status(500).json({
              erro: "BACK-END",
              tabela: "Importacao",
              message: _context4.t0.message
            });
          }

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
router.post("/resumokit", function _callee5(req, res) {
  var dados, camposObrigatorios, camposAusentes, id_empresa, id_usuario, id_evento, empresa, usuario, evento, lsRegistros;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dados = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_evento: req.body.id_evento
          };
          camposObrigatorios = ["id_empresa", "id_usuario", "id_evento"];
          camposAusentes = camposObrigatorios.filter(function (campo) {
            return !dados[campo];
          });

          if (!(camposAusentes.length > 0)) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", response.validationError(res, camposAusentes));

        case 6:
          id_empresa = dados.id_empresa, id_usuario = dados.id_usuario, id_evento = dados.id_evento;
          _context5.next = 9;
          return regeneratorRuntime.awrap(empresaSrv.getEmpresa(id_empresa));

        case 9:
          empresa = _context5.sent;

          if (empresa) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", response.notFound(res, "Empresa", {
            id_empresa: id_empresa
          }));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(usuarioSrv.getUsuario(id_empresa, id_usuario));

        case 14:
          usuario = _context5.sent;

          if (usuario) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", response.notFound(res, "Usuario", {
            id_usuario: id_usuario
          }));

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(eventoService.getEvento(id_empresa, id_evento));

        case 19:
          evento = _context5.sent;

          if (evento) {
            _context5.next = 22;
            break;
          }

          return _context5.abrupt("return", response.notFound(res, "Evento", {
            id_evento: id_evento
          }));

        case 22:
          _context5.next = 24;
          return regeneratorRuntime.awrap(eventoSrv.resumoKit(id_empresa, id_evento));

        case 24:
          lsRegistros = _context5.sent;

          if (lsRegistros.length == 0) {
            res.status(409).json({
              message: "Evento Nenhum Registro Encontrado!"
            });
          } else {
            res.status(200).json(lsRegistros);
          }

          _context5.next = 32;
          break;

        case 28:
          _context5.prev = 28;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

          if (_context5.t0.name == "MyExceptionDB") {
            res.status(409).json(_context5.t0);
          } else {
            res.status(500).json({
              erro: "BACK-END",
              tabela: "Importacao",
              message: _context5.t0.message
            });
          }

        case 32:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
module.exports = router;