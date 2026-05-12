    CREATE OR REPLACE FUNCTION function_cabplanilhas()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$

    BEGIN
      
    IF  (TG_OP = 'DELETE') THEN
            
            //Exclui detalhes da planilha

            delete from  detplanilhas   where  id_empresa = old.id_empresa and id_cabec = old.id ;

            RETURN OLD;
        END IF;

        RETURN NEW;
        END ;
    $$
    GO


DROP TRIGGER IF EXISTS  trigger_cabplanilhas ON public.cabplanilhas;
GO
    
    
    
CREATE TRIGGER trigger_cabplanilhas
AFTER DELETE
ON cabplanilhas
FOR EACH ROW
EXECUTE FUNCTION function_cabplanilhas();
