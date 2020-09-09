--EM MAIO, OS ARQUIVOS AINDA NAO VINHA ACUMULADOS, POR ISSO CARREGUEI OS TRES
--2020-05-19 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(sistemaensino,
  dependenciaadministrativa,
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-05-19-RELATORIO.csv' DELIMITER ',' CSV HEADER

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-05-19-RELATORIO'
, datareferencia = '31/05/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-05-19-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-05-19-RELATORIO' and to_number(cargahoraria,'9999')<800;


--2020-05-25 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(sistemaensino,
  dependenciaadministrativa,
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-05-25-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-05-25-RELATORIO'
, datareferencia = '31/05/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-05-25-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-05-25-RELATORIO' and to_number(cargahoraria,'9999')<800;


--2020-05-27 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(sistemaensino,
  dependenciaadministrativa,
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-05-27-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-05-27-RELATORIO'
, datareferencia = '31/05/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-05-27-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-05-27-RELATORIO' and to_number(cargahoraria,'9999')<800;


--2020-06-29 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-06-29-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-06-29-RELATORIO'
, datareferencia = '28/06/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-06-29-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-06-29-RELATORIO' and to_number(cargahoraria,'9999')<800;


--2020-07-30 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-07-30-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-07-30-RELATORIO'
, datareferencia = '29/07/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-07-30-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-07-30-RELATORIO' and to_number(cargahoraria,'9999')<800;



--2020-08-24 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-08-24-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-08-24-RELATORIO'
, datareferencia = '24/08/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-08-24-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-08-24-RELATORIO' and to_number(cargahoraria,'9999')<800;


--2020-08-31 CONTRAPARTIDA
COPY relatoriopactuacaocompleto(
  instituicao,
  uf,
  municipio,
  nomeunidade, 
  codigounidade,
  subtipocursos,
  nomecurso,
  codigociclomatricula,
  ciclomatricula,
  cargahoraria,  
  datainicioturma, 
  dataterminoturma,
  statusciclomatricula,
  situacaociclomatricula,
  possuiestagio,
  matriculas,
  datacriacao					
  )
FROM 'C:\Program Files\PostgreSQL\CONTRAPARTIDA-2020-08-31-RELATORIO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO'
, datareferencia = '31/08/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where arquivoorigem = 'CONTRAPARTIDA-2020-08-31-RELATORIO' and to_number(cargahoraria,'9999')<800;
