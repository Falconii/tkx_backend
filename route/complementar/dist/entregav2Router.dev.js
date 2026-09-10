"use strict";

/* ROUTE entregasv2 */
var db = require('../../infra/database');

var express = require('express');

var router = express.Router();

var _require = require('../../middleware/autenticartoken'),
    autenticarToken = _require.autenticarToken;

var entregav2Srv = require('../../service/entregav2Service');

var participanteV2Srv = require('../../service/participantev2Service');

router.use(autenticarToken);
/* ROTA INSERT entregav2 com participante */

router.post("/insertentregaparticipante", function _callee(req, res) {
  var novaEntrega, parametros, participante, entrega, registro, _registro, novoParticipante;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          novaEntrega = null;
          parametros = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_participante: req.body.id_participante,
            entregav2: req.body.entregav2
          };
          console.log("parametros", parametros);
          _context.next = 6;
          return regeneratorRuntime.awrap(participanteV2Srv.getParticipantev2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.id_participante));

        case 6:
          participante = _context.sent;

          if (!(participante == null)) {
            _context.next = 10;
            break;
          }

          res.status(401).json({
            message: "Participante N \xAA ".concat(parametros.id_participante, " N\xE3o Existe!")
          });
          return _context.abrupt("return");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(entregav2Srv.getEntregav2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.entregav2.id));

        case 12:
          entrega = _context.sent;

          if (!(entrega == null)) {
            _context.next = 21;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(entregav2Srv.insertEntregav2(parametros.entregav2));

        case 16:
          novaEntrega = _context.sent;
          participante.id_entrega = novaEntrega.id;
          registro = participanteV2Srv.updateParticipantev2(participante);
          _context.next = 26;
          break;

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(entregav2Srv.updateEntregav2(parametros.entregav2));

        case 23:
          novaEntrega = _context.sent;
          participante.id_entrega = novaEntrega.id;
          _registro = participanteV2Srv.updateParticipantev2(participante);

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(participanteV2Srv.getParticipantev2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.id_participante));

        case 28:
          novoParticipante = _context.sent;
          res.status(200).json({
            Entregav2: novaEntrega,
            Participantev2: novoParticipante
          });
          _context.next = 35;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](0);

          if (_context.t0.name == 'MyExceptionDB') {
            res.status(409).json(_context.t0);
          } else {
            res.status(500).json({
              erro: 'BAK-END',
              tabela: 'Entregav2',
              message: _context.t0.message
            });
          }

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 32]]);
});
router["delete"]("/deleteentregaparticipante", function _callee2(req, res) {
  var novaEntrega, parametros, participante, novoParticipante;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          novaEntrega = null;
          parametros = {
            id_empresa: req.id_empresa,
            id_usuario: req.id_usuario,
            id_participante: req.body.id_participante,
            entregav2: req.body.entregav2
          };
          console.log("parametros", parametros);
          _context2.next = 6;
          return regeneratorRuntime.awrap(participanteV2Srv.getParticipantev2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.id_participante));

        case 6:
          participante = _context2.sent;

          if (!(participante == null)) {
            _context2.next = 10;
            break;
          }

          res.status(401).json({
            message: "Participante N \xAA ".concat(parametros.id_participante, " N\xE3o Existe!")
          });
          return _context2.abrupt("return");

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(entregav2Srv.deleteEntregav2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.entregav2.id));

        case 12:
          participante.id_entrega = 0;
          _context2.next = 15;
          return regeneratorRuntime.awrap(participanteV2Srv.updateParticipantev2(participante));

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap(participanteV2Srv.getParticipantev2(parametros.id_empresa, parametros.entregav2.id_evento, parametros.id_participante));

        case 17:
          novoParticipante = _context2.sent;
          res.status(200).json({
            Entregav2: null,
            Participantev2: novoParticipante
          });
          _context2.next = 24;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);

          if (_context2.t0.name == 'MyExceptionDB') {
            res.status(409).json(_context2.t0);
          } else {
            res.status(500).json({
              erro: 'BAK-END',
              tabela: 'Entregav2',
              message: _context2.t0.message
            });
          }

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
module.exports = router;