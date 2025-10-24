/* DATA entregas */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Entrega){
return [ 
			Entrega.id_empresa, 
			Entrega.id_evento, 
			Entrega.id_inscrito, 
			Entrega.rg_retirada, 
			Entrega.nome_retirada, 
			Entrega.tam_camisa, 
			Entrega.data_retirada, 
			Entrega.user_insert, 
			Entrega.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getEntrega = function(id_empresa,id_evento,id_inscrito){
	strSql = ` select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id_inscrito as  id_inscrito  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update    
 			FROM entregas entrega 	     
			 where entrega.id_empresa = ${id_empresa} and  entrega.id_evento = ${id_evento} and  entrega.id_inscrito = ${id_inscrito}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getEntregas = function(params){
if (params) {
	where = "";
	orderby = "";
	paginacao = "";

	if(params.orderby == '') orderby = 'entrega.id_empresa,entrega.id_evento';
	if(params.orderby == '000000') orderby = 'entrega.id_empresa,entrega.id_evento';
	if(params.orderby == '000001') orderby = 'entrega.id_empresa,entrega.id_evento,kit.id_inscrito';

	if (orderby != "") orderby = " order by " + orderby;
	if(params.id_empresa  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_evento = ${params.id_evento} `;
	}
	if(params.id_inscrito  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_inscrito = ${params.id_inscrito} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM entregas entrega      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id_inscrito as  id_inscrito  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update     
			FROM entregas entrega      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id_inscrito as  id_inscrito  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update    
			FROM entregas entrega			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertEntrega = function(entrega){
	strSql = `insert into entregas (
		     id_empresa 
		 ,   id_evento 
		 ,   id_inscrito 
		 ,   rg_retirada 
		 ,   nome_retirada 
		 ,   tam_camisa 
		 ,   data_retirada 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${entrega.id_empresa} 
		 ,   ${entrega.id_evento} 
		 ,   ${entrega.id_inscrito} 
		 ,   '${entrega.rg_retirada}' 
		 ,   '${entrega.nome_retirada}' 
		 ,   '${entrega.tam_camisa}' 
		 ,   '${entrega.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   ${entrega.user_insert} 
		 ,   ${entrega.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateEntrega = function(entrega){
	strSql = `update   entregas set  
		     rg_retirada = '${entrega.rg_retirada}' 
 		 ,   nome_retirada = '${entrega.nome_retirada}' 
 		 ,   tam_camisa = '${entrega.tam_camisa}' 
 		 ,   data_retirada = '${entrega.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   user_insert = ${entrega.user_insert} 
 		 ,   user_update = ${entrega.user_update} 
 		 where id_empresa = ${entrega.id_empresa} and  id_evento = ${entrega.id_evento} and  id_inscrito = ${entrega.id_inscrito}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteEntrega = function(id_empresa,id_evento,id_inscrito){
	strSql = `delete from entregas 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id_inscrito = ${id_inscrito}  `;
 	return  db.oneOrNone(strSql);
}


