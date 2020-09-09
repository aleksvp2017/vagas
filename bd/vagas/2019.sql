--ARQUIVO BASE: Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020

/* 
Ação: REDE FEDERAL
Ref: 2019
- TOTAL: 6314
- 5233 TEC EAD
- 1081 FIC EAD
"PACTUAÇÃO RESTRITA REDE FEDERAL 2019" - TODAS AS MATRICULAS AQUI
"PACTUAÇÃO RESTRITA REDE FEDERAL 2020" - TODAS AS MATRICULAS AQUI
*/

--3663 
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2019'
	
--2651	
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2020'	

--6314
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo in ('PACTUAÇÃO RESTRITA REDE FEDERAL 2020','PACTUAÇÃO RESTRITA REDE FEDERAL 2019')

--"TÉCNICO"	"EDUCAÇÃO A DISTÂNCIA"	5233
--"FIC"	"EDUCAÇÃO A DISTÂNCIA"	1081
select tipocurso, modalidadeensino, sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo in ('PACTUAÇÃO RESTRITA REDE FEDERAL 2020', 'PACTUAÇÃO RESTRITA REDE FEDERAL 2019')
group by 1,2

--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '31/12/2019', acao = 'Rede Federal' where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo in ('PACTUAÇÃO RESTRITA REDE FEDERAL 2020','PACTUAÇÃO RESTRITA REDE FEDERAL 2019')

--CHECAGEM FINAL
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '31/12/2019' and acao = 'Rede Federal'

/* 
Ação: Repactuação
Ref: 2019
- TOTAL: 2.596
- 1.395 TEC Presencial
- 1.201 FIC Presencial
-"PACTUAçãO NOVOS CAMINHOS" - SO UM PEDACO, 2.596 DE 20017
*/

--1201
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAçãO NOVOS CAMINHOS' and tipocurso = 'FIC' and modalidadeensino = 'EDUCAÇÃO PRESENCIAL'

--1395
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAçãO NOVOS CAMINHOS' and tipocurso = 'TÉCNICO' and modalidadeensino = 'EDUCAÇÃO PRESENCIAL'

--2596
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAçãO NOVOS CAMINHOS' and (tipocurso = 'TÉCNICO' or tipocurso = 'FIC') and modalidadeensino = 'EDUCAÇÃO PRESENCIAL'	
	
--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '31/12/2019', acao = 'Repactuação' where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAçãO NOVOS CAMINHOS' and (tipocurso = 'TÉCNICO' or tipocurso = 'FIC') and modalidadeensino = 'EDUCAÇÃO PRESENCIAL'
	
--CHECAGEM FINAL
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '31/12/2019' and acao = 'Repactuação'	


--CHECAGEM FINAL 2019
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '31/12/2019'


--COPIANDO DADOS PARA TABELA DADOS
insert into dados select * from relatoriopactuacaocompleto WHERE datamanual = '31/12/2019' and matriculas > 0;
