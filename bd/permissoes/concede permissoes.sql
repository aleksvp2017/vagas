select * from operacao
select * from recurso
select * from permissao

insert into operacao (recursoid, nome, uri) values (2, 'excluirPlanilha', '/vagasplanilha')
insert into permissao (usuarioid, operacaoid) values (4, 14)

insert into operacao (recursoid, nome, uri) values (2, 'listarPlanilhas', '/vagasplanilha')
insert into permissao (usuarioid, operacaoid) values (4, 15)

