"use strict";

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

//const uploaddata = require("../data/uploadData");
var shared = require("../util/shared.js");

var parse = require("../util/ParseCSV");

var inscritoSrv = require("../service/inscritoService.js");

var inscritoComplementarSrv = require("../service/complementar/inscritoService.js");

var eventoSrv = require("../service/eventoService.js");

var participanteSrv = require("../service/participanteService.js");

var participantev2Srv = require("../service/participantev2Service.js");

var cabPlanilhaSrv = require("../service/cabplanilhaService.js");

var detPlanilhaSrv = require("../service/detPlanilhaService.js");

var categoriaSrv = require("../service/complementar/categoriaService.js");

var categoriacontadoresSrv = require("../service/categoriacontadorService.js");

var fs = require("fs");

var readline = require("readline");

var iconv = require('iconv-lite');

var id_empresa = 0;
var id_local = 0;
var id_evento = 0;
var complementarModel = {};
var inscritoModel = {};
var limite_Erros = 10;

exports.inclusao = function _callee(req, res) {
  var ct, nro_linha, result, total_linhas, linhas_processadas, total_linhas_erro, campos, erros_tam_invalido, file, cab, cabPlanilha, dadosPlanilha, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, linha, dadosComplementares, categoria, dadosInscrito;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id_empresa = req.id_empresa;
          id_evento = req.body.id_evento;
          id_usuario = req.id_usuario;
          console.log("inclusao id_evento", id_evento);
          ct = 0;
          nro_linha = 0;
          result = {
            message: "Processamento OK"
          };
          total_linhas = 0;
          linhas_processadas = 0;
          total_linhas_erro = 0;
          campos = "";
          erros_tam_invalido = 0;
          file = req.file;
          cab = {
            id_empresa: id_empresa,
            id_evento: id_evento,
            id: 0,
            arquivo: iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8'),
            total_linhas: 0,
            status: 9,
            linhas_processadas: 0,
            total_linhas_erro: 0,
            user_insert: id_usuario,
            user_update: 0
          };
          _context.next = 16;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.insertCabplanilha(cab));

        case 16:
          cabPlanilha = _context.sent;
          dadosPlanilha = readline.createInterface({
            input: fs.createReadStream(file.path)
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _context.prev = 20;
          _iterator = _asyncIterator(dadosPlanilha);

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(_iterator.next());

        case 24:
          _step = _context.sent;
          _iteratorNormalCompletion = _step.done;
          _context.next = 28;
          return regeneratorRuntime.awrap(_step.value);

        case 28:
          _value = _context.sent;

          if (_iteratorNormalCompletion) {
            _context.next = 85;
            break;
          }

          linha = _value;

          if (!(nro_linha == 0)) {
            _context.next = 34;
            break;
          }

          nro_linha++;
          return _context.abrupt("continue", 82);

        case 34:
          nro_linha++;
          parDetalhe = {
            id_empresa: id_empresa,
            id_evento: id_evento,
            id_cabec: cabPlanilha.id,
            cnpj_cpf: "",
            nome: "",
            estrangeiro: "",
            sexo: "",
            data_nasc: "",
            inscricao: "",
            nro_peito: 0,
            id_categoria: 1,
            id_inscrito: 0,
            status: 0,
            mensagem_erro: "",
            user_insert: id_usuario,
            user_update: 0
          };
          _context.prev = 36;
          campos = parse.ParseCVS("", linha, ";");
          _context.next = 43;
          break;

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](36);
          return _context.abrupt("continue", 82);

        case 43:
          if (!(campos.length < 6)) {
            _context.next = 52;
            break;
          }

          erros_tam_invalido++;
          console.log("Quantidade De Colunas Deferente Do Padr\xE3o (6)! Linha:Linha: ".concat(nro_linha, " Campos: ").concat(campos.length, "}"));

          if (!(erros_tam_invalido > limite_Erros)) {
            _context.next = 51;
            break;
          }

          console.log("Quantidade De Colunas Deferente Do Padr\xE3o (6)! Linha:Linha: ".concat(nro_linha, " Campos: ").concat(campos.length, "} - Limite De Erros Excedido! Interrompendo Processamento!"));
          return _context.abrupt("break", 85);

        case 51:
          return _context.abrupt("continue", 82);

        case 52:
          if (nro_linha % 100 === 0) {
            console.log("Processando Linha: ".concat(nro_linha, " "));
          } //console.log("campos:",campos);


          try {
            dadosComplementares = dados_complementares(campos);
            complementarModel = dadosComplementares;

            if (complementarModel.mensagem_erro !== "") {
              parDetalhe.mensagem_erro = complementarModel.mensagem_erro;
              parDetalhe.status = 9;
            }
          } catch (err) {
            complementarModel = {
              inscricao: 0,
              nro_peito: 0,
              sigla_categoria: ""
            };
            parDetalhe.mensagem_erro = "".concat(err.message);
            parDetalhe.status = 9;
          }

          _context.prev = 54;
          _context.next = 57;
          return regeneratorRuntime.awrap(categoriaSrv.getCategoriaBySigla(id_empresa, complementarModel.sigla_categoria));

        case 57:
          categoria = _context.sent;

          if (categoria == null) {
            parDetalhe.id_categoria = 0;
            parDetalhe.mensagem_erro += "- (".concat(complementarModel.sigla_categoria, ") Categoria N\xE3o Cadastrada!");
            parDetalhe.status = 9;
          } else {
            parDetalhe.id_categoria = categoria.id;
          }

          _context.next = 66;
          break;

        case 61:
          _context.prev = 61;
          _context.t1 = _context["catch"](54);
          parDetalhe.id_categoria = 0;
          parDetalhe.mensagem_erro += "- (".concat(complementarModel.sigla_categoria, " ").concat(_context.t1.message, ") ");
          parDetalhe.status = 9;

        case 66:
          try {
            dadosInscrito = _inscrito(campos);
            inscritoModel = dadosInscrito;

            if (inscritoModel.mensagem_erro !== "") {
              parDetalhe.mensagem_erro += dadosInscrito.mensagem_erro;
              parDetalhe.status = 9;
            }
          } catch (err) {
            inscritoModel = {
              id_empresa: id_empresa,
              id: 0,
              cnpj_cpf: "",
              nome: "",
              estrangeiro: "N",
              sexo: "",
              data_nasc: "",
              user_insert: id_usuario,
              user_update: 0
            };
            parDetalhe.mensagem_erro = err.message;
            parDetalhe.status = 9;
          }

          parDetalhe.cnpj_cpf = inscritoModel.cnpj_cpf;
          parDetalhe.nome = shared.excluirCaracteres(inscritoModel.nome);
          parDetalhe.estrangeiro = inscritoModel.estrangeiro;
          parDetalhe.sexo = inscritoModel.sexo;
          parDetalhe.data_nasc = inscritoModel.data_nasc;
          parDetalhe.inscricao = complementarModel.inscricao;
          parDetalhe.nro_peito = complementarModel.nro_peito;
          _context.prev = 74;
          _context.next = 77;
          return regeneratorRuntime.awrap(detPlanilhaSrv.insertDetplanilha(parDetalhe));

        case 77:
          _context.next = 82;
          break;

        case 79:
          _context.prev = 79;
          _context.t2 = _context["catch"](74);

          if (_context.t2.name == "MyExceptionDB") {
            parDetalhe.status = 3;
            parDetalhe.mensagem_erro += "- ".concat(_context.t2.message);
            console.log("Erro DetPlanilha:", parDetalhe);
          } else {
            parDetalhe.status = 3;
            parDetalhe.mensagem_erro += "- ".concat(_context.t2.message);
          }

        case 82:
          _iteratorNormalCompletion = true;
          _context.next = 22;
          break;

        case 85:
          _context.next = 91;
          break;

        case 87:
          _context.prev = 87;
          _context.t3 = _context["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context.t3;

        case 91:
          _context.prev = 91;
          _context.prev = 92;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context.next = 96;
            break;
          }

          _context.next = 96;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 96:
          _context.prev = 96;

          if (!_didIteratorError) {
            _context.next = 99;
            break;
          }

          throw _iteratorError;

        case 99:
          return _context.finish(96);

        case 100:
          return _context.finish(91);

        case 101:
          _context.next = 103;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.getCabplanilha(cabPlanilha.id_empresa, cabPlanilha.id_evento, cabPlanilha.id));

        case 103:
          cabPlanilha = _context.sent;
          cabPlanilha.status = 1;
          _context.next = 107;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.updateCabplanilha(cabPlanilha));

        case 107:
          cabPlanilha = _context.sent;
          return _context.abrupt("return", cabPlanilha);

        case 109:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[20, 87, 91, 101], [36, 40], [54, 61], [74, 79], [92,, 96, 100]]);
};

