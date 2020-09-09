--CONSULTA ACUMULADA
with data as (
  select datamanual, sum(matriculas) as total
  from relatoriopactuacaocompleto 
  where datamanual is not null
  group by 1
  order by to_date(datamanual, 'DD/MM/YYYY') 
)

select
  datamanual as Referencia, total as Mes,
  sum(total) over (rows between unbounded preceding and current row) as Acumulado
from data order by to_date(datamanual, 'DD/MM/YYYY') 

--CONSULTA SEM ACUMULAR
select datamanual, sum(matriculas)
from relatoriopactuacaocompleto
where datamanual is not null
group by 1
order by to_date(datamanual, 'DD/MM/YYYY')

--ABRIL
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO'
and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' 
select distinct modalidadedemanda, count(matriculas) from relatoriopactuacaocompleto where arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO'
and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' 
group by 1


