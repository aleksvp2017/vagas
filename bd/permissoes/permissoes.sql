CREATE TABLE tassi (
  id SERIAL,
  uf varchar(500),
  municipio varchar(500),
  instituicao varchar(500),
  unidadedeensino  varchar(500),
  tipodecurso  varchar(500),
  nomecurso  varchar(500),
  modalidadedeensino  varchar(500),
  turno varchar(500),
  tipooferta  varchar(500),
  subeixotecnologico  varchar(500),
  cursos varchar(500),
  matriculas  varchar(500),
  vagas  varchar(500),
  regiaointermediaria  varchar(500),
  regiaoimediata  varchar(500),
  municipio1  varchar(500),
  PRIMARY KEY (id)
)

COPY tassi(uf, municipio, instituicao, unidadedeensino, tipodecurso, nomecurso,
		   modalidadedeensino, turno, tipooferta, subeixotecnologico, cursos,
		   matriculas, vagas, regiaointermediaria, regiaoimediata, municipio1)
FROM '/Users/aleksvp/tassi.csv' DELIMITER ',' CSV HEADER
select * from tassi
select distinct subeixotecnologico from tassi


--CENARIO 1		  
select distinct unidadedeensino from tassi 
select distinct municipio from tassi 
select distinct regiaoimediata from tassi 
select distinct regiaointermediaria from tassi 
select distinct uf from tassi 
CENÁRIO 1
476 unidades de ensino
442 municípios
318 regiões imediatas
129 regiões intermediárias
27 UFs

--CENARIO 2		  
select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial'
select distinct municipio from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial'
)
select distinct regiaoimediata from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial'
)
select distinct regiaointermediaria from tassi 
where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial'
)
select distinct uf from tassi 
where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial'
)
CENÁRIO 2
469 unidades de ensino
439 municípios
316 regiões imediatas
128 regiões intermediárias
27 UFs
	
--CENARIO 3		  
select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) >= 25
select distinct municipio from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) >= 25)
select distinct regiaoimediata from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) >= 25)
select distinct regiaointermediaria from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) >= 25)
select distinct uf from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) >= 25)
		  
CENÁRIO 3		  
443 unidades de ensino
417 municípios
307 regiões imediatas
126 regiões intermediárias
27 UFs	

--CENARIO 4		  
select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) > 40
select distinct municipio from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) > 40)
select distinct regiaoimediata from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) > 40)
select distinct regiaointermediaria from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) > 40)
select distinct uf from tassi where unidadedeensino in
(select distinct unidadedeensino from tassi 
	where modalidadedeensino = 'Educação Presencial' and
		  cast(matriculas as integer) > 40)		  
CENÁRIO 4		  
420 unidades de ensino
396 municípios
296 regiões imediatas
125 regiões intermediárias
27 UFs	

--CENARIO 5
select distinct unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1

select distinct municipio from tassi where unidadedeensino in
(select distinct unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1)

select distinct regiaoimediata from tassi where unidadedeensino in
(select distinct unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1)

select distinct regiaointermediaria from tassi where unidadedeensino in
(select distinct unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1)

select distinct uf from tassi where unidadedeensino in
(select distinct unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1)


CENÁRIO 5		  
278 unidades de ensino
269 municípios
225 regiões imediatas
115 regiões intermediárias
27 UFs	






-------TEMP
select distinct unidadedeensino 
from tassi
innner join (select curso)

select matriculas from tassi where matriculas = '1.251'	
update tassi set matriculas = '1251' where matriculas = '1.251'

select municipio 
from tassi tassi1
inner join (select unidadedeensino 
			from tassi tassi2
		    where tassi2.municipio = tassi1.municipio
		    group by 1 having count(1) > 1) as teste
			
			
select municipio 
from 			
(select distinct municipio, unidadedeensino from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1

select unidadedeensino 
from 			
(select distinct unidadedeensino, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 1

select * from tassi where unidadedeensino = 'Campus Floriano'



select distinct unidadedeensino from tassi where municipio = 'Belo Horizonte'

select municipio 
from 			
(select distinct municipio, tipodecurso from tassi 
group by 1,2
order by 1,2) as agrupado
group by 1 having count(1)> 2


DO 
$$
	DECLARE 
		LINHA record;
		
	
	BEGIN
    	FOR LINHA IN SELECT * FROM TASSI
	    LOOP
    	    RAISE NOTICE 'LINHA:%',LINHA;
	    END LOOP;
	END
$$;