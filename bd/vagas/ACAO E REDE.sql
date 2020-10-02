--MARCA REDE
update vaga set rede = 'Federal' where upper(instituicao) in (select upper(sigla) from instituicaoensino where esfera='Federal');
update vaga set rede = 'Estados, DF, Municípios' where upper(instituicao) in (select upper(sigla) from instituicaoensino where esfera<>'Federal');

--MARCA ACAO
update vaga set acao = '' where matricula > 0;

update vaga set acao = 'Repactuação - 2019' where matricula > 0 and periodopactuacao = 'PACTUAçãO NOVOS CAMINHOS' and datamatricula = '31/12/2019'
	and rede <> 'Federal';
	
update vaga set acao = 'Rede Federal' where matricula > 0 
	and periodopactuacao in ('PACTUAÇÃO RESTRITA REDE FEDERAL 2019', 'PACTUAÇÃO RESTRITA REDE FEDERAL 2020') 
	and datamatricula = '31/12/2019' and rede = 'Federal';
	
update vaga set acao = 'Repactuação - 2019' where matricula > 0 and periodopactuacao = 'PACTUAçãO NOVOS CAMINHOS' and datamatricula = '30/04/2020'
	and rede <> 'Federal';

update vaga set acao = 'Rede Federal' where matricula > 0 and periodopactuacao = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2019' and rede = 'Federal';

update vaga set acao = 'Repactuação - 2019' where matricula > 0 and periodopactuacao ilike 'PACTUAçãO NOVOS CAMINHOS%' 
	and modalidadedeensino = 'EDUCAÇÃO PRESENCIAL' and rede <> 'Federal';
	
update vaga set acao = 'Repactuação - 2020' where matricula > 0 and periodopactuacao ilike 'PACTUAçãO NOVOS CAMINHOS%' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede <> 'Federal';

update vaga set acao = 'Rede Federal' where matricula > 0 and periodopactuacao ilike 'PACTUAÇÃO RESTRITA REDE FEDERAL 2020' and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede = 'Federal';


update vaga set acao = 'Rede Federal - Fase 2' where matricula > 0 and periodopactuacao ilike 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede = 'Federal';
	
update vaga set acao = 'Rede Federal - Fase 3' where matricula > 0 and periodopactuacao ilike 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede = 'Federal';	
	
update vaga set acao = 'Rede Federal - Fase 1' where matricula > 0 and periodopactuacao ilike 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede = 'Federal';	

update vaga set acao = 'Rede Federal - Fase 1' where matricula > 0 and periodopactuacao ilike 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 SALDOS' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA'
	and rede = 'Federal';	

update vaga set acao = 'Rede Federal - Fase 1' where matricula > 0 and periodopactuacao ilike 'PACTUAçãO NOVOS CAMINHOS' 
	and modalidadedeensino = 'EDUCAÇÃO À DISTÂNCIA' and datamatricula = '31/05/2020' and acao = ''
	and rede = 'Federal';	
	
--SETA ACAO DAS LINHAS COM APROVADAS
update vaga set acao = 'Rede Federal - Fase 1' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020';
update vaga set acao = 'Rede Federal - Fase 2' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE';
update vaga set acao = 'Rede Federal' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019';
update vaga set acao = 'Repactuação - 2019' where periodopactuacao IN ('FASE1','FASE 2 EAD');
update vaga set acao = 'Rede Federal - Fase 3' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE';
update vaga set acao = 'Repactuação - 2020' where periodopactuacao IN ('COVID');
	