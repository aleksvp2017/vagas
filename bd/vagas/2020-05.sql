/* 
Período: PACTUAçãO REDE FEDERAL FIC-EAD 2020 e PACTUAçãO NOVOS CAMINHOS  
(o primeiro é só rede federal, segunda so rede não federal)
Ref: 05/2020
- TOTAL GILSON: 43588 (acumulado) / 28740 (mes) 
- TUDO EAD
- TOTAL PLANILHAS 27603 + 1944 = 29547
*/

--27603
select sum(matriculas) from relatoriopactuacaocompleto 
where arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' 
and (modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA') 

--1944
select sum(matriculas), arquivoorigem from relatoriopactuacaocompleto 
where arquivoorigem = 'CONTRAPARTIDA-2020-05-27-RELATORIO'
group by 2

--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '31/05/2020' where arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' 
	and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' ;
	
update relatoriopactuacaocompleto set datamanual = '31/05/2020' where arquivoorigem = 'CONTRAPARTIDA-2020-05-27-RELATORIO' ;
	
--CHECAGEM FINAL 
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '31/05/2020'	

--COPIANDO PARA TABELA DADOS
insert into dados select * from relatoriopactuacaocompleto WHERE datamanual = '31/05/2020' and matriculas > 0;

select sum(matriculas) from dados WHERE datamanual = '31/05/2020';

/*
AJUSTANDO O PERIODO QUE AINDA NAO VINHA NAS PLANILHAS
PACTUAçãO REDE FEDERAL FIC-EAD 2020 E/OU PACTUAçãO NOVOS CAMINHOS
OBS: os outros ou já acabaram ou ainda não começaram ou só tem presencial
Tudo que é federal é o primeiro. Tudo que não é, é Novos Caminhos.
Vou ajustar pela instituição.
*/
--select nomeunidade, strpos(nomeunidade,'FEDERA'), matriculas from dados WHERE datamanual = '30/04/2020';
update dados set periodo = 'PACTUAçãO NOVOS CAMINHOS' WHERE datamanual = '31/05/2020' and strpos(nomeunidade,'FEDERA') = 0 and arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' 
update dados set periodo = 'PACTUAçãO REDE FEDERAL FIC-EAD 2020' WHERE datamanual = '31/05/2020' and strpos(nomeunidade,'FEDERA') > 0 and arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' 

select sum(matriculas), periodo from dados WHERE datamanual = '31/05/2020' group by 2;

update dados set periodo = 'CONTRAPARTIDA' WHERE datamanual = '31/05/2020' and periodo is null;

begin
--REPLIQUEI 2019 E ABRIL EM MAIO PARA QUE MATRICULA FIQUE SEMPRE ACUMULADA
insert into vaga (aprovada, homologada, matricula, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, 
				 municipio, curso, instituicao, cargahoraria, periodopactuacao, nomeplanilha, sncontrapartida,
				 datamatricula, dataaprovacao, aprovadacontrapartida, ted, sei, valoraprovado, contapronatec,
				 formaoferta, modalidadedemanda, origemreplicacao)
select aprovada, homologada, matricula, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, 
				 municipio, curso, instituicao, cargahoraria, periodopactuacao, nomeplanilha, sncontrapartida,
				 '31/05/2020', dataaprovacao, aprovadacontrapartida, ted, sei, valoraprovado, contapronatec,
				 formaoferta, modalidadedemanda, 'datamatricula 30/04/2020 e 31/12/2019'
from vaga 
where datamatricula = '30/04/2020';
commit
select sum(matricula) from vaga where datamatricula = '31/05/2020'
