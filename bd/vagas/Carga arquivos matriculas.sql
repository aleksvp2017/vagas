--ARQUIVO COM TODOS DADOS DE 2019 MAIS DADOS DE 2020 ATE 24/08
delete from relatoriopactuacaocompleto
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  codigomunicipio,
  municipio,
  codigounidade,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  periodo,
  modalidadeensino, 
  cargahoraria,
  modalidadedemanda,       
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma, 
  datapublicacao, 
  datafimmatricula, 
  matriculas)
FROM 'C:\Program Files\PostgreSQL\Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020.csv' DELIMITER ',' CSV HEADER;
update relatoriopactuacaocompleto set arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020'
, datareferencia = '31/12/2019' where arquivoorigem is null;
--DEIXAR SO O QUE ESTA CONTANDO NOS RELATORIOS DO GILSON QUE É "PACTUAÇÃO RESTRITA REDE FEDERAL 2019"
update relatoriopactuacaocompleto set datareferencia = null where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020';
-- A SOMA DOS DOIS ABAIXO COMPOE REDE FEDERAL 2019 NA PLANILHA DO GILSON
update relatoriopactuacaocompleto set datareferencia = '31/12/2019' where 
arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' and periodo = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2019';
update relatoriopactuacaocompleto set datareferencia = '31/12/2019' where 
arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' and periodo = 'PACTUAÇÃO RESTRITA REDE FEDERAL 2020';
update relatoriopactuacaocompleto set datareferencia = '31/12/2019' where arquivoorigem = 'Relatorio_Pactuacao_Ofertas_Mat_2019_2020_24.08.2020' 
	and periodo = 'PACTUAçãO NOVOS CAMINHOS' and (tipocurso = 'TÉCNICO' or tipocurso = 'FIC') and modalidadeensino = 'EDUCAÇÃO PRESENCIAL'



--2020-03-30
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  municipio,
  nomeunidade, 
  nomecurso,
  modalidadeensino, 
  cargahoraria,     
  homologadas,
  situacaoturma, 
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-03-30-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;
update relatoriopactuacaocompleto set arquivoorigem = '2020-03-30-RELATORIO-PACTUACAO'
, datareferencia = '30/03/2020' where arquivoorigem is null;
update relatoriopactuacaocompleto set tipocurso = 'TÉCNICO' where datareferencia = '30/03/2020' and to_number(cargahoraria,'9999')>=800;
update relatoriopactuacaocompleto set tipocurso = 'FIC' where datareferencia = '30/03/2020' and to_number(cargahoraria,'9999')<800;

--2020-04-30
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  municipio,
  nomeunidade, 
  tipocurso,
  nomecurso,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,								
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-04-30-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-04-30-RELATORIO-PACTUACAO'
, datareferencia = '30/04/2020' where arquivoorigem is null and modalidadeensino = 'EDUCAÇÃO A DISTÂNCIA';


--2020-05-31
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  municipio,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,								
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-05-31-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-05-31-RELATORIO-PACTUACAO'
, datareferencia = '31/05/2020' where arquivoorigem is null;

--2020-06-28
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  municipio,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  periodo,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,								
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-06-28-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-06-28-RELATORIO-PACTUACAO'
, datareferencia = '28/06/2020' where arquivoorigem is null;


--2020-07-29
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  codigomunicipio,
  municipio,
  codigounidade,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  periodo,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,								
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-07-29-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-07-29-RELATORIO-PACTUACAO'
, datareferencia = '29/07/2020' where arquivoorigem is null;


--2020-08-24
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  codigomunicipio,
  municipio,
  codigounidade,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  periodo,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,	
  datapublicacao, 
  datafimmatricula,						
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-08-24-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-08-24-RELATORIO-PACTUACAO'
, datareferencia = '24/08/2020' where arquivoorigem is null;


--2020-08-31
COPY relatoriopactuacaocompleto(instituicao,
  uf,
  codigomunicipio,
  municipio,
  codigounidade,
  nomeunidade, 
  tipocurso,
  codigocurso,
  nomecurso,
  periodo,
  modalidadeensino, 
  cargahoraria,  
  modalidadedemanda,
  homologadas,
  situacaoturma, 
  datainicioturma, 
  dataterminoturma,	
  datapublicacao, 
  datafimmatricula,						
  matriculas)
FROM 'C:\Program Files\PostgreSQL\2020-08-31-RELATORIO-PACTUACAO.csv' DELIMITER ',' CSV HEADER;

update relatoriopactuacaocompleto set arquivoorigem = '2020-08-31-RELATORIO-PACTUACAO'
, datareferencia = '31/08/2020' where arquivoorigem is null;



