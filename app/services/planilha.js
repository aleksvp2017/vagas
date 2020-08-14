//const Municipio = require('./municipio.js')
const Helper = require('./helper.js')

const estrutura = {
    nome: 'Vagas',
    colunas: {
      NOMEPLANILHA:{
        nome: 'NOMEPLANILHA',
        snAtualizavel: true,
        nomeColunaBanco: 'nomeplanilha',
        getNomesPossiveis(){
          return ['nomeplanilha']
        }
      },
      PERIODOPACTUACAO: {
        nome: 'PERIODOPACTUACAO',
        snObrigatoria: false,
        snChave: true,
        snAtualizavel: true,
        nomeColunaBanco: 'periodopactuacao',
        getNomesPossiveis(){
          return ['periodopactuacao','periododepactuacao']
        }, 
      },      
      INSTITUICAO: {
        nome: 'INSTITUICAO',
        snObrigatoria: true,
        snChave: true,
        snAtualizavel: true,
        nomeColunaBanco: 'instituicao',
        getNomesPossiveis(){
          return ['instituicao','sigladainstituicao', 'orgao']
        }, 
      },  
      UF: {
        nome: 'UF',
        snObrigatoria: true,
        snChave: true,
        snAtualizavel: true,
        nomeColunaBanco: 'uf',
        getNomesPossiveis(){
          return ['uf','estadodolocaldaoferta']
        },
      },  
      MODALIDADEDEENSINO: {
        nome: 'MODALIDADEDEENSINO',
        snObrigatoria: true,  
        snChave: true,  
        snAtualizavel: true,
        nomeColunaBanco: 'modalidadedeensino',   
        //validar(valor){
            // if (valor != ''&& valor != 'EaD' && valor != 'Presencial') {
            //     return 'Coluna ' + this.nome + ' deve ter um dos seguintes valores: EaD ou Presencial'
            // }
        //},
        getNomesPossiveis(){
          return ['modalidadedeensino','modalidadeeducacional','MODALIDADE DE OFERTA\n(Presencial / EAD)']
        },        
      },
      ACAO: {
        nome: 'ACAO',
        snChave: true,   
        snAtualizavel: true,   
        nomeColunaBanco: 'acao',
        validar(valor){
          if (valor && valor != 'Repactuação' && valor != 'Fomentos novos') {
              return 'Coluna ' + this.nome + ' deve ter valor Repactuação ou Fomentos novos'
          }
        },
        getNomesPossiveis(){
          return ['acao']
        },        
      },       
      TIPODECURSO: {
        nome: 'TIPODECURSO',
        snObrigatoria: true,  
        snChave: true, 
        snAtualizavel: true,     
        nomeColunaBanco: 'tipodecurso',
        validar(valor){
          valor = valor.toUpperCase()
          if (valor && valor != 'TÉCNICO' && valor != 'FIC' ) {
              return 'Coluna ' + this.nome + ' deve ter valor Técnico ou FIC'
          }
        },
        getNomesPossiveis(){
          return ['tipodecurso', 'tipocurso','TIPO DE CURSO\n(Técnico / FIC)']
        },        
      },  
      CURSO: {
        nome: 'CURSO',
        snObrigatoria: true,
        snChave: true,
        snAtualizavel: true,
        nomeColunaBanco: 'curso',
        getNomesPossiveis(){
          return ['curso','nomedocurso']
        },        
      },              
      MUNICIPIO: {
        nome: 'MUNICIPIO',
        snObrigatoria: true,
        snChave: true,
        snAtualizavel: true,
        nomeColunaBanco: 'municipio',
        colunaDependente(){
          return estrutura.colunas['UF']
        },
        getNomesPossiveis(){
          return ['municipio','municipiodolocaldaoferta']
        },        
        /*async validar(nome, uf){
          //TAVA ONERANDO MUITO FAZER UM SELECT POR LINHA
          if (nome) {
              var municipio = await Municipio.obter(nome, uf)
              if (!municipio){
                return 'Município ' + nome + ' não encontrado na UF ' + uf 
              }
          }
        }, */       
      },              
      ANO: {
        nome: 'ANO',
        snChave: true,  
        snAtualizavel: true,
        nomeColunaBanco: 'ano',
        getNomesPossiveis(){
          return ['ano']
        },            
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        },
      },
      MES: {
        nome: 'MES',
        snChave: true,   
        snAtualizavel: true,  
        nomeColunaBanco: 'mes',
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
          if (valor < 1 || valor > 12){
            return 'Coluna ' + this.nome + ' deve possuir valor entre 1 e 12'
          }
        },
        getNomesPossiveis(){
          return ['mes']
        },         
      },      
      APROVADA: {
        nome: 'APROVADA',
        snAtualizavel: true, 
        snSomavel: true,
        nomeColunaBanco: 'aprovada',      
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        },
        getNomesPossiveis(){
          return ['aprovada', 'Vagas propostas (Digitar número de vagas)','QTDADE TOTAL DE VAGAS']
        }        
      },
      CARGAHORARIA: {
        nome: 'CARGAHORARIA',
        snAtualizavel: true, 
        snSomavel: true,
        nomeColunaBanco: 'cargahoraria',
        validar(valor){
          valor = parseInt(valor)
          if (!Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        },
        getNomesPossiveis(){
          return ['Carga horária do curso','Carga horária','CARGA HORÁRIA\n(Técnico: CNCT /\nFIC: mínimo 160h)']
        }         
      }, 
      VALORHORAAULA: {
        nome: 'VALORHORAAULA',
        snAtualizavel: true, 
        nomeColunaBanco: 'valorhoraaula',      
        getNomesPossiveis(){
          return ['Valor Hora-Aluno (Ex.: 10,00)','VALOR DA HORA-ALUNO\n(Presencial até R$ 10,00 / EAD até R$ 4,50)']
        }
      },            
      HOMOLOGADA: {
        nome: 'HOMOLOGADA',
        snAtualizavel: true,   
        snSomavel: true,
        nomeColunaBanco: 'homologada',   
        validar(valor){
          //if (valor != ''){
            valor = parseInt(valor)
            if (valor && !Number.isInteger(valor)){
                return 'Coluna ' + this.nome + ' deve ser um número inteiro'
            }
          //}
        },
        getNomesPossiveis(){
          return ['homologada','vagas']
        }        
      },
      MATRICULA: {
        nome: 'MATRICULA',
        snAtualizavel: true,   
        snSomavel: true,
        nomeColunaBanco: 'matricula',   
        validar(valor){
          valor = parseInt(valor)
          if (valor && !Number.isInteger(valor)){
              return 'Coluna ' + this.nome + ' deve ser um número inteiro'
          }
        },
        getNomesPossiveis(){
          return ['matricula','matriculas']
        },        
      },         
    },
    colunasBanco(nomeColunas){
      var nomesColunasBanco = []
      nomeColunas.map(nome => {
        var coluna = this.obterColuna(nome)
        nomesColunasBanco.push(coluna.nomeColunaBanco)
      })
      return nomesColunasBanco
    },
    colunasIdentificamUnicamente(){
      var colunasChave = []
      Object.entries(this.colunas).forEach(coluna => {
          if (coluna[1].snChave){
            colunasChave.push(coluna[1])
          }
      })
      return colunasChave      
    },
    //chave
    colunasObrigatorias(){
      var colunasObrigatorias = []
      Object.entries(this.colunas).map(coluna => {
          if (coluna[1].snObrigatoria){
            colunasObrigatorias.push(coluna[1])
          }
      })
      return colunasObrigatorias
    },
    colunasAtualizaveis(){
      var colunasAtualizaveis = []
      Object.entries(this.colunas).map(coluna => {

          if (coluna[1].snAtualizavel){
            colunasAtualizaveis.push(coluna[1])
          }
      })
      return colunasAtualizaveis
    },
    obterColuna(nome){
      var colunaEncontrada = null
      Object.entries(this.colunas).forEach(coluna => {
        coluna[1].getNomesPossiveis().forEach(nomePossivel => {
          if (Helper.isIguais(nomePossivel, nome)){
            colunaEncontrada = coluna[1]
            return
          }
        })
      })
      return colunaEncontrada
    },  
    colunasNaoChave(){
      var colunasNaoChave = []
      Object.entries(this.colunas).forEach(coluna => {

          if (!coluna[1].snChave){
            colunasNaoChave.push(coluna[1])
            return
          }
      })
      return colunasNaoChave
    },      
  }

  function isTodasColunasVazias(linha){
    var todasColunasVazias = true
    linha.forEach(valor => {
      if (valor){
        todasColunasVazias = false
        return
      }
    } )
    return todasColunasVazias
  }

  async function agruparLinhasIdenticas(matrizDados, cabecalho){
    var {linhasSemIdenticos, linhasComIdenticos} = await separaDadosEmIdenticosENaoIdenticos(matrizDados, cabecalho)
    linhasComIdenticos = somarLinhas(linhasComIdenticos, cabecalho)
    return [].concat(linhasSemIdenticos, linhasComIdenticos)
  }

  //Dada a matriz de dados, retorna um vetor com as linhas que não possuem identicas
  //e uma outra matriz com as que possuem identicas. Cada posicao da matriz tem um vetor com 
  //cada linha com suas identicas
  async function separaDadosEmIdenticosENaoIdenticos(matrizDados, cabecalho){
    var linhasComIdenticos = []
    var linhasSemIdenticos = []

    //Percorre a matriz, sempre tirando o primeiro elemento que será usado para buscar outros
    //iguais a ele. Os iguais tambem sao retirados da matriz
    while (matrizDados.length > 1){
      var linhaA = matrizDados[0] //buscar por identicos a esse
      matrizDados.splice(0,1) //tira o elemento da matri

      let identicosALinhaA = []
      var indiceLinhaB = 0
      //A partir do proximo, compara todos os itens da matriz com o linhaA
      //O loop tem que ser feito dessa forma pois a matriz vai sendo modificada
      while (indiceLinhaB < matrizDados.length) {
        var linhaB = matrizDados[indiceLinhaB]
        if (isIdenticos(linhaA, linhaB, cabecalho)){
          identicosALinhaA.push(linhaB)
          if (matrizDados.length == 1){
            matrizDados = []
          }
          else {
            //Tira o identico da matriz, para nao usar ele como chave de busca depois
            matrizDados.splice(indiceLinhaB,1)
            indiceLinhaB--
          }
        }
        indiceLinhaB++
      }
      //Se tiver algum identico, coloca o proprio no vetor
      //depois o vetor na matriz de identicos
      if (identicosALinhaA.length > 0){
        identicosALinhaA.push(linhaA)
        linhasComIdenticos.push(identicosALinhaA)
      }
      else{
          linhasSemIdenticos.push(linhaA)
      }
    }
    if (matrizDados.length > 0){
      linhasSemIdenticos.push(matrizDados[0])
    }
    return {linhasSemIdenticos, linhasComIdenticos}
}

