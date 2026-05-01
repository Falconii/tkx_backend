/* DATA eventos */
const db = require("../../infra/database");

/* CRUD - UPDATE */
exports.updateStatusEvento = function (evento) {
  strSql = `update   eventos set   
 		 ,   status = '${evento.status}' 
 		 ,   user_insert = ${evento.user_insert} 
 		 ,   user_update = ${evento.user_update} 
 		 where id_empresa = ${evento.id_empresa} and  id = ${evento.id}  returning * `;
  return db.oneOrNone(strSql);
};