exports.processamentov2 = function _callee2(req, cabec, detalhes) {
  var params, contador, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, detalhe, participantev2Model, participanteIncluido;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id_empresa = req.id_empresa;
          id_evento = req.body.id_evento;
          id_usuario = req.id_usuario;
          linhas_processadas = 0;
          params = {
            id_empresa: id_empresa,
            id_evento: id_evento,
            id_planilha: cabec.id
          };
          console.log("detalhes", detalhes);
          _context2.next = 8;
          return regeneratorRuntime.awrap(categoriacontadoresSrv.popula_contadores(params));

        case 8:
          contador = _context2.sent;
          // console.log("contador:",contador);
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _context2.prev = 11;
          _iterator2 = _asyncIterator(detalhes);

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(_iterator2.next());

        case 15:
          _step2 = _context2.sent;
          _iteratorNormalCompletion2 = _step2.done;
          _context2.next = 19;
          return regeneratorRuntime.awrap(_step2.value);

        case 19:
          _value2 = _context2.sent;

          if (_iteratorNormalCompletion2) {
            _context2.next = 38;
            break;
          }

          detalhe = _value2;
          _context2.prev = 22;
          participantev2Model = {
            id_empresa: params.id_empresa,
            id_evento: params.id_evento,
            id: 0,
            id_entrega: 0,
            inscricao: detalhe.inscricao,
            nro_peito: detalhe.nro_peito,
            id_categoria: detalhe.id_categoria,
            cnpj_cpf: detalhe.cnpj_cpf,
            nome: shared.excluirCaracteres(detalhe.nome),
            sexo: detalhe.sexo,
            data_nasc: detalhe.data_nasc,
            origem: "P",
            user_insert: id_usuario,
            user_update: 0
          };
          _context2.next = 26;
          return regeneratorRuntime.awrap(participantev2Srv.insertParticipantev2(participantev2Model));

        case 26:
          participanteIncluido = _context2.sent;
          detalhe.status = 2;
          detPlanilhaSrv.updateDetplanilha(detalhe);
          linhas_processadas++;
          _context2.next = 35;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](22);
          console.log(_context2.t0);

        case 35:
          _iteratorNormalCompletion2 = true;
          _context2.next = 13;
          break;

        case 38:
          _context2.next = 44;
          break;

        case 40:
          _context2.prev = 40;
          _context2.t1 = _context2["catch"](11);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t1;

        case 44:
          _context2.prev = 44;
          _context2.prev = 45;

          if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
            _context2.next = 49;
            break;
          }

          _context2.next = 49;
          return regeneratorRuntime.awrap(_iterator2["return"]());

        case 49:
          _context2.prev = 49;

          if (!_didIteratorError2) {
            _context2.next = 52;
            break;
          }

          throw _iteratorError2;

        case 52:
          return _context2.finish(49);

        case 53:
          return _context2.finish(44);

        case 54:
          cabec.status = "2";
          _context2.next = 57;
          return regeneratorRuntime.awrap(cabPlanilhaSrv.updateCabplanilha(cabec));

        case 57:
          cabec = _context2.sent;
          return _context2.abrupt("return", cabec);

        case 59:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[11, 40, 44, 54], [22, 32], [45,, 49, 53]]);
};

