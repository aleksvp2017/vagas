/* 
- TOTAL: 84.755
- NAS PLANILHAS: 55638 + 19835 = 75473
- PRIMEIRO A VIR TUDO ACUMULADO
"PACTUAÇÃO RESTRITA REDE FEDERAL 2019"
"PACTUAÇÃO NOVOS CAMINHOS - PRISIONAL - PILOTO"
"PACTUAçãO REDE FEDERAL FIC-EAD 2020"
"PACTUAçãO NOVOS CAMINHOS"
"PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE"
"PACTUAÇÃO RESTRITA REDE FEDERAL 2020"
*/

select sum(matriculas), periodo from relatoriopactuacaocompleto where arquivoorigem = '2020-06-28-RELATORIO-PACTUACAO' and matriculas > 0 group by 2

--55638
select sum(matriculas) from relatoriopactuacaocompleto 
where arquivoorigem = '2020-06-28-RELATORIO-PACTUACAO';


--19835
select sum(matriculas) from relatoriopactuacaocompleto 
where arquivoorigem = 'CONTRAPARTIDA-2020-06-29-RELATORIO'

--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '28/06/2020' where arquivoorigem = '2020-06-28-RELATORIO-PACTUACAO';
	
update relatoriopactuacaocompleto set datamanual = '28/06/2020' where arquivoorigem = 'CONTRAPARTIDA-2020-06-29-RELATORIO' ;
	
--CHECAGEM FINAL 
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '28/06/2020';	

--COPIANDO PARA TABELA DADOS
insert into dados select * from relatoriopactuacaocompleto WHERE datamanual = '28/06/2020' and matriculas > 0;

select sum(matriculas) from dados WHERE datamanual = '28/06/2020';
select sum(matriculas), periodo from dados WHERE datamanual = '28/06/2020' group by 2;

update dados set periodo = 'CONTRAPARTIDA' where datamanual = '28/06/2020' and periodo is null;
