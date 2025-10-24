//const uploaddata = require("../data/uploadData");
const shared = require("../util/shared.js");
const parse = require("../util/ParseCSV");
const inscritoSrv = require("../service/inscritoService.js");
const inscritoComplementarSrv = require("../service/complementar/inscritoService.js");
const eventoSrv   = require("../service/eventoService.js");
const participanteSrv = require("../service/participanteService.js");
const cabPlanilhaSrv = require("../service/cabplanilhaService.js");
const detPlanilhaSrv = require("../service/detPlanilhaService.js");
const categoriaSrv   = require("../service/complementar/categoriaService.js");
const categoriacontadoresSrv = require("../service/categoriacontadorService.js");
const fs = require("fs");
const readline = require("readline");
let id_empresa = 0;
let id_local = 0;
let id_evento = 0;
let complementarModel = {};
let inscritoModel = {};

exports.inclusao = async (req, res) => { 
  id_empresa = req.id_empresa,
  id_evento = req.body.id_evento,
  id_usuario = req.id_usuario
  let ct = 0;
  let nro_linha = 0;
  let result = { message: "Processamento OK" };
  let total_linhas = 0;
  let linhas_processadas = 0;
  let total_linhas_erro = 0;
  let campos = "";
  const { name } = req.body;
  const file = req.file;


  const evento = eventoSrv.getEvento(id_empresa,id_evento);

  //fazer trativa de não exsiste o evento

  

  const cab = {
     "id_empresa"        : id_empresa,
    "id_evento"          : id_evento,
    "id"                 : 0,
    "arquivo"            : file.originalname,
    "total_linhas"       : 0,
    "linhas_processadas" : 0,
    "total_linhas_erro"  : 0,
    "user_insert"        : id_usuario,
    "user_update"        : 0

  };



  const cabPlanilha      = await cabPlanilhaSrv.insertCabplanilha(cab);

    
  var dadosPlanilha = readline.createInterface({
    input: fs.createReadStream(file.path),
  });
  for await (let linha of dadosPlanilha) {  

        if (nro_linha == 0){
          nro_linha++;
          continue;
        }
        
        nro_linha++;

        parDetalhe = {
          "id_empresa"	  : id_empresa,
          "id_evento" 		: id_evento,
          "id_cabec" 		  : cabPlanilha.id,
          "cnpj_cpf" 		  : "",
          "nome" 			    : "",
          "estrangeiro"	  : "",
          "sexo" 			    : "",
          "data_nasc" 		: "",
          "inscricao" 		: "",
          "nro_peito" 		: 0,
          "id_categoria" 	: 1,
          "id_inscrito" 	: 0,
          "status" 	     	: 0,
          "mensagem_erro"	: "",
          "user_insert" 	: id_usuario,
          "user_update" 	: 0
      }
    

      try {
          campos = parse.ParseCVS("", linha, ";");
      } catch(err){
        continue;
      }
     
      if (campos.length != 5) {
        console.log(
          `Quantidade De Colunas Deferente Do Padrão (6)! Linha:Linha: ${nro_linha} Campos: ${campos.length}}`
        );
        continue;
      }

      console.log(`Processando Linha: ${nro_linha} `);
      if (nro_linha % 100 === 0){
        console.log(
         `Processando Linha: ${nro_linha} `
        );
      }

      console.log("campos:",campos);
      try {
           const dadosComplementares = dados_complementares(campos);
           complementarModel = dadosComplementares;
           if (complementarModel.mensagem_erro !== "") {
              parDetalhe.mensagem_erro = complementarModel.mensagem_erro;
              parDetalhe.status = 9; 
           }
      } 
      catch (err)
      {
            complementarModel = {
            "inscricao": 0,
            "nro_peito": 0,
            "sigla_categoria":""
            };
            parDetalhe.mensagem_erro = `${err.message}`;
            parDetalhe.status = 9; 
      }

      try{

          console.log("complementarModel.sigla_categoria:",complementarModel.sigla_categoria);

          const categoria =await categoriaSrv.getCategoriaBySigla(id_empresa,complementarModel.sigla_categoria);

          if (categoria == null) { 
                parDetalhe.id_categoria = 0;
                parDetalhe.mensagem_erro += `- (${complementarModel.sigla_categoria}) Categoria Não Cadastrada!`;
                parDetalhe.status = 9; 
            }
           else {          

                console.log("categoria:",categoria);

                parDetalhe.id_categoria = categoria.id;
           }        

      } catch( err){

         parDetalhe.id_categoria = 0;
         //parDetalhe.mensagem_erro += '- Sigla Da Categoria Inválida!';
         parDetalhe.mensagem_erro += `- (${complementarModel.sigla_categoria} ${err.message}) `;
         parDetalhe.status = 9; 

      }
     

      try {

        const dadosInscrito = _inscrito(campos);

        inscritoModel = dadosInscrito;


        if (inscritoModel.mensagem_erro !== "") {
            parDetalhe.mensagem_erro += dadosInscrito.mensagem_erro;
            parDetalhe.status = 9; 
        }      

      } catch(err){

          inscritoModel = {
            "id_empresa": id_empresa,
            "id": 0,
            "cnpj_cpf": "",
            "nome":  "",
            "estrangeiro": "N",
            "sexo": "",
            "data_nasc": "",
            "user_insert": id_usuario,
            "user_update": 0
          };
          parDetalhe.mensagem_erro = err.message;
          parDetalhe.status = 9; 
      }

      console.log(`Processando Inscrito: ${inscritoModel.cnpj_cpf} - ${inscritoModel.nome}`);

   
      parDetalhe.cnpj_cpf 		=  inscritoModel.cnpj_cpf;
      parDetalhe.nome  			=  inscritoModel.nome;
      parDetalhe.estrangeiro 	=  inscritoModel.estrangeiro;
      parDetalhe.sexo 			=  inscritoModel.sexo;
      parDetalhe.data_nasc     =  inscritoModel.data_nasc;
      parDetalhe.inscricao 	=  complementarModel.inscricao;
      parDetalhe.nro_peito 	=  complementarModel.nro_peito;
      
      if (parDetalhe.mensagem_erro.trim() !== ""){
         cabPlanilha.total_linhas_erro = cabPlanilha.total_linhas_erro + 1;
      }
        

      cabPlanilha.total_linhas++;;

      try {
          await detPlanilhaSrv.insertDetplanilha(parDetalhe);
      } catch(err){
          if(err.name == 'MyExceptionDB')
          {
              parDetalhe.status = 3;
              parDetalhe.mensagem_erro += `- ${err.message}`;
          }
          else
          {  
              parDetalhe.status = 3;
              parDetalhe.mensagem_erro += `- ${err.message}`;
          }
        }

  };
  
  await  cabPlanilhaSrv.updateCabplanilha(cabPlanilha);
  
  return cabPlanilha;
 

}



