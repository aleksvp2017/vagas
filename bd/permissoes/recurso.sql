

CREATE SEQUENCE public.recurso_recursoid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Table: public.recurso

-- DROP TABLE public.recurso;

CREATE TABLE public.recurso
(
    recursoid integer NOT NULL DEFAULT nextval('recurso_recursoid_seq'::regclass),
    nome character varying(300) COLLATE pg_catalog."default" NOT NULL,
    path character varying(100) COLLATE pg_catalog."default" NOT NULL,
    snmenu boolean NOT NULL DEFAULT false,
    CONSTRAINT recurso_pkey PRIMARY KEY (recursoid)
)

TABLESPACE pg_default;


COMMENT ON COLUMN public.recurso.nome
    IS 'Nome do item de menu';

COMMENT ON COLUMN public.recurso.path
    IS 'Path do link do item de menu';

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.2

-- Started on 2020-07-23 16:21:01 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3284 (class 0 OID 16608)
-- Dependencies: 222
-- Data for Name: recurso; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.recurso VALUES (1, 'Usuários', '/usuarios', true);
INSERT INTO public.recurso VALUES (2, 'Vagas', '/vagas', true);
INSERT INTO public.recurso VALUES (3, 'Auditoria', '/auditoria', true);
INSERT INTO public.recurso VALUES (4, 'Fale conosco', '/faleconosco', true);
INSERT INTO public.recurso VALUES (6, 'Permissão', '/permissao', true);


--
-- TOC entry 3293 (class 0 OID 0)
-- Dependencies: 221
-- Name: recurso_recursoid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recurso_recursoid_seq', 6, true);


-- Completed on 2020-07-23 16:21:01 -03

--
-- PostgreSQL database dump complete
--

