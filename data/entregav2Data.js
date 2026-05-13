/* DATA entregasv2 */
const db = require('../infra/database');

/* GET CAMPOS */
exports.getCampos = function(Entregav2){
return [ 
			Entregav2.id_empresa, 
			Entregav2.id_evento, 
			Entregav2.id, 
			Entregav2.rg_retirada, 
			Entregav2.nome_retirada, 
			Entregav2.tam_camisa, 
			Entregav2.data_retirada, 
			Entregav2.id_recepcao, 
			Entregav2.id_entrega, 
			Entregav2.id_kit, 
			Entregav2.user_insert, 
			Entregav2.user_update, 
 ]; 
}; 
/* CRUD GET */
exports.getEntregav2 = function(id_empresa,id_evento,id){
	strSql = ` select   
			   entregav2.id_empresa as  id_empresa  
			,  entregav2.id_evento as  id_evento  
			,  entregav2.id as  id  
			,  entregav2.rg_retirada as  rg_retirada  
			,  entregav2.nome_retirada as  nome_retirada  
			,  entregav2.tam_camisa as  tam_camisa  
			, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entregav2.id_recepcao as  id_recepcao  
			,  entregav2.id_entrega as  id_entrega  
			,  entregav2.id_kit as  id_kit  
			,  entregav2.user_insert as  user_insert  
			,  entregav2.user_update as  user_update    
 			FROM entregasv2 entregav2 	     
			 where entregav2.id_empresa = ${id_empresa} and  entregav2.id_evento = ${id_evento} and  entregav2.id = ${id}  `;
	return  db.oneOrNone(strSql);
}
/* CRUD GET ALL*/
exports.getEntregasv2 = function(params){
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
		where += `entregav2.id_empresa = ${params.id_empresa} `;
	}
	if(params.id_evento  !== 0 ){
		if (where != "") where += " and "; 
		where += `entregav2.id_evento = ${params.id_evento} `;
	}
	if(params.id  !== 0 ){
		if (where != "") where += " and "; 
		where += `entregav2.id = ${params.id} `;
	}
	if(params.id_recepcao  !== 0 ){
		if (where != "") where += " and "; 
		where += `entregav2.id_recepcao = ${params.id_recepcao} `;
	}
	if(params.id_entrega  !== 0 ){
		if (where != "") where += " and "; 
		where += `entregav2.id_entrega = ${params.id_entrega} `;
	}
	if(params.id_kit  !== 0 ){
		if (where != "") where += " and "; 
		where += `entregav2.id_kit = ${params.id_kit} `;
	}
	if (where != "") where = " where " + where;
	 if (params.pagina != 0) {
		paginacao = `limit ${params.tamPagina} offset((${params.pagina} -1) * ${params.tamPagina})`;
	}
	if (params.contador == 'S') {
		sqlStr = `SELECT COALESCE(COUNT(*),0) as total 
				  FROM entregasv2 entregav2      
				  ${ where} `;
		return db.one(sqlStr);
	}  else {
		strSql = `select   
			   entregav2.id_empresa as  id_empresa  
			,  entregav2.id_evento as  id_evento  
			,  entregav2.id as  id  
			,  entregav2.rg_retirada as  rg_retirada  
			,  entregav2.nome_retirada as  nome_retirada  
			,  entregav2.tam_camisa as  tam_camisa  
			, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entregav2.id_recepcao as  id_recepcao  
			,  entregav2.id_entrega as  id_entrega  
			,  entregav2.id_kit as  id_kit  
			,  entregav2.user_insert as  user_insert  
			,  entregav2.user_update as  user_update     
			FROM entregasv2 entregav2      
			${where} 			${ orderby} ${ paginacao} `;
			return  db.manyOrNone(strSql);
		}	}  else {
		strSql = `select   
			   entregav2.id_empresa as  id_empresa  
			,  entregav2.id_evento as  id_evento  
			,  entregav2.id as  id  
			,  entregav2.rg_retirada as  rg_retirada  
			,  entregav2.nome_retirada as  nome_retirada  
			,  entregav2.tam_camisa as  tam_camisa  
			, to_char(entregav2.data_retirada, 'YYYY-MM-DD HH24:MI GMT-0300') as data_retirada  
			,  entregav2.id_recepcao as  id_recepcao  
			,  entregav2.id_entrega as  id_entrega  
			,  entregav2.id_kit as  id_kit  
			,  entregav2.user_insert as  user_insert  
			,  entregav2.user_update as  user_update    
			FROM entregasv2 entregav2			     `;
		return  db.manyOrNone(strSql);
	}
}
/* CRUD - INSERT */
 exports.insertEntregav2 = function(entregav2){
	strSql = `insert into entregasv2 (
		     id_empresa 
		 ,   id_evento 
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
		     ${entregav2.id_empresa} 
		 ,   ${entregav2.id_evento} 
		 ,   '${entregav2.rg_retirada}' 
		 ,   '${entregav2.nome_retirada}' 
		 ,   '${entregav2.tam_camisa}' 
		 ,   '${entregav2.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
		 ,   ${entregav2.id_recepcao} 
		 ,   ${entregav2.id_entrega} 
		 ,   ${entregav2.id_kit} 
		 ,   ${entregav2.user_insert} 
		 ,   ${entregav2.user_update} 
		 ) 
 returning * `;
	return db.oneOrNone(strSql);
};
/* CRUD - UPDATE */
 exports.updateEntregav2 = function(entregav2){
	strSql = `update   entregasv2 set  
		     rg_retirada = '${entregav2.rg_retirada}' 
 		 ,   nome_retirada = '${entregav2.nome_retirada}' 
 		 ,   tam_camisa = '${entregav2.tam_camisa}' 
 		 ,   data_retirada = '${entregav2.data_retirada.replace('GMT-0300', '').replace('T', ' ').replace('Z', '')}' 
 		 ,   id_recepcao = ${entregav2.id_recepcao} 
 		 ,   id_entrega = ${entregav2.id_entrega} 
 		 ,   id_kit = ${entregav2.id_kit} 
 		 ,   user_insert = ${entregav2.user_insert} 
 		 ,   user_update = ${entregav2.user_update} 
 		 where id_empresa = ${entregav2.id_empresa} and  id_evento = ${entregav2.id_evento} and  id = ${entregav2.id}  returning * `;
	return  db.oneOrNone(strSql);
}
/* CRUD - DELETE */
 exports.deleteEntregav2 = function(id_empresa,id_evento,id){
	strSql = `delete from entregasv2 
		 where id_empresa = ${id_empresa} and  id_evento = ${id_evento} and  id = ${id}  `;
 	return  db.oneOrNone(strSql);
}


