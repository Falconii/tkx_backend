"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var cabPlanilhaSrv = require("../service/cabplanilhaService.js");

var inscritoComplementarSrv = require("../service/complementar/inscritoService.js");

var inscritoSrv = require("../service/inscritoService.js");

function adicionaZero(numero) {
  if (numero <= 9) return "0" + numero;else return "" + numero;
}

exports.formatDate = function (date) {
  if (date == null) {
    return null;
  }

  if (typeof date === "string") {
    if (date.length > 10) date = date.substring(0, 10);
    return date;
  } else {
    data = new Date(date);
    return data.toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    });
  }
};

exports.formatDateYYYYMMDD = function (date) {
  if (date == null) {
    return null;
  }

  if (typeof date === "string") {
    if (date.trim().length == 0) {
      return "null";
    }

    if (date.length > 10) date = date.substring(0, 10);
    date = date.split("/");
    return [date[2], date[1], date[0]].join("-");
  } else {
    return date.yyyymmdd();
  }
};

exports.IfNUllNoAspas = function (date) {
  if (date == "null") return "null";
  return "'".concat(date, "'");
};

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based

  var dd = this.getDate();
  return [this.getFullYear(), (mm > 9 ? "" : "0") + mm, (dd > 9 ? "" : "0") + dd].join("-");
};

Date.prototype.ddmmyyyy = function () {
  var dd = String(this.getDate()).padStart(2, '0');
  var mm = String(this.getMonth() + 1).padStart(2, '0');
  var yyyy = this.getFullYear();
  return "".concat(dd, "/").concat(mm, "/").concat(yyyy);
};

exports.formatDateHour = function (date) {
  return date;
};

exports.excluirCaracteres = function (value) {
  var searchRegExp = /'/g;
  var retorno = value.replace(searchRegExp, "''");
  retorno = retorno.replace(/\r?\n|\r/g, " ");
  return retorno;
};

exports.excluirVirgulasePontos = function (value) {
  var retorno = "";

  if (typeof value == "string") {
    if (value.length == 0) return "0";

    for (x = value.length - 1; x >= 0; x--) {
      if (value[x] == "," || value[x] == ".") {
        if (value[x] == ",") retorno = "." + retorno;
        if (value[x] == ".") retorno = "" + retorno;
      } else {
        retorno = value[x] + retorno;
      }
    }
  } else {
    retorno = "0";
  }

  return retorno;
};

exports.semAcento = function (value) {
  var semAcento = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return semAcento;
};

