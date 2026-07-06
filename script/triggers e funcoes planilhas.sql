  CREATE OR REPLACE FUNCTION function_detplanilhas()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$
    DECLARE 
        _old_linha_processada int4;
        _old_linha_erro  int4 ;
        _linha_processada   int4;
        _linha_erro   int4;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           _linha_processada := 0;
           _linha_erro      := 0;
           if (new.status = 9) then
              begin
                 _linha_erro := 1;
              end;
           else 
             begin
                _linha_processada := 1;
             end;   
           end if;  
           /* atualiza cabplanilhas total_linhas */
           update public.cabplanilhas
           set total_linhas = total_linhas + 1, 
               linhas_processadas = linhas_processadas + _linha_processada,
               total_linhas_erro = total_linhas_erro + _linha_erro
           where id_empresa = new.id_empresa and id = new.id_cabec;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
           _old_linha_processada := 0;
           _old_linha_erro      := 0;
           _linha_processada := 0;
           _linha_erro      := 0;
           if (old.status = 9) then
              begin
                 _old_linha_erro := 1;
              end;
           else 
             begin
                _old_linha_processada := 1;
             end;   
           end if;  
           
           if (new.status = 9) then
              begin
                 _linha_erro := 1;
              end;
           else 
             begin
                _linha_processada := 1;
             end;   
           end if;  
           /* atualiza cabplanilhas total_linhas */
           update public.cabplanilhas
           set linhas_processadas = (linhas_processadas - _old_linha_processada) + _linha_processada,
               total_linhas_erro = (total_linhas_erro - _old_linha_erro)  + _linha_erro
           where id_empresa = new.id_empresa and id = new.id_cabec;
           RETURN NEW;
       END IF;
       IF  (TG_OP = 'DELETE') THEN
           _linha_processada := 0;
           _linha_erro      := 0;
           if (old.status = 9) then
              begin
                 _linha_erro := 1;
              end;
           else 
             begin
                _linha_processada := 1;
             end;   
           end if;  
           /* atualiza cabplanilhas total_linhas */
           update public.cabplanilhas
           set total_linhas = total_linhas - 1, 
               linhas_processadas = linhas_processadas - _linha_processada,
               total_linhas_erro = total_linhas_erro - _linha_erro
           where id_empresa = old.id_empresa and id = old.id_cabec;
           return old;
       END IF;
       RETURN NEW;
    END ;
    $$
    GO


    DROP TRIGGER IF EXISTS  trigger_detplanilhas ON public.detplanilhas;
    GO

    CREATE TRIGGER trigger_detplanilhas
      AFTER INSERT OR UPDATE OR DELETE 
      ON detplanilhas
      FOR EACH ROW
      EXECUTE PROCEDURE function_detplanilhas()
    go
