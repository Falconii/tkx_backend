/* DATA eventos */
const db = require("../../infra/database");

/* A troca de situacao (Trocar Situacao Evento) fica em util/trocaSituacaoEvento.js */


/*
  Eventos que o usuario pode ver no DASHBOARD (sempre so os ATIVOS, status '3'):
    operador = true  -> so os eventos em que ele esta vinculado em usuarios_eventos (ativo = 'S')
    operador = false -> todos os eventos ativos da empresa
  Mesmas colunas de data/eventoData.getEventos (o dashboard usa o EventoModel).
*/
exports.eventosDoDashboard = function (id_empresa, id_usuario, operador, executor = db) {
  const vinculo = operador
    ? `and exists (select 1 from usuarios_eventos ue
                   where ue.id_empresa = evento.id_empresa and ue.id_evento = evento.id
                     and ue.id_usuario = $2 and ue.ativo = 'S')`
    : "";
  const strSql = `select
        evento.id_empresa as id_empresa
      , evento.id as id
      , evento.descricao as descricao
      , evento.id_responsavel as id_responsavel
      , evento.rua as rua
      , evento.nro as nro
      , evento.complemento as complemento
      , evento.bairro as bairro
      , evento.cidade as cidade
      , evento.uf as uf
      , evento.cep as cep
      , to_char(evento.inicio,'DD/MM/YYYY') as inicio
      , to_char(evento.final,'DD/MM/YYYY') as final
      , evento.obs as obs
      , evento.status as status
      , evento.user_insert as user_insert
      , evento.user_update as user_update
      , evento.qtd_participantes as qtd_participantes
      , evento.qtd_kits as qtd_kits
      , usuario.razao as usuario_razao
    from eventos evento
    left join usuarios usuario on usuario.id_empresa = evento.id_empresa and usuario.id = evento.id_responsavel
   where evento.id_empresa = $1 and evento.status = '3' ${vinculo}
   order by evento.descricao, evento.id`;
  return executor.manyOrNone(strSql, [id_empresa, id_usuario]);
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

exports.resumoCategoria = function (id_empresa,id_evento) {
  strSql = `select  categoria.descricao as  categoria_descricao,count(*)::int4 as total
				FROM participantesv2 participante
				inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
				inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
				inner join entregasv2 entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega
			    where participante.id_empresa = ${id_empresa} and participante.id_evento = ${id_evento}	
				group by  categoria.descricao
				order by categoria.descricao; `		
  return db.manyOrNone(strSql);
};


exports.resumoOperador = function (id_empresa,id_evento) {
  strSql = `
			select u.razao,count(*)::int4 as total
			from  entregasv2 e 
			inner join participantesv2 p on p.id_empresa = 1 and p.id_entrega = e.id 
			inner join usuarios u on u.id_empresa = e.id_empresa  and u.id = e.user_insert
			where e.id_empresa = ${id_empresa} and e.id_evento = ${id_evento}
			group by u.razao `;
  return db.manyOrNone(strSql);
};

exports.resumoKit = function (id_empresa,id_evento) {
  strSql = `
			select e.tam_camisa , count(*) ::int4 as total
				from entregasv2 e
				inner join participantesv2 p
				on p.id_empresa = e.id_empresa
				and p.id_evento = e.id_evento
				and p.id_entrega = e.id
				where e.id_empresa = ${id_empresa} and e.id_evento = ${id_evento}
				group by e.tam_camisa 
				order by e.tam_camisa `;
  return db.manyOrNone(strSql);
};
/*
  O evento esta liberado para o usuario operar a ENTREGA DE KITS? (mesma regra do dashboard)
    - evento ATIVO (status '3');
    - OPERADOR: alem disso precisa estar vinculado e ativo em usuarios_eventos.
  Devolve { existe, ativo, vinculado } para a rota escolher a mensagem.
*/
exports.situacaoEventoParaEntrega = async function (id_empresa, id_usuario, id_evento, executor = db) {
  const rows = await executor.any(
    `select evento.status,
            exists (select 1 from usuarios_eventos ue
                     where ue.id_empresa = evento.id_empresa and ue.id_evento = evento.id
                       and ue.id_usuario = $3 and ue.ativo = 'S') as vinculado
       from eventos evento
      where evento.id_empresa = $1 and evento.id = $2`,
    [id_empresa, id_evento, id_usuario],
  );
  if (rows.length === 0) return { existe: false, ativo: false, vinculado: false };
  return { existe: true, ativo: rows[0].status === "3", vinculado: rows[0].vinculado };
};
