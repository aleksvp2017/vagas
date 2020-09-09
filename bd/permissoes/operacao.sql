--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.2

-- Started on 2020-07-23 16:22:41 -03

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16619)
-- Name: operacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operacao (
    operacaoid integer NOT NULL,
    recursoid integer NOT NULL,
    nome character varying(300) NOT NULL,
    uri character varying(100)
);


ALTER TABLE public.operacao OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16617)
-- Name: operacao_operacaoid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.operacao_operacaoid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operacao_operacaoid_seq OWNER TO postgres;

--
-- TOC entry 3290 (class 0 OID 0)
-- Dependencies: 223
-- Name: operacao_operacaoid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.operacao_operacaoid_seq OWNED BY public.operacao.operacaoid;


--
-- TOC entry 3153 (class 2604 OID 16622)
-- Name: operacao operacaoid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operacao ALTER COLUMN operacaoid SET DEFAULT nextval('public.operacao_operacaoid_seq'::regclass);


--
-- TOC entry 3284 (class 0 OID 16619)
-- Dependencies: 224
-- Data for Name: operacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.operacao VALUES (13, 6, 'listar', NULL);
INSERT INTO public.operacao VALUES (1, 1, 'listar', '/usuarios');
INSERT INTO public.operacao VALUES (2, 1, 'incluir', '/usuarios/incluir');
INSERT INTO public.operacao VALUES (3, 1, 'excluir', '/usuarios');
INSERT INTO public.operacao VALUES (4, 1, 'recuperarSenha', '/recuperarSenha');
INSERT INTO public.operacao VALUES (5, 1, 'alterar', '/usuarios/:[0-9]+');
INSERT INTO public.operacao VALUES (7, 1, 'alterarSenha', '/alterarSenha');
INSERT INTO public.operacao VALUES (12, 4, 'enviar', '/mensagem');
INSERT INTO public.operacao VALUES (6, 2, 'listar', '/vagas');
INSERT INTO public.operacao VALUES (8, 2, 'importarPlanilha', '/vagas/importar');
INSERT INTO public.operacao VALUES (9, 2, 'excluir', '/vagas');
INSERT INTO public.operacao VALUES (10, 2, 'alterar', '/vagas/:[0-9]+');
INSERT INTO public.operacao VALUES (11, 3, 'listar', '/auditoria');


--
-- TOC entry 3291 (class 0 OID 0)
-- Dependencies: 223
-- Name: operacao_operacaoid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.operacao_operacaoid_seq', 13, true);


--
-- TOC entry 3155 (class 2606 OID 16624)
-- Name: operacao pk_operacao; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operacao
    ADD CONSTRAINT pk_operacao PRIMARY KEY (operacaoid);


--
-- TOC entry 3156 (class 2606 OID 16625)
-- Name: operacao fk_operacao_recurso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operacao
    ADD CONSTRAINT fk_operacao_recurso FOREIGN KEY (recursoid) REFERENCES public.recurso(recursoid);


-- Completed on 2020-07-23 16:22:41 -03

--
-- PostgreSQL database dump complete
--

