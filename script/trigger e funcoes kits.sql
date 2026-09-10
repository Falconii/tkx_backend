  CREATE OR REPLACE FUNCTION function_entregasv2()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$
    DECLARE 
      histo_old text;
      histo_atual text;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = qtd_kits + 1
           where id_empresa = new.id_empresa and id = new.id_evento;

           histo_old   = '';
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		       values(new.id_empresa,new.id_evento,0,new.id,NOW(),'insert','entregasv2',new.user_insert,histo_old,histo_atual,new.user_insert,0);  

           RETURN NEW;
       END IF;
       IF  (TG_OP = 'UPDATE') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = (qtd_kits - 1) + 1
           where id_empresa = new.id_empresa and id = new.id_evento;

           histo_old   = json_agg(old.*);
           histo_atual = json_agg(new.*);

           insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		       values(new.id_empresa,new.id_evento,0,new.id,NOW(),'update','entregasv2',new.user_insert,histo_old,histo_atual,new.user_insert,new.user_update);  


           RETURN NEW;       
       END IF;
       IF  (TG_OP = 'DELETE') THEN
           /* atualiza eventos qtd_kits */
           update public.eventos
           set qtd_kits = qtd_kits - 1
           where id_empresa = old.id_empresa and id = old.id_evento;

          histo_old   = json_agg(old.*);
          histo_atual = '';

          insert into auditorias(id_empresa,id_evento,id_participante,id_kit,dtacao,acao,escopo,id_usuario,histo_antes,histo_atual,user_insert,user_update)
		      values(old.id_empresa,old.id_evento,0,old.id,NOW(),'delete','entregasv2',old.user_update,histo_old,histo_atual,old.user_insert,old.user_update);  

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
