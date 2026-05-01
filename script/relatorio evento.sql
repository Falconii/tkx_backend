select
                           participante.inscricao as  inscricao
                        ,  participante.nro_peito as  nro_peito
                        ,  evento.descricao as  evento_descricao
                        ,  inscrito.nome as  inscrito_nome
                        ,  inscrito.cnpj_cpf as  inscrito_cpf
                        ,  to_char(inscrito.data_nasc,'DD-MM-YYYY') as  inscrito_dt_nascimento
                        ,  inscrito.sexo      as  inscrito_sexo
                        ,  categoria.descricao as  categoria_descricao
                        ,  coalesce(entre.rg_retirada,'') as  entre_rg
                        ,  coalesce(entre.nome_retirada,'') as  entre_nome
                        ,  coalesce(entre.tam_camisa,'') as  entre_tam_camisa
                        FROM participantes participante
                                 inner join eventos evento on evento.id_empresa = participante.id_empresa and evento.id = participante.id_evento
                                 inner join inscritos inscrito on inscrito.id_empresa = evento.id_empresa and inscrito.id = participante.id_inscrito
                                 inner join categorias categoria on categoria.id_empresa = participante.id_empresa and categoria.id = participante.id_categoria
                                 left  join entregas entre on entre.id_empresa = participante.id_empresa and entre.id_evento = participante.id_evento and entre.id_inscrito = participante.id_inscrito
                                 left join links link on link.id_empresa = participante.id_empresa and link.id_evento = participante.id_evento and link.id_inscrito = participante.id_old_inscrito
                                 left join inscritos old on old.id_empresa = participante.id_empresa  and old.id  = participante.id_old_inscrito
                         where participante.id_empresa = 1  and participante.id_evento = 6                  
                          order by participante.id_empresa,participante.id_evento,participante.inscricao --limit 100 offset((1 -1) * 100)
