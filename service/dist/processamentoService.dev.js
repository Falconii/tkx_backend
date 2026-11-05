"use strict";

/* SERVICE processamento do work */
var db = require("../shared/infra/database");

var shared = require("../shared/util/shared.js");

var _require = require('toad-scheduler'),
    AsyncTask = _require.AsyncTask,
    SimpleIntervalJob = _require.SimpleIntervalJob,
    ToadScheduler = _require.ToadScheduler;

var scheduler = new ToadScheduler();

var usuarioSrv = require('../shared/service/usuarioService');

var _require2 = require('../shared/excel/excelgenarator'),
    gerarExcelGenerico = _require2.gerarExcelGenerico;

var path = require('path');

var crypto = require('crypto');

var funcoes = require("../email/funcoes.js");

var configParamsContratos = {
  "sheetName": "Relatório",
  "freezeHeader": true,
  "autoFilter": true,
  "columns": [{
    "header": "id_empresa",
    "key": "id_empresa",
    "width": 12,
    "align": "right",
    "format": "0"
  }, {
    "header": "id",
    "key": "id",
    "width": 6,
    "align": "right",
    "format": "0"
  }, {
    "header": "id_cab",
    "key": "id_cab",
    "width": 8,
    "align": "right",
    "format": "0"
  }, {
    "header": "nro_linha",
    "key": "nro_linha",
    "width": 11,
    "align": "right",
    "format": "0"
  }, {
    "header": "id_paf",
    "key": "id_paf",
    "width": 8,
    "align": "right",
    "format": "0"
  }, {
    "header": "id_sim",
    "key": "id_sim",
    "width": 8,
    "align": "right",
    "format": "0"
  }, {
    "header": "id_email",
    "key": "id_email",
    "width": 10,
    "align": "right",
    "format": "0"
  }, {
    "header": "id_arker",
    "key": "id_arker",
    "width": 10,
    "align": "right",
    "format": "0"
  }, {
    "header": "competencia",
    "key": "competencia",
    "width": 13,
    "align": "left",
    "format": null
  }, {
    "header": "base",
    "key": "base",
    "width": 9,
    "align": "left",
    "format": null
  }, {
    "header": "cod_filial",
    "key": "cod_filial",
    "width": 12,
    "align": "right",
    "format": "0"
  }, {
    "header": "filial",
    "key": "filial",
    "width": 23,
    "align": "left",
    "format": null
  }, {
    "header": "cp",
    "key": "cp",
    "width": 6,
    "align": "left",
    "format": null
  }, {
    "header": "cod_empresa",
    "key": "cod_empresa",
    "width": 13,
    "align": "right",
    "format": "0"
  }, {
    "header": "cod_bandeiras",
    "key": "cod_bandeiras",
    "width": 15,
    "align": "right",
    "format": "0"
  }, {
    "header": "bandeiras",
    "key": "bandeiras",
    "width": 43,
    "align": "left",
    "format": null
  }, {
    "header": "tipo_de_pagamento",
    "key": "tipo_de_pagamento",
    "width": 19,
    "align": "left",
    "format": null
  }, {
    "header": "cod_cliente",
    "key": "cod_cliente",
    "width": 13,
    "align": "left",
    "format": null
  }, {
    "header": "cliente",
    "key": "cliente",
    "width": 53,
    "align": "left",
    "format": null
  }, {
    "header": "cnpj_cliente",
    "key": "cnpj_cliente",
    "width": 16,
    "align": "left",
    "format": null
  }, {
    "header": "investimento",
    "key": "investimento",
    "width": 14,
    "align": "right",
    "format": "#,##0.00;#,##0.00;0"
  }, {
    "header": "acao",
    "key": "acao",
    "width": 21,
    "align": "left",
    "format": null
  }, {
    "header": "proposta",
    "key": "proposta",
    "width": 10,
    "align": "left",
    "format": null
  }, {
    "header": "uf",
    "key": "uf",
    "width": 4,
    "align": "left",
    "format": null
  }, {
    "header": "tipo_de_verba",
    "key": "tipo_de_verba",
    "width": 17,
    "align": "left",
    "format": null
  }, {
    "header": "tipo_doc",
    "key": "tipo_doc",
    "width": 10,
    "align": "left",
    "format": null
  }, {
    "header": "dp_sic",
    "key": "dp_sic",
    "width": 8,
    "align": "right",
    "format": "0"
  }, {
    "header": "doc_conciliador",
    "key": "doc_conciliador",
    "width": 17,
    "align": "left",
    "format": null
  }, {
    "header": "pagina",
    "key": "pagina",
    "width": 8,
    "align": "left",
    "format": null
  }, {
    "header": "modo",
    "key": "modo",
    "width": 6,
    "align": "left",
    "format": null
  }, {
    "header": "status",
    "key": "status",
    "width": 8,
    "align": "left",
    "format": null
  }, {
    "header": "status_assinatura",
    "key": "status_assinatura",
    "width": 19,
    "align": "left",
    "format": null
  }, {
    "header": "status_arquivos",
    "key": "status_arquivos",
    "width": 17,
    "align": "left",
    "format": null
  }, {
    "header": "user_insert",
    "key": "user_insert",
    "width": 13,
    "align": "right",
    "format": "0"
  }, {
    "header": "user_update",
    "key": "user_update",
    "width": 13,
    "align": "right",
    "format": "0"
  }, {
    "header": "paf_qtd_contratos",
    "key": "paf_qtd_contratos",
    "width": 19,
    "align": "right",
    "format": "0"
  }, {
    "header": "paf_status",
    "key": "paf_status",
    "width": 12,
    "align": "left",
    "format": null
  }, {
    "header": "paf_total_valor",
    "key": "paf_total_valor",
    "width": 17,
    "align": "right",
    "format": "#,##0.00;#,##0.00;0"
  }, {
    "header": "sim_qtd_contratos",
    "key": "sim_qtd_contratos",
    "width": 19,
    "align": "right",
    "format": "0"
  }, {
    "header": "sim_status_conciliador",
    "key": "sim_status_conciliador",
    "width": 24,
    "align": "left",
    "format": null
  }, {
    "header": "sim_valorsazonal",
    "key": "sim_valorsazonal",
    "width": 18,
    "align": "right",
    "format": "#,##0.00;#,##0.00;0"
  }, {
    "header": "ass_paf_resposta",
    "key": "ass_paf_resposta",
    "width": 18,
    "align": "left",
    "format": null
  }, {
    "header": "ass_paf_obs",
    "key": "ass_paf_obs",
    "width": 13,
    "align": "left",
    "format": null
  }, {
    "header": "ass_sim_resposta",
    "key": "ass_sim_resposta",
    "width": 18,
    "align": "left",
    "format": null
  }, {
    "header": "ass_sim_obs",
    "key": "ass_sim_obs",
    "width": 13,
    "align": "left",
    "format": null
  }]
};
var configParamsPafsDet = {
  "sheetName": "Relatório",
  "freezeHeader": true,
  "autoFilter": true,
  "columns": [{
    "header": "id_empresa",
    "key": "id_empresa",
    "width": 12,
    "align": "right",
    "format": "0"
  }, {
    "header": "id",
    "key": "id",
    "width": 6,
    "align": "right",
    "format": "0"
  }, {
    "header": "nome_arquivo",
    "key": "nome_arquivo",
    "width": 60,
    "align": "left",
    "format": null
  }, {
    "header": "pasta_arquivo",
    "key": "pasta_arquivo",
    "width": 57,
    "align": "left",
    "format": null
  }, {
    "header": "id_folder",
    "key": "id_folder",
    "width": 11,
    "align": "left",
    "format": null
  }, {
    "header": "id_file",
    "key": "id_file",
    "width": 9,
    "align": "left",
    "format": null
  }, {
    "header": "file_name",
    "key": "file_name",
    "width": 11,
    "align": "left",
    "format": null
  }, {
    "header": "qtd_paginas_total",
    "key": "qtd_paginas_total",
    "width": 19,
    "align": "right",
    "format": "0"
  }, {
    "header": "tamanho",
    "key": "tamanho",
    "width": 11,
    "align": "right",
    "format": "#,##0.00;#,##0.00;0"
  }, {
    "header": "processado",
    "key": "processado",
    "width": 27,
    "align": "left",
    "format": null
  }, {
    "header": "qtd_contratos",
    "key": "qtd_contratos",
    "width": 15,
    "align": "right",
    "format": "0"
  }, {
    "header": "status",
    "key": "status",
    "width": 8,
    "align": "left",
    "format": null
  }, {
    "header": "total_valor",
    "key": "total_valor",
    "width": 13,
    "align": "right",
    "format": "#,##0.00;#,##0.00;0"
  }, {
    "header": "status_assinatura",
    "key": "status_assinatura",
    "width": 19,
    "align": "left",
    "format": null
  }, {
    "header": "status_arquivos",
    "key": "status_arquivos",
    "width": 17,
    "align": "left",
    "format": null
  }, {
    "header": "user_insert",
    "key": "user_insert",
    "width": 13,
    "align": "right",
    "format": "0"
  }, {
    "header": "user_update",
    "key": "user_update",
    "width": 13,
    "align": "right",
    "format": "0"
  }, {
    "header": "ass_obs",
    "key": "ass_obs",
    "width": 9,
    "align": "left",
    "format": null
  }, {
    "header": "ass_resposta",
    "key": "ass_resposta",
    "width": 14,
    "align": "left",
    "format": null
  }]
};
var configParamsSim = {};
/* CRUD GET SERVICE */
//02

