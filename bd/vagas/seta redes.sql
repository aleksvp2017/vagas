update vaga set rede = 'Federal' where upper(instituicao) in (select upper(sigla) from instituicaoensino where esfera='Federal');
update vaga set rede = 'Estados, DF, Municípios' where upper(instituicao) in (select upper(sigla) from instituicaoensino where esfera<>'Federal');

--select * from instituicaoensino
--update instituicaoensino set esfera = upper(esfera)