--TOTAL APROVADA REDE FEDERAL
select sum(aprovada), sum(aprovadacontrapartida),sum(aprovada + aprovadacontrapartida)
from vaga
where true = true
and aprovada > 0
and periodopactuacao in ('PACTUAÇÃO REDE FEDERAL FIC-EAD 2019',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE')


--TOTAL VALOR POR PERÍODO REDE FEDERAL
--PROBLEMA NA "PACTUAÇÃO REDE FEDERAL FIC-EAD 2019", TEM QUE DAR 38.284.487,76
select periodopactuacao, sum(valorhoraaula*cargahoraria*aprovada)
from vaga
where true = true
and aprovada > 0
and periodopactuacao in ('PACTUAÇÃO REDE FEDERAL FIC-EAD 2019',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE')
group by 1
order by 1

--MARRETEI ESSAS DUAS LINHAS PARA CRAVAR OS VALORES
--MARRETEI UMA LINHA DE 23000.030830/2019-85
update vaga set valoraprovado = 7017.76 where instituicao = 'IFPR' and municipio = 'APUCARANA' and curso = 'ADMINISTRAÇÃO';
--MARRETEI UMA LINHA DE 23000.030305/2019-60
update vaga set valoraprovado = 318710.38746 where sei = '23000.030305/2019-60' and instituicao = 'IFSUL' and municipio = 'PELOTAS' and curso = 'TÉCNICO EM CONTABILIDADE';

--TOTAL POR DATA REDE FEDERAL
select dataaprovacao,sum(aprovada), sum(aprovadacontrapartida),sum(aprovada + aprovadacontrapartida)
from vaga
where true = true
and aprovada > 0
and periodopactuacao in ('PACTUAÇÃO REDE FEDERAL FIC-EAD 2019',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE',
'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE')
group by 1
order by 1


--ABRIL (TUDO NA PACTUAÇÃO REDE FEDERAL FIC-EAD 2020) (O RESTO DO PERÍODO ESTÁ EM MAIO E AGOSTO)
-- ABRIL (13200) - BATENDO REDONDO 
--SAO AS DUAS PRIMEIRAS LINHAS DA ABA CONTROLE-2020-1
--23000.011551/2020-56 (8000) e 23000.012248/2020-71 (5200)
--FOI PARA AGOSTO (1600, SALDO QUE SOBROU - SEI 2186713) E O RESTO (8000) PARA ABRIL
select distinct periodopactuacao from vaga where dataaprovacao = '30/04/2020'
select distinct dataaprovacao from vaga where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020'

--MAIO (TUDO NA PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 )
--MAIO 68920 (NA ABA CONTROLE-2020-1 TEM 84820, MANTENDO O PERIODO 2020, TIREI 15900 DA SEGUINTE FORMA:
	-- AS DUAS PRIMEIRAS LINHAS FORAM PARA ABRIL 23000.011551/2020-56 (8000) e 23000.012248/2020-71 (5200) 
    -- 23000.011551/2020-56(1600) FOI PARA AGOSTO
	-- 300 FICOU SEM PERIODO (23000.012706/2020-71)
		--Pelo e-mail do Gilson, 22/09, inferi que os 300 não foram computados em nenhum período, por isso vou tirar do período.
		update vaga set periodopactuacao='SEM PERÍODO' where sei = '23000.012706/2020-71' and nomeplanilha = 'TEMPLATE_REDE_FEDERAL_V3.2___OFERTA_DE_NOVAS_TURMAS__CORRIGIDO.XLSX';
	-- 23000.011627/2020-43 FOI PARA AGOSTO (800, SALDO QUE SOBROU - SEI 2186673)
select sum(aprovada), sum(aprovadacontrapartida),sum(aprovada + aprovadacontrapartida)
from vaga
where true = true
and dataaprovacao = '31/05/2020'
select distinct periodopactuacao from vaga where dataaprovacao = '31/05/2020'

--JUNHO (TUDO NA SEGUNDA FASE 2020 - 618 DA SEGUNDA FASE FORA PARA OUTROS MESES)
--JUNHO 60002
--SEGUNDA FASE 60620
--A DIFERENÇA FOI 218 PARA JULHO E 400 PARA AGOSTO
	--(218 DESSES DEVEM IR PARA JULHO - 23000.016532/2020-16 (2137230 explica a diferença)
	--	E 400 PARA AGOSTO (SEI 2186746 EXPLICA A DIFERENÇA) - 23000.016409/2020-03 - COMPLEMENTO)
select sum(aprovada), sum(aprovadacontrapartida),sum(aprovada + aprovadacontrapartida)
from vaga
where true = true
and dataaprovacao = '30/06/2020'
and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE'

--JULHO (TERCEIRA FASE 2020 + 218 QUE VEIO DA SEGUNDA FASE)
--JULHO 24978
--TERCEIRA FASE 24760
--A DIFERENÇA, 218, É O QUE VEIO DE JUNHO, DA FASE 2
--23000.016532/2020-16 (2137230 explica a diferença)
select sum(aprovada), sum(aprovadacontrapartida),sum(aprovada + aprovadacontrapartida)
from vaga
where true = true
--and dataaprovacao = '31/07/2020'
and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE'


--AGOSTO
-- TEM PERIODO 1 E 2, SAO CASOS DE NOVAS OFERTAS USANDO SOBRAS / SALDO
--400  (SEI 2186746 EXPLICA A DIFERENÇA) - 23000.016409/2020-03
--1600 (SEI 2186713 EXPLICA A DIFEREÇA) - 23000.011551/2020-56
--23000.011627/2020-43 FOI PARA AGOSTO (800, SALDO QUE SOBROU - SEI 2186673)
select distinct nomeplanilha, periodopactuacao, sum(aprovada+aprovadacontrapartida) 
from vaga where aprovada > 0 and dataaprovacao = '31/08/2020' 
group by 1,2