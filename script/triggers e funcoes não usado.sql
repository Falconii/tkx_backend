
DROP TYPE IF EXISTS categorias_plan;
go
CREATE TYPE categorias_plan AS 
    (
        id_empresa   int4,
	    id_categoria int4,
	    contador     int4,
	    sigla        varchar(10) 
    );
go


CREATE OR REPLACE FUNCTION public.popula_contadores(_id_empresa integer, _id_evento integer, _id_planilha integer, OUT _contador integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$ DECLARE

        categorias    categorias_plan%ROWTYPE;


        BEGIN

          _contador := 0;

          FOR categorias in  
     
                select det.id_empresa,det.id_categoria,cat.contador,cat.sigla from detplanilhas det
                inner join categorias cat on det.id_empresa = cat.id_empresa and det.id_categoria = cat.id 
                where det.id_empresa = _id_empresa and det.id_evento = _id_evento and det.id_cabec = _id_planilha and det.id_categoria > 0 and det.status = 0
                group by det.id_empresa,det.id_categoria,cat.contador,cat.sigla
                order by det.id_empresa,det.id_categoria
            
                LOOP      
                   
                   RAISE NOTICE 'ID_EMPRESA % ID_CATEGORIA % CONTADOR % SIGLA %',
                   categorias.id_empresa , categorias.id_categoria , categorias.contador , categorias.sigla ;
                   
                   insert into public.categoriacontadores
                   (id_empresa, 
                    id_evento, 
                    id_categoria, 
                    contador, 
                    user_insert, 
                    user_update
                    ) values (
                    _id_empresa,
                    _id_evento,
                    categorias.id_categoria,
                    categorias.contador * 1000,
                    1,
                    0
                    ) ON CONFLICT do nothing;
        
                   _contador := _contador + 1;

              END LOOP;

        END;
        $function$
;

go


    /*

       trigger participantes - nro_peito

    */

    CREATE OR REPLACE FUNCTION function_participante_nro()
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
      AS
    $$
    DECLARE 
       _nro_peito   int4;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           // Atualiza nro do peito
           select coalesce(contador,0) from public.categoriacontadores into _nro_peito where id_empresa = new.id_empresa and id_evento = new.id_evento and id_categoria = new.id_categoria;
           new.nro_peito := _nro_peito;
           _nro_peito :=  _nro_peito + 1;
           update public.categoriacontadores 
           set contador = _nro_peito where id_empresa = new.id_empresa and id_evento = new.id_evento and id_categoria = new.id_categoria;
           RETURN NEW;
       END IF;
       RETURN NEW;
    END ;
    $$
    GO


    DROP TRIGGER IF EXISTS  trigger_participantes ON public.participantes;
    GO

    CREATE TRIGGER trigger_participantes
      BEFORE INSERT 
      ON participantes
      FOR EACH ROW
      EXECUTE PROCEDURE function_participante_nro()
    go

