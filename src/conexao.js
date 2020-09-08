const { Client } = require("pg");
var hash = require('hash.js')

module.exports = class DB {
  constructor(_user, _host, _dataBase, _password, _port) {
    this.user = _user;
    this.host = _host;
    this.dataBase = _dataBase;
    this.password = _password;
    this.port = _port;
  }

  conectar() {
    const client = new Client({
      user: this.user,
      host: this.host,
      database: this.dataBase,
      password: this.password,
      port: this.port,
    });

    this.client = client;
    client.connect();
  }

  fecharConexao() {
    this.client.end();
  }

  async findAll() {
    try {
      const text = "SELECT * FROM pessoas";

      this.conectar();
      const result = await this.client.query(text);
      return result.rows;
    } catch (error) {
      return JSON.stringify({
        "log do erro": `${error}`,
        mensagem: "Houve algum problema com a conexão com o banco de dados =/",
      });
    } finally {
      this.fecharConexao();
    }
  }

  async find(id) {
    try {
      const text = "SELECT * FROM pessoas WHERE id_pessoa="+id;

      this.conectar();
      var result = await this.client.query(text);
      return result.rows;
    } catch (error) {
      return JSON.stringify({
        "log do erro": `${error}`,
        mensagem: "Houve algum problema com a conexão com o banco de dados =/",
      });
    } finally {
      this.fecharConexao();
    }
  }

  async insert (nome, cpf, senha){
    try {
      const senhaComHASH  = hash.sha256().update(senha).digest('hex')
      const senhaCPF      = hash.sha256().update(senha+cpf).digest('hex')
      const text          = `INSERT INTO pessoas VALUES ('${nome}', '${cpf}', '${senhaComHASH}', default)`;

      this.conectar();
      await this.client.query(text);
      
      //PESQUISA O ÚLTIMO ID DA TABELA DE PESSOAS
      const ultimoID      = await this.client.query("SELECT MAX(id_pessoa) FROM pessoas")
      const sqlSalt       = `INSERT INTO salt VALUES(${parseInt(ultimoID.rows[0].max)}, default, '${senhaCPF}')`
      await this.client.query(sqlSalt)
      return "inserido com sucesso"
    } catch (error) {
      return JSON.stringify({
        "log do erro": `${error}`,
        mensagem: "Houve algum problema com a conexão com o banco de dados =/",
      });
    } finally {
      this.fecharConexao();
    }
  }

  async delete (id){
    try {
      const text = "DELETE from pessoas WHERE id_pessoa="+id;

      this.conectar();
      await this.client.query(text);
      return "deletado com sucesso"
    } catch (error) {
      return JSON.stringify({
        "log do erro": `${error}`,
        mensagem: "Houve algum problema com a conexão com o banco de dados =/",
      });
    } finally {
      this.fecharConexao();
    }
  }

  async update (nome, cpf, senha, id_pessoa){
    try {
      const senhaComHASH  = hash.sha256().update(senha).digest('hex')
      const senhaCPF      = hash.sha256().update(senha+cpf).digest('hex')
      const text          = `UPDATE pessoas SET nome='${nome}', cpf='${cpf}', senha='${senhaComHASH}' WHERE id_pessoa=${id_pessoa}`;
      this.conectar();

      //PESQUISA O ÚLTIMO ID DA TABELA DE PESSOAS
      const sqlSalt = `UPDATE salt SET id_pessoa=${id_pessoa}, id_hash=default, hash='${senhaCPF}' WHERE id_pessoa=${id_pessoa}`
      console.log("Senha com hash: " + senhaComHASH )
      console.log("SenhaCPF: " + senhaCPF )
      await this.client.query(sqlSalt)

      await this.client.query(text);
      return "alterado com sucesso"
    } catch (error) {
      return JSON.stringify({
        "log do erro": `${error}`,
        mensagem: "Houve algum problema com a conexão com o banco de dados =/",
      });
    } finally {
      this.fecharConexao();
    }
  }
};