function processarTarefas() {
  var hoje, tarefas, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tarefa, resultado, statusAtual;

  return regeneratorRuntime.async(function processarTarefas$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          hoje = shared.dataHoraSaoPaulo(); // 1. Seleciona e marca tarefas como "1" (processando)

          _context.next = 3;
          return regeneratorRuntime.awrap(db.any("\n    UPDATE tarefas\n    SET status = '1'\n    WHERE id IN (\n      SELECT id\n      FROM tarefas\n      WHERE status = '0'\n      ORDER BY id\n      LIMIT 10\n    )\n    RETURNING *\n  "));

        case 3:
          tarefas = _context.sent;

          if (!(tarefas.length === 0)) {
            _context.next = 7;
            break;
          }

          console.log("Nenhuma tarefa pendente");
          return _context.abrupt("return");

        case 7:
          // 2. Processa cada tarefa FORA da transação
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 10;
          _iterator = tarefas[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 43;
            break;
          }

          tarefa = _step.value;
          _context.prev = 14;
          console.log("Processando tarefa:", tarefa.id);
          resultado = {
            status: '2'
          }; // concluído por padrão

          if (!(tarefa.sigla === 'contrato_det01')) {
            _context.next = 21;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(gerarRelatorioContratos(tarefa.parametros, tarefa.id_empresa, tarefa.id_usuario, tarefa.name_file));

        case 20:
          resultado = _context.sent;

        case 21:
          if (!(tarefa.sigla === 'paf_cab01')) {
            _context.next = 25;
            break;
          }

          _context.next = 24;
          return regeneratorRuntime.awrap(gerarRelatorioPafCab(tarefa.parametros, tarefa.id_empresa, tarefa.id_usuario, tarefa.name_file));

        case 24:
          resultado = _context.sent;

        case 25:
          _context.next = 27;
          return regeneratorRuntime.awrap(db.one("\n        SELECT status FROM tarefas WHERE id = $1\n      ", [tarefa.id]));

        case 27:
          statusAtual = _context.sent;

          if (!(statusAtual.status === '4')) {
            _context.next = 31;
            break;
          }

          console.log("Tarefa cancelada pelo usuário:", tarefa.id);
          return _context.abrupt("continue", 40);

        case 31:
          _context.next = 33;
          return regeneratorRuntime.awrap(db.none("\n        UPDATE tarefas\n        SET status = $1, data_conclusao = $2\n        WHERE id = $3\n      ", [resultado.status, hoje, tarefa.id]));

        case 33:
          _context.next = 40;
          break;

        case 35:
          _context.prev = 35;
          _context.t0 = _context["catch"](14);
          console.log("Erro ao gerar relatório:", _context.t0);
          _context.next = 40;
          return regeneratorRuntime.awrap(db.none("\n        UPDATE tarefas\n        SET status = '3', data_conclusao = $1\n        WHERE id = $2\n      ", [hoje, tarefa.id]));

        case 40:
          _iteratorNormalCompletion = true;
          _context.next = 12;
          break;

        case 43:
          _context.next = 49;
          break;

        case 45:
          _context.prev = 45;
          _context.t1 = _context["catch"](10);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 49:
          _context.prev = 49;
          _context.prev = 50;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 52:
          _context.prev = 52;

          if (!_didIteratorError) {
            _context.next = 55;
            break;
          }

          throw _iteratorError;

        case 55:
          return _context.finish(52);

        case 56:
          return _context.finish(49);

        case 57:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 45, 49, 57], [14, 35], [50,, 52, 56]]);
} //01


