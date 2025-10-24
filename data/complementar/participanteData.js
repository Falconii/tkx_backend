/* Troca De Usuário */
const db = require('../../infra/database');

exports.trocaParticipante = function(participante,new_id_inscrito){
	strSql = `update   participantes set   
		     id_inscrito = ${new_id_inscrito}		
 		 ,   id_old_inscrito = ${participante.id_inscrito} 
 		 ,   user_update = ${participante.user_update} 
 		 where id_empresa = ${participante.id_empresa} and  id_evento = ${participante.id_evento} and  id_inscrito = ${participante.id_inscrito}  returning * `;
    console.log(strSql);
	return  db.oneOrNone(strSql);
};
