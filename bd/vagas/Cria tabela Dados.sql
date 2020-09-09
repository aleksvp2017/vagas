CREATE SEQUENCE public.dados_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE dados
(
    id integer NOT NULL DEFAULT nextval('dados_id_seq'::regclass),
    instituicao character varying(500) ,
    uf character varying(500) ,
    codigomunicipio character varying(500) ,
    municipio character varying(500) ,
    codigounidade character varying(500) ,
    nomeunidade character varying(500) ,
    tipocurso character varying(500) ,
    codigocurso character varying(500) ,
    nomecurso character varying(500) ,
    periodo character varying(500) ,
    modalidadeensino character varying(500) ,
    cargahoraria character varying(500) ,
    modalidadedemanda character varying(500) ,
    homologadas integer,
    situacaoturma character varying(500) ,
    datainicioturma character varying(500) ,
    dataterminoturma character varying(500) ,
    datapublicacao character varying(500) ,
    datafimmatricula character varying(500) ,
    matriculas integer,
    datareferencia character varying(500) ,
    arquivoorigem character varying(500) ,
    sistemaensino character varying(500) ,
    dependenciaadministrativa character varying(500) ,
    subtipocursos character varying(500) ,
    codigociclomatricula character varying(500) ,
    ciclomatricula character varying(500) ,
    statusciclomatricula character varying(500) ,
    situacaociclomatricula character varying(500) ,
    possuiestagio character varying(500) ,
    datacriacao character varying(500) ,
    datamanual character varying(500) ,
    acao character varying(500) ,
    CONSTRAINT dados_pkey PRIMARY KEY (id)
)
