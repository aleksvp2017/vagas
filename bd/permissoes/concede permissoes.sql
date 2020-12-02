--FICAR ATENTO QUE NOME DO RECURSO TEM QUE BATER COM NOME NO routes.js NA UI

select * from operacao
select * from recurso
select * from permissao

insert into operacao (recursoid, nome, uri) values (2, 'listarColunas', '')
insert into permissao (usuarioid, operacaoid) values (4, 14)

update operacao set uri = '/vagas/colunas' where operacaoid = 17

update recurso set nome = 'Evolução de Vagas por Rede' where recursoid = 9

insert into operacao (recursoid, nome, uri) values (2, 'listarPlanilhas', '/vagasplanilha')
insert into operacao (recursoid, nome, uri) values (9, 'consultar', '/evolucaovagasporrede')
insert into permissao (usuarioid, operacaoid) values (4, 15)

insert into recurso (nome, path, snmenu) values ('Evolução Vagas por Rede','/evolucaovagasporrede', true)
insert into recurso (nome, path, snmenu) values ('Painel','/painel', true)
insert into operacao (recursoid, nome, uri) values (7, 'consultar', '/painel')
insert into permissao (usuarioid, operacaoid) values (4, 17)
insert into permissao (usuarioid, operacaoid) values (4, 21)

select * from usuario
insert into permissao (usuarioid, operacaoid) values (15, 17);
insert into permissao (usuarioid, operacaoid) values (15, 18);
insert into permissao (usuarioid, operacaoid) values (15, 19);


--PARA RECURSOS NOVOS DE MENU, LEMBRAR DE CONFIGURAR NO ROUTE.JS DA UI

select distinct r.* from recurso r
inner join operacao op on op.recursoid = r.recursoid 
inner join permissao p on op.operacaoid = p.operacaoid
inner join usuario u on u.usuarioid = p.usuarioid 
where r.snmenu and u.email = 'aleksvp@gmail.com'