exports.processamento = async (req, cabec,detalhes) => { 
  id_empresa = req.id_empresa,
  id_evento = req.body.id_evento,
  id_usuario = req.id_usuario
  linhas_processadas = 0;

  const params = {
    "id_empresa":id_empresa, 
    "id_evento":id_evento,
    "id_planilha": cabec.id
  };

  const contador = await categoriacontadoresSrv.popula_contadores(params);

  console.log("contador:",contador);

  for await (let detalhe of detalhes) {  
    
    try{

      const inscritoModel ={
        "id_empresa": detalhe.id_empresa,
        "id": 0,
        "cnpj_cpf": detalhe.cnpj_cpf,
        "nome": shared.excluirCaracteres(detalhe.nome),
        "estrangeiro": detalhe.estrangeiro, 
        "sexo": detalhe.sexo,
        "data_nasc": shared.formatDateYYYYMMDD(detalhe.data_nasc),
        "origem": "P",
        "user_insert": id_usuario,
        "user_update": 0
       }

      const inscrito = await _incluirInscrito(inscritoModel);

      const participanteModel = {
          "id_empresa": detalhe.id_empresa,
          "id_evento": detalhe.id_evento,
          "id_inscrito": inscrito.id,
          "inscricao": detalhe.inscricao,
          "nro_peito": detalhe.nro_peito,
          "id_categoria": detalhe.id_categoria,
          "id_old_inscrito":0,
          "user_insert": id_usuario,
          "user_update": 0
       }

      const participante = await participanteSrv.getParticipante(
          participanteModel.id_empresa,
          participanteModel.id_evento,
          participanteModel.id_inscrito
      );

      if (participante == null){
          const participanteIncluido = await participanteSrv.insertParticipante(participanteModel);
      }
      
      detalhe.status = 2;

      detPlanilhaSrv.updateDetplanilha(detalhe);

      linhas_processadas++;
    }
    catch(err){
      console.log(err);
    }

  };
  
  cabec.linhas_processadas = linhas_processadas;

  cabec = await cabPlanilhaSrv.updateCabplanilha(cabec);

  return   cabec;
;
 

}


