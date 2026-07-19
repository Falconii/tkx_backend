  CREATE OR REPLACE FUNCTION function_entregasv2()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$
    DECLARE 
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = qtd_kits + 1
           where id_empresa = new.id_empresa and id = new.id_evento;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = (qtd_kits - 1) + 1
           where id_empresa = new.id_empresa and id = new.id_evento;
           RETURN NEW;       
       END IF;
       IF  (TG_OP = 'DELETE') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = qtd_kits - 1
           where id_empresa = old.id_empresa and id = old.id_evento;
           RETURN OLD;    
       END IF ;
       RETURN NEW;
      END;
    $$
    GO


    DROP TRIGGER IF EXISTS  trigger_entregasv2 ON public.entregasv2;
    GO

    CREATE TRIGGER trigger_entregasv2
      AFTER INSERT OR UPDATE OR DELETE 
      ON entregasv2
      FOR EACH ROW
      EXECUTE PROCEDURE function_entregasv2()
    go
