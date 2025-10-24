
const jwt = require('jsonwebtoken');
const cabPlanilhaSrv = require('../service/cabplanilhaService.js')
const inscritoComplementarSrv = require('../service/complementar/inscritoService.js')
const inscritoSrv = require('../service/inscritoService.js')
function adicionaZero(numero) {
  if (numero <= 9) return "0" + numero;
  else return "" + numero;
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
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
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
    return [date[2], date[1], date[0]].join("-") ;
  } else {
    return date.yyyymmdd();
  }
};

exports.IfNUllNoAspas = function (date) {
  if (date == "null") return "null";

  return `'${date}'`;
};

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    this.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("-");
};

exports.formatDateHour = function (date) {
  return date;
};

exports.excluirCaracteres = function (value) {
  const searchRegExp = /'/g;
  let retorno = value.replace(searchRegExp, "''");
  retorno = retorno.replace(/\r?\n|\r/g, " ");
  return retorno;
};

exports.excluirVirgulasePontos = function (value) {
  let retorno = "";
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
  const semAcento = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return semAcento;
};



exports.verifyToken = async function(token, ACCESS_SECRET) {
  return new Promise((resolve) => {
    jwt.verify(token, ACCESS_SECRET, (err, payload) => {
      console.log("Verificando token: ", payload);
      if (err) {
        if (err.name === 'TokenExpiredError') {
          resolve({ status: 401, mensagem: 'Token expirado', id_empresa:0,id_usuario:0})
        } else if (err.name === 'JsonWebTokenError') {
          resolve({ status: 403, mensagem: 'Token inválido', id_empresa:0,id_usuario: 0 });
        } else {    
           resolve({ status: 403, mensagem: `Token inválido ${err.message}`,id_empresa:0, id_usuario: 0 });
        }
      } else {
        resolve({ status: 200, mensagem: 'Token OK', id_empresa:payload.id_empresa,id_usuario: payload.id_usuario });
      }
    });
  });
};


exports.limparCnpj_Cpf= function limparDocumento(valor) {
  return valor.replace(/\D/g, '');
}



exports.verfica_planilha =  async function (id_empresa,id_evento,fileName) {

    const par = {
		"id_empresa":id_empresa, 
		"id_evento":id_evento, 
		"id":0, 
		"arquivo": fileName, 
		"pagina":0, 
		"tamPagina":50, 
		"contador":"N", 
		"orderby":"", 
		"sharp":false 
	}
  
  const result = await cabPlanilhaSrv.getCabplanilhas(par);

  if (result != null && result.length > 0) {
      return { existe : true }
  }   else 
    {
       return {existe : false }
  }
}


exports.isValidDate = function (dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}



exports._incluirInscrito = async  function _incluirInscrito(inscrito) {

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

     if (result == null || result.length == 0)
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
      retornoInscrito = result[0];
     }
  } catch (err) {
    throw new Error(
            `Inscrito: ${err.message}`
          );
  }

  return retornoInscrito
}

exports._incluirParticipante = async function(participante) {

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