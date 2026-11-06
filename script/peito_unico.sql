/*
  NUMERO DO PEITO UNICO DENTRO DO EVENTO  (participantesv2)

  - Cria o indice unico (id_empresa, id_evento, nro_peito): dois participantes do mesmo evento nunca
    podem ter o mesmo numero de peito. Eventos diferentes podem repetir numeros.
  - Cria a restricao nro_peito > 0.

  SEGURANCA: se ja existirem numeros repetidos no mesmo evento, o script NAO cria nada e para com um erro que diz
  quantos sao. Para localizar e corrigir, rode a consulta do final deste arquivo.

  Idempotente: pode ser executado mais de uma vez.
*/

DO $$
DECLARE
    repetidos int;
    invalidos int;
BEGIN
    SELECT count(*) INTO repetidos FROM (
        SELECT 1 FROM public.participantesv2
         GROUP BY id_empresa, id_evento, nro_peito
        HAVING count(*) > 1
    ) x;

    SELECT count(*) INTO invalidos FROM public.participantesv2 WHERE nro_peito <= 0;

    IF repetidos > 0 OR invalidos > 0 THEN
        RAISE EXCEPTION 'Nada foi criado: % numero(s) de peito repetido(s) no mesmo evento e % participante(s) com peito <= 0. Corrija antes (consulta no fim do script).', repetidos, invalidos;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'participantesv2_peito_ck') THEN
        ALTER TABLE public.participantesv2
            ADD CONSTRAINT participantesv2_peito_ck CHECK (nro_peito > 0);
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS participantesv2_evento_peito_uk
    ON public.participantesv2 (id_empresa, id_evento, nro_peito);


/*
  CONSULTA para localizar os repetidos (execute separadamente):

  SELECT id_empresa, id_evento, nro_peito, count(*) AS vezes,
         string_agg(nome || ' (id ' || id || ')', ' | ' ORDER BY id) AS participantes
    FROM public.participantesv2
   GROUP BY id_empresa, id_evento, nro_peito
  HAVING count(*) > 1
   ORDER BY id_evento, nro_peito;

  Resumo por evento:

  SELECT id_evento, count(*) AS numeros_repetidos
    FROM (SELECT id_evento, nro_peito FROM public.participantesv2
           GROUP BY id_empresa, id_evento, nro_peito HAVING count(*) > 1) x
   GROUP BY id_evento ORDER BY id_evento;
*/
