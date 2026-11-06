/*
  AVISO DE CPF/CNPJ INVALIDO  (detplanilhas.status = 1  "Importado Com Aviso")

  Situacoes da linha: 0 Importado | 1 Importado Com Aviso | 2 Processado | 3 Erro Na Planilha CSV | 9 Erro De Informacao
  A linha com aviso conta como OK (processavel); so o status 9 e erro. Os totais da planilha (cabplanilhas) sao
  mantidos pelo trigger de detplanilhas, entao este script nao mexe neles diretamente.

  Este script ajusta dados ja gravados ANTES da situacao 1 existir. Importacoes novas ja nascem corretas.
  So atua em planilhas AINDA NAO PROCESSADAS (cabplanilhas.status = '1'). Idempotente.
*/

-- 1) linhas OK que ja tinham o aviso gravado na mensagem (status 0 + 'Aviso...') -> situacao 1
UPDATE public.detplanilhas
   SET status = 1
 WHERE status = 0
   AND mensagem_erro LIKE 'Aviso%'
   AND EXISTS (SELECT 1 FROM public.cabplanilhas c
                WHERE c.id_empresa = detplanilhas.id_empresa AND c.id_evento = detplanilhas.id_evento
                  AND c.id = detplanilhas.id_cabec AND c.status = '1');

-- 2) linhas que, pela regra antiga, eram ERRO somente por CPF/CNPJ invalido (e o documento existe) -> aviso
UPDATE public.detplanilhas d
   SET status = 1,
       mensagem_erro = CASE
                         WHEN d.mensagem_erro ~ '^Linha [0-9]+:'
                         THEN 'Aviso (linha ' || substring(d.mensagem_erro from '^Linha ([0-9]+):') || '): CPF/CNPJ Inválido'
                         ELSE 'Aviso: CPF/CNPJ Inválido'
                       END
 WHERE d.status = 9
   AND d.mensagem_erro ~ '^(Linha [0-9]+: *| *-? *)C(NPJ/CPF|PF/CNPJ) Inválido *$'
   AND btrim(d.cnpj_cpf) <> ''
   AND EXISTS (SELECT 1 FROM public.cabplanilhas c
                WHERE c.id_empresa = d.id_empresa AND c.id_evento = d.id_evento
                  AND c.id = d.id_cabec AND c.status = '1');

/*
  CONFERENCIA (execute separadamente): linhas por situacao nas planilhas ainda nao processadas

  SELECT c.id AS planilha, d.status, count(*) AS linhas
    FROM public.detplanilhas d
    JOIN public.cabplanilhas c ON c.id_empresa = d.id_empresa AND c.id_evento = d.id_evento AND c.id = d.id_cabec
   WHERE c.status = '1'
   GROUP BY 1, 2 ORDER BY 1, 2;
*/
