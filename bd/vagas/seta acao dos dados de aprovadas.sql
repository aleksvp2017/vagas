--SETA ACAO DAS LINHAS COM APROVADAS
update vaga set acao = 'Rede Federal - Fase 1' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020';
update vaga set acao = 'Rede Federal - Fase 2' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 2ª FASE';
update vaga set acao = 'Rede Federal' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019';
update vaga set acao = 'Repactuação - 2019' where periodopactuacao IN ('FASE1','FASE 2 EAD');
update vaga set acao = 'Rede Federal - Fase 3' where periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020 3ª FASE';
update vaga set acao = 'Repactuação - 2020' where periodopactuacao IN ('COVID');
