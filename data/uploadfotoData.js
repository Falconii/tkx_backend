/* DATA entregas */
const db = require('../infra/database');

/* CRUD GET */
exports.saveFoto = function(originalname, buffer){

	  return  db.query(
      "INSERT INTO fotos (nome, imagem) VALUES ($1, $2)",
      [originalname, buffer]
    );

}


exports.saveFotoV2 = function(id_empresa,id_evento,originalname, buffer,user_insert){

	  return  db.query(
      "INSERT INTO fotos (id_empresa,id_evento,file_name, imagem,user_insert,user_update) VALUES ($1, $2, $3, $4,$5,$6)",
      [id_empresa,id_evento,originalname, buffer,user_insert,0]
    );

}


exports.getFoto = function(id){
    
	return db.query('SELECT nome, imagem FROM fotos WHERE id = $1', [id]);

}


exports.getFotoV2 = function(id_empresa,id_evento,id){
    
	return db.query('SELECT id_empresa,id_evento,file_name, imagem FROM fotos WHERE id_empresa = $1 and id_evento = $2 and id = $3', [id_empresa,id_evento,id]);

}


exports.deleteFoto = function(id_empresa,id_evento,id){
    
	return db.query('DELETE FROM FOTOS  WHERE id_empresa = $1 and id_evento = $2 and id = $3', [id_empresa,id_evento,id]);

}
