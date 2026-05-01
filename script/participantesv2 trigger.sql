    CREATE OR REPLACE FUNCTION function_participantes_V2()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$

    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           // Atualiza qtd_participantes
           
           update public.eventos set qtd_participantes = qtd_participantes + 1  where  id_empresa = new.id_empresa and id = new.id_evento ;
           
           RETURN NEW;
       END IF;
       
        IF  (TG_OP = 'UPDATE') THEN
            // Atualiza qtd_participantes

           update public.eventos set qtd_participantes = (qtd_participantes - 1) + 1  where  id_empresa = new.id_empresa and id = new.id_evento ;

           RETURN NEW;
       END IF;


   IF  (TG_OP = 'DELETE') THEN
          
           // Atualiza qtd_participantes

           update public.eventos set qtd_participantes = (qtd_participantes - 1)   where  id_empresa = old.id_empresa and id = old.id_evento ;

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