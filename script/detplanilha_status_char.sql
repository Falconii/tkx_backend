/*
  detplanilhas.status:  int4  ->  char(1)   (igual a cabplanilhas, eventos, etc.)

  Situacoes da linha:  '0' Importado | '1' Importado Com Aviso | '2' Processado | '3' Erro Na Planilha CSV | '9' Erro De Informacao

  O que depende do tipo da coluna (e e ajustado aqui):
    - function_detplanilhas()  (trigger que mantem os totais de cabplanilhas)  -> compara status = '9'
    - popula_contadores()      (categorias/contadores)                          -> compara status = '0'

  Tudo roda em UMA transacao: se algo falhar, nada muda. Idempotente (pode rodar de novo).
  Os valores atuais sao preservados (0 -> '0', 1 -> '1', 2 -> '2', 9 -> '9').

  ORDEM: rode ESTE script ANTES do avisos_cpf.sql (que ja esta escrito para char(1)).
  O backend novo funciona com a coluna nos dois tipos, entao a ordem do deploy nao quebra nada.
*/
BEGIN;

SET LOCAL lock_timeout = '10s';

-- 1) funcoes que comparam o status. Sao plpgsql (resolvidas na execucao) e usam literal entre aspas ('9', '0'),
--    que funciona tanto com a coluna int4 quanto com char(1): nao ha janela em que algo quebre.
CREATE OR REPLACE FUNCTION public.function_detplanilhas()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE
        _old_linha_processada int4;
        _old_linha_erro  int4 ;
        _linha_processada   int4;
        _linha_erro   int4;
    BEGIN
       IF  (TG_OP = 'INSERT') THEN
           _linha_processada := 0;
           _linha_erro      := 0;
           if (new.status = '9') then
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
           if (old.status = '9') then
              begin
                 _old_linha_erro := 1;
              end;
           else
             begin
                _old_linha_processada := 1;
             end;
           end if;

           if (new.status = '9') then
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
           if (old.status = '9') then
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
    $function$;

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
                where det.id_empresa = _id_empresa and det.id_evento = _id_evento and det.id_cabec = _id_planilha and det.id_categoria > 0 and det.status = '0'
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
        $function$;

-- 2) a coluna (o ALTER nao dispara o trigger de linha; os valores sao convertidos 0 -> '0' etc.)
ALTER TABLE public.detplanilhas
  ALTER COLUMN status TYPE char(1) USING status::text;

COMMIT;

/*
  CONFERENCIA (execute separadamente):

  SELECT data_type, character_maximum_length FROM information_schema.columns
   WHERE table_name = 'detplanilhas' AND column_name = 'status';          -- character | 1

  SELECT status, count(*) FROM public.detplanilhas GROUP BY 1 ORDER BY 1;   -- '0','1','2','9' com as mesmas quantidades de antes

  -- os totais das planilhas continuam batendo com as linhas (nao deve retornar nada)
  SELECT c.id FROM public.cabplanilhas c
   WHERE c.total_linhas <> (SELECT count(*) FROM public.detplanilhas d WHERE d.id_empresa = c.id_empresa AND d.id_cabec = c.id)
      OR c.total_linhas_erro <> (SELECT count(*) FROM public.detplanilhas d WHERE d.id_empresa = c.id_empresa AND d.id_cabec = c.id AND d.status = '9');
*/
