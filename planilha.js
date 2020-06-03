const estrutura = {
    nome: 'Vagas',
    colunasObrigatorias: ['ANO'],
    colunasAtualizaveis: ['uf','ano', 'saldo', 'valoraprovado', 'aprovada', 'homologada', 'matricularealizada',
        'modalidade', 'acao', 'tiporede', 'ted', 'tipocurso'],
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
      MATRICULAREALIZADA: {
        nome: 'MATRICULAREALIZADA',
        validar(valor){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
        }
      },
      MODALIDADE: {
        nome: 'MODALIDADE',
        validar(valor){
            if (valor != ''&& valor != 'EaD' && valor != 'Presencial') {
                return 'Coluna ' + this.nome + ' deve ter um dos seguintes valores: EaD ou Presencial'
            }
        }
      },
      ACAO: {
        nome: 'ACAO',
        validar(valor){
          if (valor != 'Repactuação' && valor != 'Novas') {
              return 'Coluna ' + this.nome + ' deve ter valor Repactuação ou Novas'
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
    }
  }

  module.exports = {
      estrutura
  }