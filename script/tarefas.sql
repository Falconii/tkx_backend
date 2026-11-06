/*
  TABELA tarefas  (fila de relatorios processada pelo job do backend)

  Diferencas em relacao ao CREATE TABLE do aplication.sql:
    - PK passa a ser "id" (antes era id_empresa + name_file, o que impedia dois
      relatorios com o mesmo nome).
    - UNIQUE (id_empresa, name_file) continua existindo: o CRUD gerado (getTarefa,
      updateTarefa, deleteTarefa) ainda localiza o registro por esses dois campos.
      O name_file deve ser gerado unico (ex.: evento01_<id>_<timestamp>.xlsx).
    - id_file e folder_id passam a ter DEFAULT '' (nao ha Drive quando o arquivo fica
      em pasta local do servidor).
    - nova coluna "mensagem": motivo da falha / observacao do processamento.
    - CHECK no status e indices para o polling do job e para a tela de acompanhamento.

  status:  '0' pendente | '1' processando | '2' concluida | '3' erro | '4' sem dados/cancelada

  Script idempotente: pode ser executado mais de uma vez (nao apaga dados).
*/

CREATE TABLE IF NOT EXISTS public.tarefas (
    id               serial        NOT NULL,
    id_empresa       int4          NOT NULL,
    id_usuario       int4          NOT NULL,
    id_file          varchar(255)  NOT NULL DEFAULT '',
    folder_id        varchar(255)  NOT NULL DEFAULT '',
    name_file        varchar(255)  NOT NULL,
    sigla            varchar(20)   NOT NULL,
    data_solicitacao varchar(20)   NOT NULL,
    data_conclusao   varchar(20)   NOT NULL DEFAULT '',
    parametros       text          NOT NULL,
    status           char(1)       NOT NULL DEFAULT '0',
    mensagem         text          NOT NULL DEFAULT '',
    user_insert      int4          NOT NULL,
    user_update      int4          NOT NULL,
    CONSTRAINT tarefas_pkey PRIMARY KEY (id),
    CONSTRAINT tarefas_empresa_arquivo_uk UNIQUE (id_empresa, name_file),
    CONSTRAINT tarefas_status_ck CHECK (status IN ('0', '1', '2', '3', '4'))
);

/*
  Se a tabela JA existia com o formato antigo (PK em id_empresa + name_file),
  o bloco abaixo migra sem perder dados. Em banco novo ele nao faz nada.
*/
DO $$
BEGIN
    -- coluna nova
    ALTER TABLE public.tarefas ADD COLUMN IF NOT EXISTS mensagem text NOT NULL DEFAULT '';

    -- defaults que o formato antigo nao tinha
    ALTER TABLE public.tarefas ALTER COLUMN id_file   SET DEFAULT '';
    ALTER TABLE public.tarefas ALTER COLUMN folder_id SET DEFAULT '';

    -- troca a PK antiga (id_empresa, name_file) pela PK em id.
    -- A PK antiga tambem se chama tarefas_pkey, entao e identificada pela DEFINICAO, nao pelo nome.
    IF EXISTS (
        SELECT 1
          FROM pg_constraint
         WHERE conrelid = 'public.tarefas'::regclass
           AND contype = 'p'
           AND pg_get_constraintdef(oid) <> 'PRIMARY KEY (id)'
    ) THEN
        EXECUTE (
            SELECT 'ALTER TABLE public.tarefas DROP CONSTRAINT ' || quote_ident(conname)
              FROM pg_constraint
             WHERE conrelid = 'public.tarefas'::regclass AND contype = 'p'
        );
        ALTER TABLE public.tarefas ADD CONSTRAINT tarefas_pkey PRIMARY KEY (id);
    END IF;

    -- garante a unicidade que antes vinha da PK
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarefas_empresa_arquivo_uk') THEN
        ALTER TABLE public.tarefas
            ADD CONSTRAINT tarefas_empresa_arquivo_uk UNIQUE (id_empresa, name_file);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tarefas_status_ck') THEN
        ALTER TABLE public.tarefas
            ADD CONSTRAINT tarefas_status_ck CHECK (status IN ('0', '1', '2', '3', '4'));
    END IF;
END $$;

/* job: "proximas pendentes" (WHERE status = '0' ORDER BY id) e recuperacao dos '1' travados */
CREATE INDEX IF NOT EXISTS tarefas_status_id_ix
    ON public.tarefas (status, id);

/* tela de acompanhamento: tarefas do usuario, mais recentes primeiro */
CREATE INDEX IF NOT EXISTS tarefas_usuario_id_ix
    ON public.tarefas (id_empresa, id_usuario, id DESC);
