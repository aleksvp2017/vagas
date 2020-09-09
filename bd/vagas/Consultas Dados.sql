--TODOS ARQUIVOS CARREGADOS
select distinct arquivoorigem from relatoriopactuacaocompleto



delete from vaga
select * from vaga

INSERT INTO public.vaga(homologada, matricula, acao, uf, modalidadedeensino, datapublicacao, tipodecurso, municipio, curso, 
						instituicao, cargahoraria, periodopactuacao, origem)
	select homologadas, matriculas, acao, uf, modalidadeensino, current_date, tipocurso, municipio, nomecurso,
						instituicao, to_number(cargahoraria,'999'), periodo, arquivoorigem
	from dados
	
select distinct(arquivoorigem) from dados where modalidadeensino is null

--CONSULTA SEM ACUMULAR
select datamanual, sum(matriculas)
from dados
group by 1
order by to_date(datamanual, 'DD/MM/YYYY')

--CONSULTA ACUMULADA
with data as (
  select datamanual, sum(matriculas) as total
  from dados 
  where datamanual is not null
  group by 1
  order by to_date(datamanual, 'DD/MM/YYYY') 
)
select
  datamanual as Referencia, total as Mes,
  sum(total) over (rows between unbounded preceding and current row) as Acumulado
from data order by to_date(datamanual, 'DD/MM/YYYY') 

