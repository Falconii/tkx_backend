select
                           participante.inscricao as  inscricao
                        ,  participante.nro_peito as  nro_peito
                        ,  evento.descricao as  evento_descricao
                        ,  participante.nome as  nome
                        ,  participante.cnpj_cpf as  cpf
                        ,  to_char(participante.data_nasc,'DD-MM-YYYY') as  dt_nascimento
                        ,  participante.sexo      as  sexo
                        ,  categoria.descricao as  categoria_descricao
                        ,  coalesce(entre.rg_retirada,'') as  entre_rg
                        ,  coalesce(entre.nome_retirada,'') as  entre_nome
                        ,  coalesce(entre.tam_camisa,'') as  entre_tam_camisa
                        FROM participantesv2 participante 
                                 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
                                 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
                                 left  join entregasv2  entre  on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id = participante.id_entrega
                        where participante.id_empresa = 1  and participante.id_evento = 3                
                          order by participante.id_empresa,participante.id_evento,participante.inscricao --limit 100 offset((1 -1) * 100)
//OPERADORES
select u.razao,count(*)
    from  entregasv2 e 
    inner join participantesv2 p on p.id_empresa = 1 and p.id_entrega = e.id 
    inner join usuarios u on u.id_empresa = e.id_empresa  and u.id = e.user_insert
    where e.id_evento = 3
    group by u.razao
    