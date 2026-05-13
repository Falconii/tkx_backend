/* DATA entregasv2 */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Entrega){
return [ 
			Entrega.id_empresa, 
			Entrega.id_evento, 
			Entrega.id, 
			Entrega.rg_retirada, 
			Entrega.nome_retirada, 
			Entrega.tam_camisa, 
			Entrega.data_retirada, 
			Entrega.id_recepcao, 
			Entrega.id_entrega, 
			Entrega.id_kit, 
			Entrega.user_insert, 
			Entrega.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getEntrega = function(id_empresa,id_evento,id){
	strSql = ` select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id as  id  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.id_recepcao as  id_recepcao  
			,  entrega.id_entrega as  id_entrega  
			,  entrega.id_kit as  id_kit  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update    
 			FROM entregasv2 entrega 	     
			 where entrega.id_empresa = ${id_empresa} and  entrega.id_evento = ${id_evento} and  entrega.id = ${id}  `;
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
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id = ${params.id} `;
	}
	if(params.id_recepcao  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_recepcao = ${params.id_recepcao} `;
	}
	if(params.id_entrega  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_entrega = ${params.id_entrega} `;
	}
	if(params.id_kit  !== 0 ){
		if (where != "") where += " and "; 
		where += `entrega.id_kit = ${params.id_kit} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM entregasv2 entrega      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id as  id  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.id_recepcao as  id_recepcao  
			,  entrega.id_entrega as  id_entrega  
			,  entrega.id_kit as  id_kit  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update     
			FROM entregasv2 entrega      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   entrega.id_empresa as  id_empresa  
			,  entrega.id_evento as  id_evento  
			,  entrega.id as  id  
			,  entrega.rg_retirada as  rg_retirada  
			,  entrega.nome_retirada as  nome_retirada  
			,  entrega.tam_camisa as  tam_camisa  
			, to_char(entrega.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entrega.id_recepcao as  id_recepcao  
			,  entrega.id_entrega as  id_entrega  
			,  entrega.id_kit as  id_kit  
			,  entrega.user_insert as  user_insert  
			,  entrega.user_update as  user_update    
			FROM entregasv2 entrega			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertEntrega = function(entrega){
	strSql = `insert into entregasv2 (
		     id_empresa 
		 ,   id_evento 
		 ,   id 
		 ,   rg_retirada 
		 ,   nome_retirada 
		 ,   tam_camisa 
		 ,   data_retirada 
		 ,   id_recepcao 
		 ,   id_entrega 
		 ,   id_kit 
		 ,   user_insert 
		 ,   user_update 
		 ) 
		 values(
		     ${entrega.id_empresa} 
		 ,   ${entrega.id_evento} 
		 ,   ${entrega.id} 
		 ,   '${entrega.rg_retirada}' 
		 ,   '${entrega.nome_retirada}' 
		 ,   '${entrega.tam_camisa}' 
		 ,   '${entrega.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   ${entrega.id_recepcao} 
		 ,   ${entrega.id_entrega} 
		 ,   ${entrega.id_kit} 
		 ,   ${entrega.user_insert} 
		 ,   ${entrega.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateEntrega = function(entrega){
	strSql = `update   entregasv2 set  
		     rg_retirada = '${entrega.rg_retirada}' 
 		 ,   nome_retirada = '${entrega.nome_retirada}' 
 		 ,   tam_camisa = '${entrega.tam_camisa}' 
 		 ,   data_retirada = '${entrega.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   id_recepcao = ${entrega.id_recepcao} 
 		 ,   id_entrega = ${entrega.id_entrega} 
 		 ,   id_kit = ${entrega.id_kit} 
 		 ,   user_insert = ${entrega.user_insert} 
 		 ,   user_update = ${entrega.user_update} 
 		 where id_empresa = ${entrega.id_empresa} and  id_evento = ${entrega.id_evento} and  id = ${entrega.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteEntrega = function(id_empresa,id_evento,id){
	strSql = `delete from entregasv2 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


