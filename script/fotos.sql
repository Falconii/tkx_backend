DROP TABLE IF EXISTS fotos;
CREATE TABLE Public.fotos (
		id_empresa int4  NOT NULL  , 
		id_evento  int4  NOT NULL  , 
		id         serial NOT NULL,
		file_name  text  NOT NULL ,
		imagem     bytea  NOT NULL, 
		user_insert int4  NOT NULL  , 
		user_update int4  NOT NULL  , 
		PRIMARY KEY(id_empresa,id) 
)
 WITHOUT OIDS 
 TABLESPACE "Producao" 
 GO 