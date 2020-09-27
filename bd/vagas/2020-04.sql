/* 
Período: PACTUAçãO REDE FEDERAL FIC-EAD 2020 e PACTUAçãO NOVOS CAMINHOS  
(o primeiro é só rede federal, segunda so rede não federal)
Ref: 04/2020
- TOTAL PLANILHA GILSON: 14.848 (acumulado) / 5938 (mes) 
- TUDO EAD 
- BASE PLANILHA DE ABRIL 2020-04-30-RELATORIO-PACTUACAO, NÃO TEM CONTRAPARTIDA
*/

--5961
select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO' 
	--and datareferencia = '30/04/2020' 
	and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' 

select sum(matriculas) from relatoriopactuacaocompleto where arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO' 
	and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' ;

--MARCAR COM OS ROTULOS
update relatoriopactuacaocompleto set datamanual = '30/04/2020' where arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO' 
	and datareferencia = '30/04/2020' and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA' 
	
--CHECAGEM FINAL 
select sum(matriculas) from relatoriopactuacaocompleto where datamanual = '30/04/2020'	

--COPIANDO PARA TABELA DADOS
insert into dados select * from relatoriopactuacaocompleto WHERE datamanual = '30/04/2020' and matriculas > 0;

select sum(matriculas) from dados WHERE datamanual = '30/04/2020';

/*
AJUSTANDO O PERIODO QUE AINDA NAO VINHA NAS PLANILHAS
PACTUAçãO REDE FEDERAL FIC-EAD 2020 E/OU PACTUAçãO NOVOS CAMINHOS
OBS: os outros ou já acabaram ou ainda não começaram ou só tem presencial
Tudo que é federal é o primeiro. Tudo que não é, é Novos Caminhos.
Vou ajustar pela instituição.
*/
--select nomeunidade, strpos(nomeunidade,'FEDERA'), matriculas from dados WHERE datamanual = '30/04/2020';
update dados set periodo = 'PACTUAçãO NOVOS CAMINHOS' WHERE datamanual = '30/04/2020' and strpos(nomeunidade,'FEDERA') = 0;
update dados set periodo = 'PACTUAçãO REDE FEDERAL FIC-EAD 2020' WHERE datamanual = '30/04/2020' and strpos(nomeunidade,'FEDERA') > 0;

select sum(matriculas), periodo from dados WHERE datamanual = '30/04/2020' group by 2;
select * from dados WHERE datamanual = '30/04/2020' and periodo = 'PACTUAçãO NOVOS CAMINHOS' and matriculas > 0


--REPLIQUEI 2019 EM ABRIL PARA QUE MATRICULA FIQUE SEMPRE ACUMULADA
insert into vaga (aprovada, homologada, matricula, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, 
				 municipio, curso, instituicao, cargahoraria, periodopactuacao, nomeplanilha, sncontrapartida,
				 datamatricula, dataaprovacao, aprovadacontrapartida, ted, sei, valoraprovado, contapronatec,
				 formaoferta, modalidadedemanda, origemreplicacao)
select aprovada, homologada, matricula, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, 
				 municipio, curso, instituicao, cargahoraria, periodopactuacao, nomeplanilha, sncontrapartida,
				 '30/04/2020', dataaprovacao, aprovadacontrapartida, ted, sei, valoraprovado, contapronatec,
				 formaoferta, modalidadedemanda, 'datamatricula 31/12/2019'
from vaga 
where datamatricula = '31/12/2019';

