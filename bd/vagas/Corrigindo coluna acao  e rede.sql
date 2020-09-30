select distinct periodopactuacao, acao, rede, modalidadedeensino, to_date(datamatricula,'DD/MM/YYYY') , sum(matricula)
from vaga 
where matricula > 0 
--and rede = 'Federal'
--and periodopactuacao = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2020'
group by 1,2,3,4,5
order by to_date(datamatricula,'DD/MM/YYYY') ;

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

/*
select acao, rede, modalidadedeensino,  to_date(datamatricula,'DD/MM/YYYY'), sum(matricula)
from vaga
where periodopactuacao ilike 'PACTUAÇÃO NOVOS CAMINHOS'
and matricula > 0
group by 1,2,3,4

select *
from vaga where periodopactuacao ilike 'PACTUAÇÃO NOVOS CAMINHOS'
and matricula > 0 and datamatricula = '31/05/2020' and acao = ''
*/