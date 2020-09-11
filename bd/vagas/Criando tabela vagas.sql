/*CREATE SEQUENCE public.vaga_vagaid_seq
    INCREMENT 1
    START 388
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;*/
	
CREATE TABLE public.vaga
(
    vagaid integer NOT NULL DEFAULT nextval('vaga_vagaid_seq'::regclass),
    aprovada integer DEFAULT 0,
    homologada integer DEFAULT 0,
    matricula integer DEFAULT 0,
    acao character varying(100) COLLATE pg_catalog."default" DEFAULT 'Fomentos novos'::character varying,
    valorhoraaula numeric,
    uf character varying(200) COLLATE pg_catalog."default",
    modalidadedeensino character varying(200) COLLATE pg_catalog."default" NOT NULL DEFAULT 'EaD'::character varying,
    datapublicacao timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipodecurso character varying(100) COLLATE pg_catalog."default" DEFAULT 'FIC'::character varying,
    municipio character varying(500) COLLATE pg_catalog."default",
    curso character varying(500) COLLATE pg_catalog."default",
    instituicao character varying(500) COLLATE pg_catalog."default",
    cargahoraria integer,
    periodopactuacao character varying(500) COLLATE pg_catalog."default" NOT NULL,
    nomeplanilha character varying(500) COLLATE pg_catalog."default",
    sncontrapartida boolean NOT NULL DEFAULT false,
    datamatricula character varying(50) COLLATE pg_catalog."default",
    dataaprovacao character varying(50) COLLATE pg_catalog."default",
    aprovadacontrapartida integer default 0,
    CONSTRAINT vaga_pkey PRIMARY KEY (vagaid)
)

TABLESPACE pg_default;


COMMENT ON COLUMN public.vaga.acao
    IS 'R = Repactuação
N = Novas';

COMMENT ON COLUMN public.vaga.tipodecurso
    IS 'Técnico ou FIC';

-- Trigger: datahora_vaga

-- DROP TRIGGER datahora_vaga ON public.vaga;

CREATE TRIGGER datahora_vaga
    BEFORE UPDATE 
    ON public.vaga
    FOR EACH ROW
    EXECUTE PROCEDURE public.fn_datahora_vaga();

-- Trigger: periodopactuacao_vaga

-- DROP TRIGGER periodopactuacao_vaga ON public.vaga;

CREATE TRIGGER periodopactuacao_vaga
    BEFORE INSERT OR UPDATE 
    ON public.vaga
    FOR EACH ROW
    EXECUTE PROCEDURE public.fn_periodo_vaga();

COMMENT ON TRIGGER periodopactuacao_vaga ON public.vaga
    IS 'Se no insert ou no update nao for passado o periodo, coloca automaticamente o que esteja aberto.';