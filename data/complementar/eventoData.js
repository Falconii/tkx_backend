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



exports.consultaEvento01 = function (evento) {
  strSql = `select                  
					evento.descricao as  evento_descricao
				,  participante.inscricao as  inscricao
				,  participante.nome as  inscrito_nome
				,  participante.cnpj_cpf as  inscrito_cpf
				,  to_char(participante.data_nasc,'DD-MM-YYYY') as  inscrito_dt_nascimento
				,  participante.sexo      as  inscrito_sexo
				,  participante.nro_peito as  nro_peito
				,  categoria.descricao as  categoria_descricao
				,  coalesce(entre.rg_retirada,'') as  entre_rg
				,  coalesce(entre.nome_retirada,'') as  entre_nome
				,  coalesce(entre.tam_camisa,'') as  entre_tam_camisa
				FROM participantesv2 participante
							inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
							inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
							left  join entregasv2 entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega
			    where participante.id_empresa = ${evento.id_empresa} and participante.id_evento = ${evento.id}	;`			
  return db.manyOrNone(strSql);
};

exports.resumoCategoria = function (evento) {
  strSql = `select  categoria.descricao as  categoria_descricao,count(*) as total
				FROM participantesv2 participante
				inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				left  join entregasv2 entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega
			    where participante.id_empresa = ${evento.id_empresa} and participante.id_evento = ${evento.id}	
				group by  categoria.descricao
				order by categoria.descricao; `		
  return db.manyOrNone(strSql);
};