--drop table relatoriopactuacaocompleto;
CREATE TABLE relatoriopactuacaocompleto (
  id SERIAL,
  instituicao varchar(500),
  uf varchar(500),
  codigomunicipio varchar(500),
  municipio varchar(500),
  codigounidade varchar(500),
  nomeunidade varchar(500), 
  tipocurso varchar(500),
  codigocurso varchar(500),
  nomecurso varchar(500),
  periodo varchar(500),
  modalidadeensino varchar(500),
  cargahoraria varchar(500),
  modalidadedemanda varchar(500),
  homologadas integer,
  situacaoturma varchar(500), 
  datainicioturma varchar(500), 
  dataterminoturma varchar(500), 
  datapublicacao varchar(500), 
  datafimmatricula varchar(500), 
  matriculas integer,
  datareferencia varchar(500),
  arquivoorigem varchar(500), 
  PRIMARY KEY (id)
)

alter table relatoriopactuacaocompleto add column sistemaensino varchar(500);
alter table relatoriopactuacaocompleto add column dependenciaadministrativa varchar(500);
alter table relatoriopactuacaocompleto add column subtipocursos varchar(500);
alter table relatoriopactuacaocompleto add column codigociclomatricula varchar(500);
alter table relatoriopactuacaocompleto add column ciclomatricula varchar(500);
alter table relatoriopactuacaocompleto add column statusciclomatricula varchar(500);
alter table relatoriopactuacaocompleto add column situacaociclomatricula varchar(500);
alter table relatoriopactuacaocompleto add column possuiestagio varchar(500);
alter table relatoriopactuacaocompleto add column datacriacao varchar(500);
alter table relatoriopactuacaocompleto add column datamanual varchar(500);