exports.startProcessamentoTarefas = function () {
  var intervaloSegundos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  var caminhoArquivo = path.join(APP_ROOT, "..", "shared", "planilhas");
  console.log("shared ==> ", caminhoArquivo);
  var task = new AsyncTask('Processamento de Tarefas', function _callee() {
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(processarTarefas());

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.log('Erro no processamento:', _context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 5]]);
  }, function (error) {
    console.log('Erro no job:', error);
  });
  var job = new SimpleIntervalJob({
    seconds: intervaloSegundos,
    runImmediately: true
  }, task, {
    id: 'job_processar_tarefas',
    preventOverrun: true
  });
  scheduler.addSimpleIntervalJob(job); //console.log(`Job de processamento iniciado (intervalo: ${intervaloSegundos}s)`);
}; //03

/*
async function gerarRelatorioContratos(parametros, id_empresa, id_usuario, name_file) {
  try {


    let params = {}
    
    console.log("Gerando relatório de contratos para empresa:",parametros);

    

    try {
          params = JSON.parse(parametros.trim().replace(/^"|"$/g, ""));
          
          console.log("woker params ==> ", params);
          console.log("worker params.competencia ==> ", params.competencia);
    } catch (err) {
        console.error("Erro ao analisar parâmetros JSON:", err);
        return {
            status: 3,
            message: "Erro ao analisar parâmetros JSON"
        };
    }

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

    let lsRegistros = [];

    try 
    {
      paramsAjustado = {
          id_empresa:Number(params.id_empresa),
          id:Number(params.id),
          competencia:params.competencia,
          cod_empresa:Number(params.cod_empresa),
          cod_cliente:params.cod_cliente,
          cliente:params.cliente,
          cnpj_cliente:params.cnpj_cliente,
          doc_conciliador:params.doc_conciliador,
          proposta:params.proposta,
          acao:params.acao,
          tipo_de_verba:params.tipo_de_verba,
          tipo_de_pagamento:params.tipo_de_pagamento,
          status:params.status,
          status_assinatura:params.status_assinatura,
          status_arquivos:params.status_arquivos,
          id_paf:Number(params.id_paf),
          id_sim:Number(params.id_sim),
          id_email:Number( params.id_email),
          id_arker:Number(params.id_arker),
          pagina:Number(params.pagina),
          saida:Number(params.saida),
          tamPagina:Number(params.tamPagina),
          contador: 'N' ,
          orderby: params.orderby,  
          sharp:boolean = params.sharp
      }
      console.log("Params", params);
      console.log("---------------------------------------------");
      console.log("paramsAjustado ==> ", paramsAjustado);
      lsRegistros = await contrato_detSrv.getContratos_Det(paramsAjustado);
    }
    catch (err) {
      console.error("Erro ao buscar registros:", err);
        return {
          status: 2,
          tipo: "json",
          conteudo: lsRegistros
       };
      
    }

    console.log("Registros encontrados:", lsRegistros.length);

    if (lsRegistros.length === 0) {
      return { status: 4, message: "Nenhum registro encontrado" };
    }

    // saída 3 = apenas SQL
    if (params.saida === 3) {
      return {
        status: 2,
        tipo: "sql",
        conteudo: lsRegistros.replace(/[\n\t]/g, '')
      };
    }

    // saída 1 ou 2 = gerar arquivo
    if (params.saida === 1 || params.saida === 2) {

      const caminhoArquivo = await exceltoemailordownload(
        lsRegistros,
        configParamsContratos,
        name_file
      );

     return {
        status: 2,
        tipo: "arquivo",
        arquivo: caminhoArquivo,
        nome: name_file
      };
    }

    // saída padrão = JSON
    return {
      status: 2,
      tipo: "json",
      conteudo: lsRegistros
    };

  } catch (err) {
    console.error("Erro ao gerar relatório de contratos:", err);
    return {
      status: 3,
      message: err.message
    };
  }
}

async function gerarRelatorioPafCab(parametros, id_empresa, id_usuario, name_file) {
  try {


    let params = {}
    
    console.log("Gerando relatório de gerarRelatorioPafCab para empresa:",parametros);
   

    try {
          params = JSON.parse(parametros.trim().replace(/^"|"$/g, ""));
          
          console.log("woker params ==> ", params);
          console.log("worker params.competencia ==> ", params.competencia);
    } catch (err) {
        console.error("Erro ao analisar parâmetros JSON:", err);
        return {
            status: 3,
            message: "Erro ao analisar parâmetros JSON"
        };
    }

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

    let lsRegistros = [];


    try 
    {
      paramsAjustado = {   
        id_empresa:id_empresa,
        id:Number(params.id),
        nome_arquivo:params.nome_arquivo,
        processado:"",
        qtd_contratos:0,
        status:params.status,
        total_valor:Number(params.total_valor),
        status_assinatura:params.status_assinatura,
        status_arquivos:params.status_arquivos,
        ass_obs:params.ass_obs,
        ass_resposta:params.ass_resposta,
        saida:2,
        pagina:params.pagina,
        tamPagina:Number(params.tamPagina),
        contador: 'N' ,
        orderby: params.orderby,  
        sharp:boolean = params.sharp
      }
      console.log("gerarRelatorioPafCab")
      console.log("Params", params);
      console.log("---------------------------------------------");
      console.log("paramsAjustado ==> ", paramsAjustado);
      lsRegistros = await paf_cabSrv.getPafs_Cab(paramsAjustado);
    }
    catch (err) {
      console.error("Erro ao buscar registros:", err);
        return {
          status: 2,
          tipo: "json",
          conteudo: lsRegistros
       };
      
    }

    console.log("Registros encontrados:", lsRegistros.length);

    if (lsRegistros.length === 0) {
      return { status: 4, message: "Nenhum registro encontrado" };
    }

    // saída 3 = apenas SQL
    if (params.saida === 3) {
      return {
        status: 2,
        tipo: "sql",
        conteudo: lsRegistros.replace(/[\n\t]/g, '')
      };
    }

    // saída 1 ou 2 = gerar arquivo
    if (params.saida === 1 || params.saida === 2) {

      const caminhoArquivo = await exceltoemailordownload(
        lsRegistros,
        configParamsPafsDet,
        name_file
      );

     return {
        status: 2,
        tipo: "arquivo",
        arquivo: caminhoArquivo,
        nome: name_file
      };
    }

    // saída padrão = JSON
    return {
      status: 2,
      tipo: "json",
      conteudo: lsRegistros
    };

  } catch (err) {
    console.error("Erro ao gerar relatório de contratos:", err);
    return {
      status: 3,
      message: err.message
    };
  }
}

async function gerarRelatorioSIMs(parametros, id_empresa, id_usuario, name_file) {
  try {


    let params = {}
    
    console.log("Gerando relatório de contratos para empresa:",parametros);

    try {
          params = JSON.parse(parametros);
    } catch (err) {
        console.error("Erro ao analisar parâmetros JSON:", err);
        return {
            status: 3,
            message: "Erro ao analisar parâmetros JSON"
        };
    }

    const usuario = await usuarioSrv.getUsuario(id_empresa, id_usuario);

    let lsRegistros = [];

    try 
    {
      lsRegistros = await contrato_detSrv.getContratos_Det(params);
    }
    catch (err) {
      console.error("Erro ao buscar registros:", err);
        return {
          status: 2,
          tipo: "json",
          conteudo: lsRegistros
       };
      
    }

    console.log("Registros encontrados:", lsRegistros.length);

    if (lsRegistros.length === 0) {
      return { status: 3, message: "Nenhum registro encontrado" };
    }

    // saída 3 = apenas SQL
    if (params.saida === 3) {
      return {
        status: 2,
        tipo: "sql",
        conteudo: lsRegistros.replace(/[\n\t]/g, '')
      };
    }

    // saída 1 ou 2 = gerar arquivo
    if (params.saida === 1 || params.saida === 2) {

      const caminhoArquivo = await exceltoemailordownload(
        lsRegistros,
        configParamsSim,
        name_file
      );

      if (params.saida === 1 ){
         await funcoes.enviarEmailRelatorioEvento(usuario,"CONTRATOS",caminhoArquivo);
      }

      return {
        status: 2,
        tipo: "arquivo",
        arquivo: caminhoArquivo,
        nome: name_file
      };
    }

    // saída padrão = JSON
    return {
      status: 2,
      tipo: "json",
      conteudo: lsRegistros
    };

  } catch (err) {
    console.error("Erro ao gerar relatório de contratos:", err);
    return {
      status: 3,
      message: err.message
    };
  }
}
*/


function exceltoemailordownload(rows, config, name_file) {
  var caminhoArquivo;
  return regeneratorRuntime.async(function exceltoemailordownload$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("Gerando arquivo Excel:", name_file);
          caminhoArquivo = path.join(APP_ROOT, "..", "shared", "planilhas", name_file);
          console.log("shared ==> ", caminhoArquivo);
          console.log("Gerando arquivo Excel:", caminhoArquivo);
          _context3.next = 7;
          return regeneratorRuntime.awrap(gerarExcelGenerico(rows, config, caminhoArquivo));

        case 7:
          return _context3.abrupt("return", caminhoArquivo);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.log("Erro exceltoemailordownload:", _context3.t0);
          throw _context3.t0;

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

;