   CREATE OR REPLACE FUNCTION function_participantes_V2()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$
    DECLARE 
         histo_old text;
         histo_atual text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           // Atualiza qtd_participantes
           
           update public.eventos set qtd_participantes = qtd_participantes + 1  where  id_empresa = new.id_empresa and id = new.id_evento ;

           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_evento,new.id,new.id_entrega,NOW(),'insert','participantesv2',new.user_insert,histo_old,histo_atual,new.user_insert,0);  
		   
           
           RETURN NEW;
       END IF;
       
        IF  (TG_OP = 'UPDATE') THEN
            // Atualiza qtd_participantes

           update public.eventos set qtd_participantes = (qtd_participantes - 1) + 1  where  id_empresa = new.id_empresa and id = new.id_evento ;

           
           histo_old   = json_agg(old.*);
           histo_atual = json_agg(new.*);


           insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		           values(new.id_empresa,new.id_evento,new.id,new.id_entrega,NOW(),'update','participantesv2',new.user_update,histo_old,histo_atual,new.user_insert,new.user_update);  
		  

           RETURN NEW;
       END IF;


   IF  (TG_OP = 'DELETE') THEN
          
           // Atualiza qtd_participantes

           update public.eventos set qtd_participantes = (qtd_participantes - 1)   where  id_empresa = old.id_empresa and id = old.id_evento ;

           
            histo_old   = json_agg(old.*);
            histo_atual = '';

            insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		    values(old.id_empresa,old.id_evento,old.id,old.id_entrega,NOW(),'delete','participantesv2',old.user_update,histo_old,histo_atual,old.user_insert,old.user_update);  


           RETURN OLD;
       END IF;

       RETURN NEW;
    END ;
    $$
    GO


DROP TRIGGER IF EXISTS  trigger_participantesv2 ON public.participantesv2;
GO
    
    
    
CREATE TRIGGER trigger_participantesv2
AFTER INSERT OR UPDATE OR DELETE
ON participantesV2
FOR EACH ROW
EXECUTE FUNCTION function_participantes_V2();


insert into participantesv2(
id_empresa,
id_evento,
inscricao,
nro_peito,
id_categoria,
cnpj_cpf,
nome ,
sexo,
data_nasc ,
origem ,
user_insert,
user_update) values (
1,
2,
200200,
120,
2,
'02507867884',
'MARCOS RENATO FALCONI',
'M',
'1964-12-27',
'P',
999,
0
)

DELETE FROM PARTICIPANTESV2 WHERE ID_EVENTO = 2

select * from CATEGORIAS


update eventos set qtd_participantes = 0 


update participantesv2 set id_evento = 14

select * from participantesv2