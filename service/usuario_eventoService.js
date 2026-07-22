/* SERVICE usuarios_eventos */
const usuario_eventoData = require('../data/usuario_eventoData');
const validacao = require('../util/validacao');
const parametros = require('../util/usuario_eventoParametros');
const erroDB = require('../util/userfunctiondb');
const regras = require('../util/usuario_eventoRegra');
const TABELA = 'USUARIOS_EVENTOS';
/* CRUD GET SERVICE */
exports.getUsuario_Evento = async function(id_empresa,id_evento,id_usuario){
	return usuario_eventoData.getUsuario_Evento(id_empresa,id_evento,id_usuario);
};
/* CRUD GET ALL SERVICE */
exports.getUsuarios_Eventos = async function(params){
	return usuario_eventoData.getUsuarios_Eventos(params);
};
//* CRUD - INSERT - SERVICE */
 exports.insertUsuario_Evento = async function(usuario_evento){
try 
{
	await regras.usuario_evento_Inclusao(usuario_evento);
	validacao.Validacao(TABELA,usuario_evento, parametros.usuarios_eventos());
	return usuario_eventoData.insertUsuario_Evento(usuario_evento);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - UPDATE - SERVICE */
 exports.updateUsuario_Evento = async function(usuario_evento){try 
{
	await regras.usuario_evento_Alteracao(usuario_evento);
	validacao.Validacao(TABELA,usuario_evento, parametros.usuarios_eventos());
	return usuario_eventoData.updateUsuario_Evento(usuario_evento);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
//* CRUD - DELETE - SERVICE */
 exports.deleteUsuario_Evento = async function(id_empresa,id_evento,id_usuario){try 
{
	await  regras.usuario_evento_Exclusao(id_empresa,id_evento,id_usuario);
	return usuario_eventoData.deleteUsuario_Evento(id_empresa,id_evento,id_usuario);
}
catch (err)
{ 
	throw new erroDB.UserException(err.erro, err); 
}
 };