function isIdenticos(linhaA, linhaB, cabecalho){
  var snIdenticos = true

  var indiceColuna = 0
  for (var colunaCabecalho of cabecalho) {
    coluna = estrutura.obterColuna(colunaCabecalho)
    if (coluna.snChave){
      if (linhaA[indiceColuna] !== linhaB[indiceColuna]){
        snIdenticos = false
        return
      }
    }
    indiceColuna++
  }
  
  return snIdenticos
}



function somarLinhas(matrizLinhas, cabecalho){
  var linhasSomadas = []
  matrizLinhas.map( (linhas => {
      var linhaSomada = []
      Object.assign(linhaSomada, linhas[0])      
      linhas.map((linha, indice) => {
        //Percorre os campos que devem ser somados
        cabecalho.map((colunaCabecalho, indiceColuna) => {
          coluna = estrutura.obterColuna(colunaCabecalho)
          if (coluna.snSomavel){
            if (indice !== 0){
              let itemA = parseInt(linhaSomada[indiceColuna])
              let itemB = parseInt(linha[indiceColuna])
              if (Number.isNaN(itemA)){
                  itemA = 0
              }
              if (Number.isNaN(itemB)){
                  itemB = 0
              }                    
              linhaSomada[indiceColuna] = itemA + itemB
            }
          }
        })
      })
      linhasSomadas.push(linhaSomada)
  }))
  return linhasSomadas
}

  module.exports = {
      estrutura, isTodasColunasVazias, agruparLinhasIdenticas
  }