function dados_complementares(campos) {
  let complementarModel = null;
  try {
    complementarModel = {
      "inscricao": campos[0],
      "nro_peito": 0,
      "sigla_categoria": campos[2].substring(1),
      "mensagem_erro":""
    };


    if (complementarModel.inscricao == null || complementarModel.inscricao.trim() === "" || isNaN(complementarModel.inscricao) || complementarModel.inscricao <= 0) {
      complementarModel.inscricao = 0;
      complementarModel.mensagem_erro += " -Inscrição Inválida";
    }

    


  } catch (err) {
      throw new Error(`Incrição Ou Nº Do Peito Com Problema: ${err.message}`);
  }
  return complementarModel;
}
function _inscrito(campos) {
  let inscritoModel = null;
  try {
    inscritoModel = {
      "id_empresa": id_empresa,
      "id": 0,
      "cnpj_cpf": shared.limparCnpj_Cpf(campos[4]),
      "nome":  shared.excluirCaracteres(campos[1]).toUpperCase(),
      "estrangeiro": "N",  
      "sexo": campos[2][0].toUpperCase(),
      "data_nasc": campos[3],
      "user_insert": id_usuario,
      "user_update": 0,
      "mensagem_erro":""
  };
   if (inscritoModel.nome == null || inscritoModel.nome.trim() === "" || inscritoModel.nome.length > 60) {
      if (inscritoModel.nome == null || inscritoModel.nome.trim() === ""){
            inscritoModel.nome = "";
            inscritoModel.mensagem_erro += " -Nome Em Branco";
      } else {
            inscritoModel.nome = inscritoModel.nome.substring(0,60);
            inscritoModel.mensagem_erro += " -Nome Maior Que 60 Caracteres";
      }      
     
  }
  if (inscritoModel.data_nasc == null || inscritoModel.data_nasc.trim() === "" ||!(shared.isValidDate(inscritoModel.data_nasc)) ){
    inscritoModel.data_nasc = "";
     inscritoModel.mensagem_erro += " -Data Nascimento Inválida";
  }
  if (inscritoModel.cnpj_cpf == null || inscritoModel.cnpj_cpf.trim() === "" || inscritoModel.cnpj_cpf.length < 11) {
    inscritoModel.cnpj_cpf = "";
     inscritoModel.mensagem_erro += " -CNPJ/CPF Inválido";
  } 
  if (inscritoModel.nome == null || inscritoModel.nome.trim() === "") {
    inscritoModel.nome = "";
     inscritoModel.mensagem_erro += " -Nome Inválido";
  }  
  if (inscritoModel.sexo == null || inscritoModel.sexo.trim() === "" || (inscritoModel.sexo !== "M" && inscritoModel.sexo !== "F")) {
    inscritoModel.sexo = "";
    inscritoModel.mensagem_erro += " -Sexo Inválido";
  }
} catch (err) {
     throw new Error(`Inscrito: ${err.message}`);
  }
  return inscritoModel;
}

async function _incluirInscrito(inscrito) {

  let retornoInscrito = null;

  if (inscrito == null) {
    throw new Error("Inscrito não pode ser nulo");
  }
  if (inscrito.cnpj_cpf == null || inscrito.cnpj_cpf === "") {
    throw new Error("CNPJ/CPF do inscrito não pode ser vazio");
  } 
  if (inscrito.nome == null || inscrito.nome === "") {
    throw new Error("Nome do inscrito não pode ser vazio");
  } 
  try 
  {
      const result = await inscritoComplementarSrv.getInscritoByCpf(
      inscrito.id_empresa,
      inscrito.cnpj_cpf
      );

     if (result == null)
     {
        
        const inscritoModel = await inscritoSrv.insertInscrito(inscrito);

        if (inscritoModel == null) {

          throw new Error(
            `Erro ao inserir inscrito `
          );
        } else {
             retornoInscrito = inscritoModel;
        }
        
    } else {
      retornoInscrito = result;
     }
  } catch (err) {
    throw new Error(
            `Inscrito: ${err.message}`
          );
  }

  return retornoInscrito
}

async function _incluirParticipante(participante) {

  let retornoParticipante = null;

  if (participante == null) {
    throw new Error("participante não pode ser nulo");
  }
  if (participante.id_empresa == null || participante.id_empresa === 0) {
    throw new Error("ID Empresa não pode ser vazio");
  } 
  if (participante.id_evento == null || participante.id_evento === 0) {
    throw new Error("ID Evento não pode ser vazio");
  } 
  if (participante.id_inscrito == null || participante.id_inscrito === 0) {
    throw new Error("ID Inscrito não pode ser vazio");
  } 
  try 
  {
      const result = await participanteSrv.getParticipante(
      participante.id_empresa,
      participante.id_evento,
      participante.id_inscrito
      );


     if (result == null)
     {
        
        const participanteModel = await participanteSrv.insertParticipante(participante);

        retornoParticipante = participanteModel;
        if (participanteModel == null) {

          throw new Error(
            `Erro ao inserir participante`);
          
        } else {
             retornoParticipante = participanteModel;
        }

      }     
         else {
        retornoParticipante = result;
     }
  } catch (err) {
    throw new Error(
            `Erro ao inserir participante` + err.message
          );
  }

  return retornoParticipante;
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