function dados_complementares(campos) {
  var complementarModel = null;

  try {
    complementarModel = {
      inscricao: campos[0],
      nro_peito: campos[5],
      sigla_categoria: campos[2].substring(1).toUpperCase(),
      mensagem_erro: ""
    };

    if (complementarModel.inscricao == null || complementarModel.inscricao.trim() === "" || isNaN(complementarModel.inscricao) || complementarModel.inscricao <= 0) {
      complementarModel.inscricao = 0;
    }

    if (complementarModel.nro_peito == null || complementarModel.nro_peito.trim() === "" || isNaN(complementarModel.nro_peito) || complementarModel.nro_peito <= 0) {
      complementarModel.nro_peito = 0;
      complementarModel.mensagem_erro += " -Nro Do Peito Inválido";
    }
  } catch (err) {
    throw new Error("N\xBA Do Peito Com Problema: ".concat(err.message));
  }

  return complementarModel;
}

function _inscrito(campos) {
  var inscritoModel = null;

  try {
    inscritoModel = {
      id_empresa: id_empresa,
      id: 0,
      cnpj_cpf: shared.limparCnpj_Cpf(campos[4]),
      nome: shared.excluirCaracteres(campos[1]).toUpperCase(),
      estrangeiro: "N",
      sexo: campos[2][0].toUpperCase(),
      data_nasc: campos[3],
      user_insert: id_usuario,
      user_update: 0,
      mensagem_erro: ""
    };

    if (inscritoModel.cnpj_cpf.trim() == 10) {
      inscritoModel.cnpj_cpf = "0" + inscritoModel.cnpj_cpf;
    }

    if (inscritoModel.nome == null || inscritoModel.nome.trim() === "" || inscritoModel.nome.length > 60) {
      if (inscritoModel.nome == null || inscritoModel.nome.trim() === "") {
        inscritoModel.nome = "";
        inscritoModel.mensagem_erro += " -Nome Em Branco";
      } else {
        inscritoModel.nome = inscritoModel.nome.substring(0, 60);
        inscritoModel.mensagem_erro += " -Nome Maior Que 60 Caracteres";
      }
    }

    if (inscritoModel.data_nasc == null || inscritoModel.data_nasc.trim() === "" || !shared.isValidDate(inscritoModel.data_nasc)) {
      inscritoModel.data_nasc = "";
      inscritoModel.mensagem_erro += " -Data Nascimento Inválida";
    }

    if (inscritoModel.cnpj_cpf.trim() !== "" && (inscritoModel.cnpj_cpf == null || !shared.isValidCnpjCpf(inscritoModel.cnpj_cpf))) {
      inscritoModel.cnpj_cpf = "";
      inscritoModel.mensagem_erro += " -CNPJ/CPF Inválido";
    }

    if (inscritoModel.sexo == null || inscritoModel.sexo.trim() === "" || inscritoModel.sexo !== "M" && inscritoModel.sexo !== "F") {
      inscritoModel.sexo = "";
      inscritoModel.mensagem_erro += " -Sexo Inválido";
    }
  } catch (err) {
    throw new Error("Inscrito: ".concat(err.message));
  }

  return inscritoModel;
}

