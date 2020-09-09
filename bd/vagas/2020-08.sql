/* 
- TOTAL GILSON: 193.280
- TOTAL PLANILHAS: 105431 + 92756 = 198.187
"PACTUAÇÃO RESTRITA REDE FEDERAL 2019"
"CONTRAPARTIDA"
"PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE"
"PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 SALDOS"
"PACTUAÇÃO NOVOS CAMINHOS - PRISIONAL - PILOTO"
"PACTUAçãO REDE FEDERAL FIC-EAD 2020"
"PACTUAçãO NOVOS CAMINHOS"
"PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE"
"PACTUAÇÃO RESTRITA REDE FEDERAL 2020"
*/

select sum(matriculas), periodo from relatoriopactuacaocompleto where arquivoorigem = '2020-08-31-RELATORIO-PACTUACAO' and matriculas > 0 group by 2

--105431
select sum(matriculas) from relatoriopactuacaocompleto 
where arquivoorigem = '2020-08-31-RELATORIO-PACTUACAO';


--92756
select sum(matriculas) from relatoriopactuacaocompleto 
where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO';

--select * from relatoriopactuacaocompleto where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO';
--select situacaociclomatricula, sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO' group by 1;

--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '31/08/2020' where arquivoorigem = '2020-08-31-RELATORIO-PACTUACAO';
	
update relatoriopactuacaocompleto set datamanual = '31/08/2020' where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO' ;
	
--CHECAGEM FINAL 
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '31/08/2020';	

--COPIANDO PARA TABELA DADOS
insert into dados select * from relatoriopactuacaocompleto WHERE datamanual = '31/08/2020' and matriculas > 0;

select sum(matriculas) from dados WHERE datamanual = '31/08/2020';
select sum(matriculas), periodo from dados WHERE datamanual = '31/08/2020' group by 2;

update dados set periodo = 'CONTRAPARTIDA' where datamanual = '31/08/2020' and periodo is null;


--update dados set tipocurso = 'TÉCNICO' where tipocurso is null and to_number(cargahoraria,'9999')>=800;
--update dados set tipocurso = 'FIC' where tipocurso is null and to_number(cargahoraria,'9999')<800;

update dados set modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' where modalidadeensino is null
and (strpos(ciclomatricula, 'UCAÇÃO A DISTÂNCIA') > 0 or  strpos(ciclomatricula, 'EAD')>0)

update dados set modalidadeensino = 'EDUCAÇÃO PRESENCIAL' where modalidadeensino is null