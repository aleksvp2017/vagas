/*
JUN GILSON 60002  2 FASE 60.620  SOBRAM 618 
(218 DESSES DEVEM IR PARA JULHO - 23000.016532/2020-16 (2137230 explica a diferença)
	 E 400 PARA AGOSTO - OS 400 SUSPEITO QUE SEJAM O 23000.016409/2020-03 - COMPLEMENTO)
*/
--tive que inserir porque nao tem uma linha com o numero de vagas certinho
--no remanejo mudou muito, entao escolhi aleatoriamente o que se aproximava do que precisava
insert into vaga (aprovada, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, municipio, curso, instituicao,
				 cargahoraria, periodopactuacao, nomeplanilha, dataaprovacao)
select 7, acao, valorhoraaula, uf, modalidadedeensino, tipodecurso, municipio, curso, instituicao,
				 cargahoraria, periodopactuacao, nomeplanilha, dataaprovacao	
from vaga 
where nomeplanilha ilike 'IFRO_PLANILHA_REMANEJADA.xlsx'
and aprovada = 116	;

/*update vaga set aprovada = 7, aprovadacontrapartida=7
where nomeplanilha ilike 'IFRO_PLANILHA_REMANEJADA.xlsx'
and aprovada = 2	; */

update vaga set aprovada = 109, aprovadacontrapartida=109, dataaprovacao = '31/07/2020'
where nomeplanilha ilike 'IFRO_PLANILHA_REMANEJADA.xlsx'
and aprovada = 114	;

--select * from vaga where nomeplanilha ilike 'IFRO_PLANILHA_REMANEJADA.xlsx' and aprovada = 114