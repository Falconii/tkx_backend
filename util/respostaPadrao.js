function success(res, message, data = {}, code = 200) {
  return res.status(code).json({
    status: "success",
    code,
    message,
    data
  });
}

function error(res, message, code = 400, details = null) {
  const response = {
    status: "error",
    code,
    message
  };
  if (details) {
    response.details = details;
  }
  return res.status(code).json(response);
}

function backenderror(res, message, code = 500, details = null) {
  const response = {
    status: "error",
    code,
    message
  };
  if (details) {
    response.details = details;
  }
  return res.status(code).json(response);
}


function validationError(res, missingFields) {
  return error(res, "Parâmetros obrigatórios ausentes", 400, missingFields);
}

function notFound(res, entity, details = {}) {
  return error(res, `${entity} não encontrado`, 404, details);
}

function conflit(res, entity, details = {}) {
  return error(res, `${entity} Já Existe No Cadastro`, 409, details);
}

function backenderror(res, entity, details = {}) {
  return error(res, `${entity} Erro No Sistema!`, 500, details);
}

module.exports = {
  success,
  error,
  validationError,
  notFound,
  conflit,
  backenderror
};