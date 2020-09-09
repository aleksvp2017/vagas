

--05/2020
/*
PACTUAçãO REDE FEDERAL FIC-EAD 2020 E/OU
PACTUAçãO NOVOS CAMINHOS
OBS: os outros ou já acabaram ou ainda não começaram ou só tem presencial
*/
DO $$DECLARE 
	linha dados%rowtype;
	qtde int;
	linhaJaExiste bool;
	linhaExistente record;
	vagasExistentes int;
	totalExistente int;
	totalNova int;
BEGIN
	raise notice '###################################';
	totalExistente := 0;
	totalNova := 0;
	qtde := 0;
	vagasExistentes := 0;
	FOR linha IN 
		select * from relatoriopactuacaocompleto where 
			(arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' and matriculas > 0
			and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA') or
			(arquivoorigem ILIKE 'CONTRAPARTIDA-2020-05%')
	LOOP
		--RAISE NOTICE 'Linha: %', linha;
		linhaJaExiste := false;
		/*select * into linhaExistente from dados where instituicao = linha.instituicao and uf = linha.uf and municipio = linha.municipio
			and tipocurso = linha.tipocurso and modalidadeensino = linha.modalidadeensino 
			and nomecurso = linha.nomecurso and cargahoraria = linha.cargahoraria and homologadas = linha.homologadas
			--MAIO É UM DESSES DOIS PERIODOS, NÃO CONSIGO DISTINGUIR QUAL
			and periodo in ('PACTUAçãO REDE FEDERAL FIC-EAD 2020', 'PACTUAçãO NOVOS CAMINHOS');
		--raise notice '%', linhaExistente.id;
		if (linhaExistente.id is not null) then
			if (linhaExistente.matriculas <> linha.matriculas) then
				raise notice 'Linha existente: % % ', linhaExistente.id, linhaExistente.matriculas;
				raise notice 'Linha nova: % %', linha.id, linha.matriculas;	
				totalExistente := totalExistente + linhaExistente.matriculas;
				totalNova := totalNova + linha.matriculas;
				--if (linha.matriculas > linhaExistente.matriculas) then
					linha.matriculas := linha.matriculas - linhaExistente.matriculas;
				--end if;
			else
				linhaJaExiste := true;
			end if;
			--raise exception 'para';
			
			vagasExistentes := vagasExistentes + linhaExistente.matriculas;
		end if;*/
		
		if (linhaJaExiste = false) then
			insert into dados select linha.*;
			qtde := qtde + 1;
		end if;
		
    END LOOP;
	--raise notice 'Linhas inseridas: %', qtde;
	--raise notice 'Vagas existentes: %', vagasExistentes;
	--raise notice 'Existentes: %  Novas: % ', totalExistente, totalNova;
	--raise exception 'Matriculas diferentes!!!';
END$$;

/*
select * from dados where periodo in ('PACTUAçãO REDE FEDERAL FIC-EAD 2020', 'PACTUAçãO NOVOS CAMINHOS')
select instituicao, uf, municipio, nomeunidade, tipocurso, nomecurso, periodo, modalidadeensino,cargahoraria, homologadas, matriculas,*
	from relatoriopactuacaocompleto where id in (3496, 9230)
select sum(matriculas) from dados where arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' or arquivoorigem ilike 'CONTRAPARTIDA-2020-05%'
delete from dados where arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO' 
Existentes: 1036  Novas: 2863
27603+4902
*/

select * from dados1, dados2
where dados1.arquivoorigem = 'CONTRAPARTIDA-2020-05-27'
	and instituicao = linha.instituicao 
	and uf = linha.uf 
	and municipio = linha.municipio
	and tipocurso = linha.tipocurso
	and modalidadeensino = linha.modalidadeensino 
	and nomecurso = linha.nomecurso 
	and cargahoraria = linha.cargahoraria 
	and homologadas = linha.homologadas