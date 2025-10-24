/* Script Tabelas */
/* TABELA empresas  */
DROP TABLE IF EXISTS empresas;
CREATE TABLE Public.empresas (
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		fantasi varchar(40)  NOT NULL  , 
		inscri varchar(14)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		ruaf varchar(80)  NOT NULL  , 
		nrof varchar(10)  NOT NULL  , 
		complementof varchar(30)  NOT NULL  , 
		bairrof varchar(40)  NOT NULL  , 
		cidadef varchar(40)  NOT NULL  , 
		uff varchar(2)  NOT NULL  , 
		cepf char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA usuarios  */
DROP TABLE IF EXISTS usuarios;
CREATE TABLE Public.usuarios (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		razao varchar(40)  NOT NULL  , 
		cadastr Date  NOT NULL  , 
		rua varchar(80)  NOT NULL  , 
		nro varchar(10)  NOT NULL  , 
		complemento varchar(30)  NOT NULL  , 
		bairro varchar(40)  NOT NULL  , 
		cidade varchar(40)  NOT NULL  , 
		uf varchar(2)  NOT NULL  , 
		cep char(8)  NOT NULL  , 
		tel1 varchar(23)  NOT NULL  , 
		tel2 varchar(23)  NOT NULL  , 
		email varchar(100)  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		senha varchar(255)  NOT NULL  , 
		grupo int4  NOT NULL  , 
		ativo char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA gruposusuarios  */
DROP TABLE IF EXISTS gruposusuarios;
CREATE TABLE Public.gruposusuarios (
		id_empresa int4  NOT NULL  , 
		codigo serial  NOT NULL  , 
		descricao varchar(40)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,codigo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA eventos  */
DROP TABLE IF EXISTS eventos;
CREATE TABLE Public.eventos (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		descricao varchar(80)  NOT NULL  , 
		id_responsavel int4  NOT NULL  , 
		rua varchar(80)  NOT NULL  , 
		nro varchar(10)  NOT NULL  , 
		complemento varchar(30)  NOT NULL  , 
		bairro varchar(40)  NOT NULL  , 
		cidade varchar(40)  NOT NULL  , 
		uf varchar(2)  NOT NULL  , 
		cep char(8)  NOT NULL  , 
		inicio timestamp  NOT NULL  , 
		final timestamp  NOT NULL  , 
		obs varchar(200)  NOT NULL  , 
		status char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA inscritos  */
DROP TABLE IF EXISTS inscritos;
CREATE TABLE Public.inscritos (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		nome varchar(60)  NOT NULL  , 
		estrangeiro char(1)  NOT NULL  , 
		sexo char(1)  NOT NULL  , 
		data_nasc date  NOT NULL  , 
		origem char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA categorias  */
DROP TABLE IF EXISTS categorias;
CREATE TABLE Public.categorias (
		id_empresa int4  NOT NULL  , 
		id serial  NOT NULL  , 
		descricao varchar(30)  NOT NULL  , 
		contador varchar(2)  NOT NULL  , 
		sigla varchar(10)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA categoriacontadores  */
DROP TABLE IF EXISTS categoriacontadores;
CREATE TABLE Public.categoriacontadores (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id_categoria int4  NOT NULL  , 
		contador int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id_categoria) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA entregas  */
DROP TABLE IF EXISTS entregas;
CREATE TABLE Public.entregas (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id_inscrito int4  NOT NULL  , 
		rg_retirada varchar(11)  NOT NULL  , 
		nome_retirada varchar(60)  NOT NULL  , 
		tam_camisa varchar(10)  NOT NULL  , 
		data_retirada timestamp  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id_inscrito) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA links  */
DROP TABLE IF EXISTS links;
CREATE TABLE Public.links (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id_inscrito int4  NOT NULL  , 
		id_resp int4  NOT NULL  , 
		hora_inicial timestamp  NOT NULL  , 
		hora_final timestamp  NOT NULL  , 
		token varchar(200)  NOT NULL  , 
		link varchar(200)  NOT NULL  , 
		status char(1)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id_inscrito) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA tokens  */
DROP TABLE IF EXISTS tokens;
CREATE TABLE Public.tokens (
		id_empresa int4  NOT NULL  , 
		id_usuario int4  NOT NULL  , 
		token varchar(200)  NOT NULL  , 
		tipo char(1)  NOT NULL  , 
		validade timestamp  NOT NULL  , 
		status int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_usuario,token,tipo) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA participantes  */
DROP TABLE IF EXISTS participantes;
CREATE TABLE Public.participantes (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id_inscrito int4  NOT NULL  , 
		inscricao int4  NOT NULL  , 
		nro_peito int4  NOT NULL  , 
		id_categoria int4  NOT NULL  , 
		id_old_inscrito int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id_inscrito) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA cabplanilhas  */
DROP TABLE IF EXISTS cabplanilhas;
CREATE TABLE Public.cabplanilhas (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id serial  NOT NULL  , 
		arquivo varchar(255)  NOT NULL  , 
		total_linhas int4  NOT NULL  , 
		linhas_processadas int4  NOT NULL  , 
		total_linhas_erro int4  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TABELA detPlanilhas  */
DROP TABLE IF EXISTS detPlanilhas;
CREATE TABLE Public.detPlanilhas (
		id_empresa int4  NOT NULL  , 
		id_evento int4  NOT NULL  , 
		id_cabec int4  NOT NULL  , 
		cnpj_cpf varchar(14)  NOT NULL  , 
		nome varchar(60)  NOT NULL  , 
		estrangeiro char(1)  NOT NULL  , 
		sexo char(1)  NOT NULL  , 
		data_nasc varchar(10)  NOT NULL  , 
		inscricao int4  NOT NULL  , 
		nro_peito int4  NOT NULL  , 
		id_categoria int4  NOT NULL  , 
		id_inscrito int4  NOT NULL  , 
		status int4  NOT NULL  , 
		mensagem_erro varchar(100)  NOT NULL  , 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id_evento,id_cabec,cnpj_cpf) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 
/* TRUNCATE TABLES */ 
TRUNCATE TABLE Public.empresas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.usuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.gruposusuarios RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.eventos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.inscritos RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.categorias RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.categoriacontadores RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.entregas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.links RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.tokens RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.participantes RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.cabplanilhas RESTART IDENTITY; 
GO 
TRUNCATE TABLE Public.detPlanilhas RESTART IDENTITY; 
GO 
/* Drop TABLES */ 
DROP TABLE IF EXISTS Public.empresas ; 
GO 
DROP TABLE IF EXISTS Public.usuarios ; 
GO 
DROP TABLE IF EXISTS Public.gruposusuarios ; 
GO 
DROP TABLE IF EXISTS Public.eventos ; 
GO 
DROP TABLE IF EXISTS Public.inscritos ; 
GO 
DROP TABLE IF EXISTS Public.categorias ; 
GO 
DROP TABLE IF EXISTS Public.categoriacontadores ; 
GO 
DROP TABLE IF EXISTS Public.entregas ; 
GO 
DROP TABLE IF EXISTS Public.links ; 
GO 
DROP TABLE IF EXISTS Public.tokens ; 
GO 
DROP TABLE IF EXISTS Public.participantes ; 
GO 
DROP TABLE IF EXISTS Public.cabplanilhas ; 
GO 
DROP TABLE IF EXISTS Public.detPlanilhas ; 
GO 
