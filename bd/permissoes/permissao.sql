--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.2

-- Started on 2020-07-23 16:25:15 -03

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
-- TOC entry 220 (class 1259 OID 16591)
-- Name: permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissao (
    permissaoid integer NOT NULL,
    usuarioid integer NOT NULL,
    operacaoid integer NOT NULL
);


ALTER TABLE public.permissao OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16589)
-- Name: permissao_permissaoid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissao_permissaoid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissao_permissaoid_seq OWNER TO postgres;

--
-- TOC entry 3291 (class 0 OID 0)
-- Dependencies: 219
-- Name: permissao_permissaoid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissao_permissaoid_seq OWNED BY public.permissao.permissaoid;


--
-- TOC entry 3153 (class 2604 OID 16594)
-- Name: permissao permissaoid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao ALTER COLUMN permissaoid SET DEFAULT nextval('public.permissao_permissaoid_seq'::regclass);


--
-- TOC entry 3285 (class 0 OID 16591)
-- Dependencies: 220
-- Data for Name: permissao; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.permissao VALUES (9, 4, 1);
INSERT INTO public.permissao VALUES (10, 4, 2);
INSERT INTO public.permissao VALUES (11, 4, 3);
INSERT INTO public.permissao VALUES (12, 4, 4);
INSERT INTO public.permissao VALUES (13, 4, 5);
INSERT INTO public.permissao VALUES (14, 4, 6);
INSERT INTO public.permissao VALUES (15, 4, 7);
INSERT INTO public.permissao VALUES (16, 4, 8);
INSERT INTO public.permissao VALUES (18, 4, 9);
INSERT INTO public.permissao VALUES (19, 4, 10);
INSERT INTO public.permissao VALUES (20, 4, 11);
INSERT INTO public.permissao VALUES (21, 4, 12);
INSERT INTO public.permissao VALUES (22, 4, 13);


--
-- TOC entry 3292 (class 0 OID 0)
-- Dependencies: 219
-- Name: permissao_permissaoid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissao_permissaoid_seq', 22, true);


--
-- TOC entry 3155 (class 2606 OID 16599)
-- Name: permissao pk_permissao; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT pk_permissao PRIMARY KEY (permissaoid);


--
-- TOC entry 3157 (class 2606 OID 16631)
-- Name: permissao fk_permissao_operacao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT fk_permissao_operacao FOREIGN KEY (operacaoid) REFERENCES public.operacao(operacaoid) NOT VALID;


--
-- TOC entry 3156 (class 2606 OID 16600)
-- Name: permissao fk_permissao_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT fk_permissao_usuario FOREIGN KEY (usuarioid) REFERENCES public.usuario(usuarioid) NOT VALID;


-- Completed on 2020-07-23 16:25:15 -03

--
-- PostgreSQL database dump complete
--

