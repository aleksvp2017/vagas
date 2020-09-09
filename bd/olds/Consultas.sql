--TOTAL DE MATRICULAS POR MES (MATRICULAS + CONTRAPARTIDA)
select datareferencia, sum(matriculas) as matriculasMAIScontapartida
from relatoriopactuacaocompleto
where datareferencia is not null --tira os periodos de 2019 que nao devem ser contados
and (periodo is null or periodo <> 'PACTUAÇÃO NOVOS CAMINHOS - PRISIONAL - PILOTO')
group by 1 order by to_date(datareferencia, 'DD/MM/YYYY')

--TOTAL DE MATRICULAS POR PLANILHA 
select arquivoorigem, sum(matriculas) as matriculas
from relatoriopactuacaocompleto group by 1 order by 1

--PERIODOS QUE SAO UTILIZADOS PARA CONTABALIZACAO (null é por causa da contrapartida)
select periodo, modalidadeensino, tipocurso, sum(matriculas) from relatoriopactuacaocompleto 
where true = true 
--and datareferencia = '30/03/2020'
--and modalidadeensino = 'presencial'
and datareferencia is   null or datareferencia = '31/12/2019'
group by 1,2,3

--COMPARA DUAS DATAS DE REFERENCIA, PROCURANDO POR REGISTROS EM UMA QUE NAO ESTEJAM NA OUTRA
select * from relatoriopactuacaocompleto where datareferencia = '31/12/2019'
and (instituicao, uf, municipio, nomeunidade, tipocurso, nomecurso, modalidadeensino) not in
(select instituicao, uf, municipio, nomeunidade, tipocurso, nomecurso, modalidadeensino from relatoriopactuacaocompleto 
 where datareferencia = '30/03/2020')

--CHECA SE TEM ALGUMA LINHA QUE EXISTIA NUMA DATA DE REFERENCIA E TEVE NUMERO DE MATRICULAS MODIFICADA NA PROXIMA
select * 
from relatoriopactuacaocompleto rcp1,relatoriopactuacaocompleto rcp2
where rcp1.datareferencia = '30/12/2019' and 
	rcp2.datareferencia = '30/03/2020' and
	rcp1.instituicao = rcp2.instituicao and 
	rcp1.uf = rcp2.uf and 
	rcp1.municipio = rcp2.municipio and 
	rcp1.nomeunidade = rcp2.nomeunidade and
	rcp1.tipocurso = rcp2.tipocurso and
	rcp1.nomecurso = rcp2.nomecurso and 
	rcp1.modalidadeensino = rcp2.modalidadeensino and
	rcp1.matriculas <> rcp2.matriculas

select periodo, sum(matriculas) from relatoriopactuacaocompleto
where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020'
group by 1;
--
select tipocurso, modalidadeensino, sum(matriculas)
from relatoriopactuacaocompleto
where datareferencia = '30/04/2020'
group by 1,2


select periodo, sum(matriculas)
from relatoriopactuacaocompleto
where datareferencia = '30/04/2020'
group by 1