CREATE SEQUENCE public.periodopactuacao_periodopactuacaoid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;
	
CREATE TABLE public.periodopactuacao
(
    periodopactuacaoid integer NOT NULL DEFAULT nextval('periodopactuacao_periodopactuacaoid_seq'::regclass),
    nome character varying(500) COLLATE pg_catalog."default" NOT NULL,
    snaberto boolean NOT NULL,
    CONSTRAINT periodopactuacao_pkey PRIMARY KEY (periodopactuacaoid)
)

TABLESPACE pg_default;

