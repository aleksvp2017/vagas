--##############2020 Primeira fase



--IFTO
select dataaprovacao
--sum(aprovada) 
from 
vaga where instituicao = 'IFTO' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020'

update vaga
set sei = '23000.011695/2020-11', ted = '9383'
 where instituicao = 'IFTO' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2020';

--ETS/UFPB
select dataaprovacao,sum(aprovada) 
from 
vaga where nomeplanilha = 'TEMPLATE_REDE_FEDERAL_V3.2___OFERTA_DE_NOVAS_TURMAS__CORRIGIDO.XLSX'
group by 1;

update vaga
set sei = '23000.012706/2020-71', ted = '9382', dataaprovacao='31/08/2020'
where nomeplanilha = 'TEMPLATE_REDE_FEDERAL_V3.2___OFERTA_DE_NOVAS_TURMAS__CORRIGIDO.XLSX';

--IFPA
select dataaprovacao, sum(aprovada) 
from 
vaga where instituicao = 'IFPA' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019'
group by 1

update vaga
set sei = '23000.012541/2020-38', ted = '9354'
 where instituicao = 'IFPA' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019';

select *
--dataaprovacao, sum(aprovada) 
from 
vaga where instituicao = 'IFNMG' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019'
group by 1

select sum(aprovada) from vaga where sei = '23000.012333/2020-39'
update vaga set dataaprovacao = '31/05/2020', periodopactuacao='PACTUAÇÃO REDE FEDERAL FIC-EAD 2020' where sei = '23000.012333/2020-39'


--##############2019
--IFBA (esse cara está no controle - 1)
select --dataaprovacao
sum(aprovada) 
from 
vaga where instituicao = 'IFBA' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2019'  and dataaprovacao = '30/04/2020';

update vaga
set sei = '23000.013040/2020-79', ted = '9384'
 where instituicao = 'IFBA' and periodopactuacao = 'PACTUAÇÃO REDE FEDERAL FIC-EAD 2029' and dataaprovacao = '30/04/2020';


update vaga
set sei = '23000.035843/2019-41', ted = '9063'
where nomeplanilha ilike 'Template_Rede_Federal_V3.2.xlsx';


update vaga
set sei = '23000.035738/2019-10', ted = '9057'
where nomeplanilha ilike 'Template_TEDs_IFSULMG_Retificado3.xlsx';

update vaga
set sei = '23000.035835/2019-02', ted = '9051'
where nomeplanilha ilike 'IFAP - 2019.xlsx';

update vaga
set sei = '23000.035745/2019-11', ted = '9048'
where nomeplanilha ilike 'UFRPE - 2019.xlsx';

update vaga
set sei = '23000.035699/2019-42', ted = '9043'
where nomeplanilha ilike 'IFRO-2019.xlsx';

update vaga
set sei = '23000.035736/2019-12', ted = '9040'
where nomeplanilha ilike 'IFBA - 2019.xlsx';

update vaga
set sei = '23000.030830/2019-85', ted = '8748'
where nomeplanilha ilike 'IFPR - 2019.xlsx';

update vaga
set sei = '', ted = ''
where nomeplanilha ilike '.xlsx';
