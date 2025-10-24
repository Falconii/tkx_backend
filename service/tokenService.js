/* SERVICE tokens */
const tokenData = require('../data/tokenData');
const validacao = require('../util/validacao');
const parametros = require('../util/tokenParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/tokenRegra');
const shared = require('../util/shared');
const jwt = require('jsonwebtoken');
const ACCESS_SECRET = 'access-secret';
const REFRESH_SECRET = 'refresh-secret';
const TABELA = 'TOKENS';
/* CRUD GET SERVICE */
exports.getToken = async function(id_empresa,id_usuario,token,tipo){
	return tokenData.getToken(id_empresa,id_usuario,token,tipo);
};
/* CRUD GET ALL SERVICE */
exports.getTokens = async function(params){
	return tokenData.getTokens(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertToken = async function(token){
try 
{
	console.log("Inserting token:", token);
	await regras.token_Inclusao(token);
	validacao.Validacao(TABELA,token, parametros.tokens());
	return tokenData.insertToken(token);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateToken = async function(token){
try 
{
	await regras.token_Alteracao(token);
	validacao.Validacao(TABELA,token, parametros.tokens());
	return tokenData.updateToken(token);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteToken = async function(id_empresa,id_usuario,token,tipo){
try 
{
	await  regras.token_Exclusao(id_empresa,id_usuario,token,tipo);
	return tokenData.deleteToken(id_empresa,id_usuario,token,tipo);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };


  exports.deleteTokenByUser = async function(id_empresa,id_usuario){
try 
{
	return tokenData.deleteTokenByUser(id_empresa,id_usuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };

exports.generateAccessToken =  function(user) {
  return jwt.sign({ id_empresa:user.id_empresa,id_usuario: user.id }, ACCESS_SECRET, { expiresIn: '7d' });
}

exports.generateRefreshToken = function(user) {
  return jwt.sign({id_empresa:user.id_empresa, id_usuario: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
}


exports.getTokenOnly = function(id_empresa, token) {
  return tokenData.getTokenOnly(id_empresa, token);
}
 

 
exports.verifyToken =  async function(token) {
  try {
    const result = await shared.verifyToken (token, ACCESS_SECRET);
    return result
  } catch (err) {
    return { status: 403, mensagem: `Token inválido ${err}`, id_usuario: 0 };
  }
};

exports.createTokenByDate = function(id_empresa, id_evento, id_usuario, date) {
  // Validação do formato da data: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error('Formato de data inválido. Use YYYY-MM-DD.');
  }

  // Cria a data com horário fixo de 23:59:59
  const targetDate = new Date(`${date}T23:59:59`);

  // Verifica se a data é válida
  if (isNaN(targetDate.getTime())) {
    throw new Error('Data inválida. Verifique se o valor corresponde a uma data real.');
  }

  // Converte para timestamp UNIX em segundos
  const exp = Math.floor(targetDate.getTime() / 1000);

  // Monta o payload do token
  const payload = {
    id_empresa,
    id_evento,
    id_usuario,
    exp
  };

  // Gera o token
  const token = jwt.sign(payload, ACCESS_SECRET);

  return token;
};