exports.verifyToken = function _callee(token, ACCESS_SECRET) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            jwt.verify(token, ACCESS_SECRET, function (err, payload) {
              console.log("Verificando token: ", payload);

              if (err) {
                if (err.name === "TokenExpiredError") {
                  resolve({
                    status: 401,
                    mensagem: "Token expirado",
                    id_empresa: 0,
                    id_usuario: 0
                  });
                } else if (err.name === "JsonWebTokenError") {
                  resolve({
                    status: 403,
                    mensagem: "Token inválido",
                    id_empresa: 0,
                    id_usuario: 0
                  });
                } else {
                  resolve({
                    status: 403,
                    mensagem: "Token inv\xE1lido ".concat(err.message),
                    id_empresa: 0,
                    id_usuario: 0
                  });
                }
              } else {
                resolve({
                  status: 200,
                  mensagem: "Token OK",
                  id_empresa: payload.id_empresa,
                  id_usuario: payload.id_usuario
                });
              }
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.limparCnpj_Cpf = function limparDocumento(valor) {
  return valor.replace(/\D/g, "");
};

exports.verfica_planilha = function _callee2(id_empresa, id_evento, fileName) {
  var par, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          par = {
            id_empresa: id_empresa,
            id_evento: id_evento,
            id: 0,
            arquivo: fileName,
            status: '',
            pagina: 0,
            tamPagina: 50,
            contador: "N",
            orderby: "",
            sharp: false
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.getCabplanilhas(par));

        case 3:
          result = _context2.sent;

          if (!(result != null && result.length > 0)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", {
            existe: true
          });

        case 8:
          return _context2.abrupt("return", {
            existe: false
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.isValidDate = function (dateString) {
  var _dateString$split$map = dateString.split("/").map(Number),
      _dateString$split$map2 = _slicedToArray(_dateString$split$map, 3),
      day = _dateString$split$map2[0],
      month = _dateString$split$map2[1],
      year = _dateString$split$map2[2];

  var date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

exports._incluirInscrito = function _incluirInscrito(inscrito) {
  var retornoInscrito, result, inscritoModel;
  return regeneratorRuntime.async(function _incluirInscrito$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          retornoInscrito = null;

          if (!(inscrito == null)) {
            _context3.next = 3;
            break;
          }

          throw new Error("Inscrito não pode ser nulo");

        case 3:
          if (!(inscrito.cnpj_cpf == null || inscrito.cnpj_cpf === "")) {
            _context3.next = 5;
            break;
          }

          throw new Error("CNPJ/CPF do inscrito não pode ser vazio");

        case 5:
          if (!(inscrito.nome == null || inscrito.nome === "")) {
            _context3.next = 7;
            break;
          }

          throw new Error("Nome do inscrito não pode ser vazio");

        case 7:
          _context3.prev = 7;
          _context3.next = 10;
          return regeneratorRuntime.awrap(inscritoComplementarSrv.getInscritoByCpf(inscrito.id_empresa, inscrito.cnpj_cpf));

        case 10:
          result = _context3.sent;

          if (!(result == null || result.length == 0)) {
            _context3.next = 22;
            break;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(inscritoSrv.insertInscrito(inscrito));

        case 14:
          inscritoModel = _context3.sent;

          if (!(inscritoModel == null)) {
            _context3.next = 19;
            break;
          }

          throw new Error("Erro ao inserir inscrito ");

        case 19:
          retornoInscrito = inscritoModel;

        case 20:
          _context3.next = 23;
          break;

        case 22:
          retornoInscrito = result[0];

        case 23:
          _context3.next = 28;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](7);
          throw new Error("Inscrito: ".concat(_context3.t0.message));

        case 28:
          return _context3.abrupt("return", retornoInscrito);

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 25]]);
};

exports._incluirParticipante = function _callee3(participante) {
  var retornoParticipante, result, participanteModel;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          retornoParticipante = null;

          if (!(participante == null)) {
            _context4.next = 3;
            break;
          }

          throw new Error("participante não pode ser nulo");

        case 3:
          if (!(participante.id_empresa == null || participante.id_empresa === 0)) {
            _context4.next = 5;
            break;
          }

          throw new Error("ID Empresa não pode ser vazio");

        case 5:
          if (!(participante.id_evento == null || participante.id_evento === 0)) {
            _context4.next = 7;
            break;
          }

          throw new Error("ID Evento não pode ser vazio");

        case 7:
          if (!(participante.id_inscrito == null || participante.id_inscrito === 0)) {
            _context4.next = 9;
            break;
          }

          throw new Error("ID Inscrito não pode ser vazio");

        case 9:
          _context4.prev = 9;
          _context4.next = 12;
          return regeneratorRuntime.awrap(participanteSrv.getParticipante(participante.id_empresa, participante.id_evento, participante.id_inscrito));

        case 12:
          result = _context4.sent;

          if (!(result == null)) {
            _context4.next = 25;
            break;
          }

          _context4.next = 16;
          return regeneratorRuntime.awrap(participanteSrv.insertParticipante(participante));

        case 16:
          participanteModel = _context4.sent;
          retornoParticipante = participanteModel;

          if (!(participanteModel == null)) {
            _context4.next = 22;
            break;
          }

          throw new Error("Erro ao inserir participante");

        case 22:
          retornoParticipante = participanteModel;

        case 23:
          _context4.next = 26;
          break;

        case 25:
          retornoParticipante = result;

        case 26:
          _context4.next = 31;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](9);
          throw new Error("Erro ao inserir participante" + _context4.t0.message);

        case 31:
          return _context4.abrupt("return", retornoParticipante);

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[9, 28]]);
};

exports.verifyToken = function _callee4(token, ACCESS_SECRET) {
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", new Promise(function (resolve) {
            jwt.verify(token, ACCESS_SECRET, function (err, payload) {
              console.log("Verificando token: ", payload);

              if (err) {
                if (err.name === "TokenExpiredError") {
                  resolve({
                    status: 401,
                    mensagem: "Token expirado",
                    id_empresa: 0,
                    id_usuario: 0
                  });
                } else if (err.name === "JsonWebTokenError") {
                  resolve({
                    status: 403,
                    mensagem: "Token inválido",
                    id_empresa: 0,
                    id_usuario: 0
                  });
                } else {
                  resolve({
                    status: 403,
                    mensagem: "Token inv\xE1lido ".concat(err.message),
                    id_empresa: 0,
                    id_usuario: 0
                  });
                }
              } else {
                resolve({
                  status: 200,
                  mensagem: "Token OK",
                  id_empresa: payload.id_empresa,
                  id_usuario: payload.id_usuario
                });
              }
            });
          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.isValidCnpjCpf = function (doc) {
  var apenasNumeros = doc.replace(/\D/g, "");

  if (apenasNumeros.length === 11) {
    return validarCPF(apenasNumeros);
  } else if (apenasNumeros.length === 14) {
    return validarCNPJ(apenasNumeros);
  }

  return false;
};

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // Primeiro dígito

  var soma = 0;

  for (var i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }

  var resto = soma % 11;
  var digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== parseInt(cpf[9])) return false; // Segundo dígito

  soma = 0;

  for (var _i2 = 0; _i2 < 10; _i2++) {
    soma += parseInt(cpf[_i2]) * (11 - _i2);
  }

  resto = soma % 11;
  var digito2 = resto < 2 ? 0 : 11 - resto;
  return digito2 === parseInt(cpf[10]);
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  var pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  var pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; // Primeiro dígito

  var soma = 0;

  for (var i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * pesos1[i];
  }

  var resto = soma % 11;
  var digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== parseInt(cnpj[12])) return false; // Segundo dígito

  soma = 0;

  for (var _i3 = 0; _i3 < 13; _i3++) {
    soma += parseInt(cnpj[_i3]) * pesos2[_i3];
  }

  resto = soma % 11;
  var digito2 = resto < 2 ? 0 : 11 - resto;
  return digito2 === parseInt(cnpj[13]);
}