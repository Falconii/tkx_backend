"use strict";

/* SERVICE eventos */
var eventoData = require("../../data/complementar/eventoData");

var validacao = require("../../util/validacao");

var parametros = require("../../util/eventoParametros");

var erroDB = require("../../util/userfunctiondb");

var regras = require("../../util/eventoRegra");

var TABELA = "EVENTOS";
/* CRUD GET SERVICE */
//* CRUD - UPDATE - SERVICE */

exports.updateStatusEvento = function _callee(evento) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(regras.evento_Alteracao(evento));

        case 3:
          validacao.Validacao(TABELA, evento, parametros.eventos());
          return _context.abrupt("return", eventoData.updateStatusEvento(evento));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw new erroDB.UserException(_context.t0.erro, _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.consultaEvento01 = function _callee2(evento) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          return _context2.abrupt("return", eventoData.consultaEvento01(evento));

        case 4:
          _context2.prev = 4;
          _context2.t0 = _context2["catch"](0);
          throw new erroDB.UserException(_context2.t0.erro, _context2.t0);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

exports.resumoCategoria = function _callee3(id_empresa, id_evento) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          return _context3.abrupt("return", eventoData.resumoCategoria(id_empresa, id_evento));

        case 4:
          _context3.prev = 4;
          _context3.t0 = _context3["catch"](0);
          throw new erroDB.UserException(_context3.t0.erro, _context3.t0);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

exports.resumoOperador = function _callee4(id_empresa, id_evento) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          return _context4.abrupt("return", eventoData.resumoOperador(id_empresa, id_evento));

        case 4:
          _context4.prev = 4;
          _context4.t0 = _context4["catch"](0);
          throw new erroDB.UserException(_context4.t0.erro, _context4.t0);

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

exports.resumoKit = function _callee5(id_empresa, id_evento) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          return _context5.abrupt("return", eventoData.resumoKit(id_empresa, id_evento));

        case 4:
          _context5.prev = 4;
          _context5.t0 = _context5["catch"](0);
          throw new erroDB.UserException(_context5.t0.erro, _context5.t0);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 4]]);
};