function _incluirInscrito(inscrito) {
  var retornoInscrito, result, _inscritoModel;

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
          result = null;
          /*
              const result = await inscritoComplementarSrv.getInscritoByCpf(
                  inscrito.id_empresa,
                  inscrito.cnpj_cpf,
              );
          */

          if (!(result == null)) {
            _context3.next = 20;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(inscritoSrv.insertInscrito(inscrito));

        case 12:
          _inscritoModel = _context3.sent;

          if (!(_inscritoModel == null)) {
            _context3.next = 17;
            break;
          }

          throw new Error("Erro ao inserir inscrito ");

        case 17:
          retornoInscrito = _inscritoModel;

        case 18:
          _context3.next = 21;
          break;

        case 20:
          retornoInscrito = result;

        case 21:
          _context3.next = 26;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](7);
          throw new Error("Inscrito: ".concat(_context3.t0.message));

        case 26:
          return _context3.abrupt("return", retornoInscrito);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 23]]);
}

function _incluirParticipante(participante) {
  var retornoParticipante, result, participanteModel;
  return regeneratorRuntime.async(function _incluirParticipante$(_context4) {
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
}
/*
exports.update = async (req, res, _id_empresa, _id_local, _id_usuario) => {
  id_empresa = _id_empresa;
  id_local = _id_local;
  id_usuario = _id_usuario;
  let ct = 0;
  let nro_linha = 0;
  let result = { message: "Processamento OK" };
  const { name } = req.body;
  const file = req.file;
  var dadosPlanilha = readline.createInterface({
    input: fs.createReadStream(file.path),
  });
  for await (let linha of dadosPlanilha) {
    nro_linha++;
    if (nro_linha > 1) {
      const campos = parse.ParseCVS("", linha, ";");  
      if (campos.length != 36) {
        result = {
          message: `Quantidade De Colunas Deferente Do Padrão (35)! ${campos.length}}`,
        };
        console.log(
          `Quantidade De Colunas Deferente Do Padrão (35)! ${campos.length}}`
        );
        break;
      }
      
      const principalModel = _principalSemFiltro(campos);

        if (principalModel != null) {

          const princImobilizadoModel = await imobilizadoSrv.getImobilizado(id_empresa,id_local,principalModel.codigo);

          if (princImobilizadoModel != null)  {

            princImobilizadoModel.principal = principalModel.codigo;

            const alterado = await imobilizadoSrv.updateImobilizado(princImobilizadoModel);

            }
     

         const ImobilizadoModel = _imobilizado(campos);

          if (ImobilizadoModel != null) {

            const imobilizado = await imobilizadoSrv.getImobilizado(id_empresa,id_local,ImobilizadoModel.codigo);
        
            if (imobilizado != null){
                  console.log(`Principal ${principalModel.codigo} Imobilizado ${imobilizado.codigo}`);

                  imobilizado.principal =  principalModel.codigo;

                  const alterado = await imobilizadoSrv.updateImobilizado(imobilizado);
            } else {
                  console.log("Não Encontrado No Imobilizado: ",ImobilizadoModel.codigo);
            }
          } 
      }
        
    }
  }
  return result;
};


function _grupo(campos) {
  ct = 0;
  let grupoModel = null;
  const idx_gr = grupos.findIndex((gr) => {
    return gr.cod_grupo.trim() == campos[8].trim();
  });
  if (campos[8].trim() !== "" && idx_gr == -1) {
    ct++;
    grupos.push({ idx: ct, cod_grupo: campos[8], desc_grupo: campos[9] });
    grupoModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[8],
      descricao: campos[9].toUpperCase(),
      user_insert: id_usuario,
      user_update: 0,
    };
  }

  return grupoModel;
}

function _produto(campos) {
  let ct = 0;
  let produtosModel = null;
  const idx_pro = produtos.findIndex((pr) => {
    return pr.cod_produto.trim() == campos[1].trim();
  });
  if (campos[1].trim() !== "" && idx_pro == -1) {
    ct++;
    let cod_produto = parseInt(campos[4].trim(), 10);
    if (isNaN(cod_produto)) {
      cod_produto = 0;
    }
    let estado = 0;
    if (campos[0].trim() != "") {
      if (campos[0].trim() == "NOVO") {
        estado = 1;
      } else {
        estado = 3;
      }
    }
    produtos.push({
      idx: ct,
      cod_produto: campos[1],
      desc_produto: campos[2],
    });
    produtosModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[1],
      estado: estado,
      descricao: shared.excluirCaracteres(campos[2]).toUpperCase(),
      ncm: campos[3],
      id_principal: cod_produto,
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return produtosModel;
}

function _principal(campos) {
  let principalModel = null;
  let principalModelSemFiltro = null
  let ct = 0;
  const idx_main = principal.findIndex((pr) => {
    return pr.cod_produto.trim() == campos[4].trim();
  });
  if (campos[4].trim() !== "" && idx_main == -1) {
    ct++;
    principal.push({
      idx: ct,
      cod_produto: campos[4],
      desc_produto: campos[5],
    });
    principalModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[4].trim() !== "" ? campos[4] : 0,
      descricao: shared.excluirCaracteres(campos[5]).toUpperCase(),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  const retorno = {
    principalModel: principalModel,
    principalModelSemFiltro: 
    {
        id_empresa: id_empresa,
        id_filial: id_local,
        codigo: campos[4].trim() !== "" ? campos[4] : 0,
        descricao: shared.excluirCaracteres(campos[5]).toUpperCase(),
        user_insert: id_usuario,
        user_update: 0
   }
  }
  return retorno;
}

function _principalSemFiltro(campos) {
    let principalModel = null;
   
    if (campos[4].trim() !== "") {
      principalModel = {
        id_empresa: id_empresa,
        id_filial: id_local,
        codigo: campos[4].trim() !== "" ? campos[4] : 0,
        descricao: shared.excluirCaracteres(campos[5]).toUpperCase(),
        user_insert: id_usuario,
        user_update: 0,
      };
    }
    return principalModel;
  }

function _imobilizado(campos,linhaPrincipal) {
  let ImobilizadoModel = null;
  let ct = 0;
  const idx_mob = imobilizados.findIndex((imo) => {
    return imo.cod_imobilizado.trim() == campos[6].trim();
  });
  if (campos[6].trim() !== "" && idx_mob == -1) {
    ct++;
    imobilizados.push({
      idx: ct,
      cod_imobilizado: campos[6],
      desc_imobilizado: campos[7],
    });

    ImobilizadoModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      codigo: campos[6],
      descricao: shared.excluirCaracteres(campos[7]).toUpperCase(),
      cod_grupo: campos[8],
      cod_cc: campos[10].replace("#","-"),
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
      condicao: campos[12],
      apelido: campos[13],
      origem: "P",
      principal: linhaPrincipal == null ? 0 : linhaPrincipal.codigo,
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return ImobilizadoModel;
}

function _nfe(campos) {
  let NfesModel = null;
  let ct = 0;
  const idx_nfe = nfes.findIndex((nf) => {
    return (
      nf.imobilizado == campos[6] &&
      nf.nfe == campos[16] &&
      nf.serie == campos[17] &&
      nf.item == campos[18]
    );
  });
  if (campos[16].trim() !== "" && idx_nfe == -1) {
    nfes.push({
      idx: ct,
      id_empresa: id_empresa,
      id_filial: id_local,
      cnpj_fornecedor: campos[14],
      razao_fornecedor: shared.excluirCaracteres(campos[15]).toUpperCase(),
      id_imobilizado: campos[6],
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
    });
    NfesModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      cnpj_fornecedor: campos[14],
      razao_fornecedor: shared.excluirCaracteres(campos[15]).toUpperCase(),
      id_imobilizado: campos[6],
      nfe: campos[16],
      serie: campos[17],
      item: campos[18],
      chavee: campos[19],
      dtemissao: campos[27],
      dtlancamento: campos[28],
      qtd: shared.excluirVirgulasePontos(campos[20]),
      punit: shared.excluirVirgulasePontos(campos[21]),
      totalitem: shared.excluirVirgulasePontos(campos[22]),
      vlrcontabil: shared.excluirVirgulasePontos(campos[23]),
      baseicms: shared.excluirVirgulasePontos(campos[24]),
      percicms: shared.excluirVirgulasePontos(campos[25]),
      vlrcicms: shared.excluirVirgulasePontos(campos[26]),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return NfesModel;
}

function _valores(campos) {
  let ValorModel = null;
  ct = 0;
  const idx_valor = valores.findIndex((val) => {
    return (
      val.id_empresa == id_empresa &&
      val.id_filial == id_local &&
      val.id_imobilizado == campos[6]
    );
  });
  if (idx_valor == -1) {
    ct++;
    valores.push({
      idx: ct,
      cod_imobilizado: campos[12],
      dtaquisicao: campos[29],
    });

    ValorModel = {
      id_empresa: id_empresa,
      id_filial: id_local,
      id_imobilizado: campos[6],
      dtaquisicao: campos[29],
      vlraquisicao: shared.excluirVirgulasePontos(campos[30]),
      totaldepreciado: shared.excluirVirgulasePontos(campos[31]),
      vlrresidual: shared.excluirVirgulasePontos(campos[32]),
      reavalicao: shared.excluirVirgulasePontos(campos[33]),
      deemed: shared.excluirVirgulasePontos(campos[34]),
      vlrconsolidado: shared.excluirVirgulasePontos(campos[35]),
      user_insert: id_usuario,
      user_update: 0,
    };
  }
  return ValorModel;
}

exports.createV2 = async (req, res) => {
  const { name } = req.body;
  const file = req.file;
  return { message: "Deu Certo !!" };
};

exports.delete = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;
    fs.unlinkSync(file.path);
    res.status(200).json({ message: "Arquivo Excluído!", path: file.path });
  } catch (erro) {
    res.status(500).json({ message: erro.message });
  }
    */