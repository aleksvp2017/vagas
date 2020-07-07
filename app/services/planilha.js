const Municipio = require('./municipio.js')
const Helper = require('./helper.js')

const estrutura = {
    nome: 'Vagas',
    colunasIdentificamUnicamente: ['uf', 'ano', 'mes','modalidadeeducacional', 'acao', 'tiporede', 'ted', 'tipodeconta', 
      'tipocurso', 'parceiro', 'municipio', 'turma'],
    colunasObrigatorias: ['ANO'],
    colunasAtualizaveis: ['uf','ano', 'saldo', 'valoraprovado', 'aprovada', 'homologada', 'matricula',
        'modalidadeeducacional', 'acao', 'tiporede', 'ted', 'tipodeconta','tipocurso', 'parceiro', 'municipio',
        'turma', 'mes'],
    colunasMetricas: ['saldo', 'valoraprovado', 'aprovada', 'homologada', 'matricula'],
    obterColuna(nome){
      var colunaEncontrada = null
      Object.entries(this.colunas).map(coluna => {
        if (Helper.isIguais(coluna[1].nome, nome)){
          colunaEncontrada = coluna[1]
        }
      })
      return colunaEncontrada
    },
    colunas: {
      ANO: {
        nome: 'ANO',
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        }
      },
      MES: {
        nome: 'MES',
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
          if (valor < 1 || valor > 12){
            return 'Coluna ' + this.nome + ' deve possuir valor entre 1 e 12'
          }
        }
      },      
      SALDO: {
        nome: 'SALDO',
        validar(valor){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
        }
      },
      VALORAPROVADO: {
        nome: 'VALORAPROVADO',
        validar(valor){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
        }
      },
      APROVADA: {
        nome: 'APROVADA',
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        }
      },
      HOMOLOGADA: {
        nome: 'HOMOLOGADA',
        validar(valor){
          //if (valor != ''){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
          //}
        }
      },
      MATRICULA: {
        nome: 'MATRICULA',
        validar(valor){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
        }
      },
      MODALIDADE: {
        nome: 'MODALIDADEEDUCACIONAL',
        validar(valor){
            if (valor != ''&& valor != 'EaD' && valor != 'Presencial') {
                return 'Coluna ' + this.nome + ' deve ter um dos seguintes valores: EaD ou Presencial'
            }
        }
      },
      ACAO: {
        nome: 'ACAO',
        validar(valor){
          if (valor && valor != 'Repactuação' && valor != 'Fomentos novos') {
              return 'Coluna ' + this.nome + ' deve ter valor Repactuação ou Fomentos novos'
          }
        }
      },  
      TIPOREDE: {
        nome: 'TIPOREDE',
        validar(valor){
          if (valor != '' && valor != 'Federal' && valor != 'Estadual / Distrital' && valor != 'Municipal' 
            && valor != 'Privada' && valor != 'Sistema S') {
              return 'Coluna ' + this.nome + ' deve ter valor Federal, Estadual / Distrital, Municipal, Privada, Sistema S ou vazia'
          }
        }
      },     
      TIPOCURSO: {
        nome: 'TIPOCURSO',
        validar(valor){
          if (valor != '' && valor != 'Técnico' && valor != 'FIC' ) {
              return 'Coluna ' + this.nome + ' deve ter valor Técnico ou FIC'
          }
        }
      },  
      TIPODECONTA: {
        nome: 'TIPODECONTA',
        validar(valor){
          if (valor && valor != 'Prisional' && valor != 'Mediotec' && valor != 'TD') {
              return 'Coluna ' + this.nome + ' deve ter valor Prisional, Mediotec ou TD'
          }
        }
      },        
      MUNICIPIO: {
        nome: 'MUNICIPIO',
        colunaDependente: 'UF',
        async validar(nome, uf){
          if (nome) {
              var municipio = await Municipio.obter(nome, uf)
              if (!municipio){
                return 'Município ' + nome + ' não encontrado na UF ' + uf 
              }
          }
        }
      },         
    }
  }


  module.exports = {
      estrutura
  }