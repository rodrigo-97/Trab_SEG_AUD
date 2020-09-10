const DB = require('./conexao')

module.exports = class Crud {
  async listarPessoas(){
    const db = this.conectar()
    
    const result = await db.findAll()
    return JSON.stringify(result)
  }
  
  async listarID(id){
    const db = this.conectar()
  
    const result = await db.find(id)
    return JSON.stringify(result)
  }
  
  async incluir(nome, cpf, senha){
    const db = this.conectar()
  
    const result = await db.insert(nome, cpf, senha)
    return JSON.stringify(result)
  }
  
  async remover(id){
    const db = this.conectar()
  
    const result = await db.delete(id)
    return JSON.stringify(result)
  }
  
  async atualizar(nome, cpf, senha, id){
    const db = this.conectar()
  
    const result = await db.update(nome, cpf, senha, id)
    return JSON.stringify(result)
  }

  conectar () {
    const conexao = new DB('postgres', 'localhost', 'Pessoa', 'postgres', 5433)
    return conexao
  }

  async log () {
    const db = this.conectar()

    const result = await db.log()
    return JSON.stringify(result)
  }
}