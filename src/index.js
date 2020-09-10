const express     = require('express')
const CRUD        = require('./CRUD')
var   cors        = require ('cors')
var   url         = require('url')
const bodyParser  = require("body-parser");
const PORTA = 8080
const app   = express()



app.listen(PORTA, ()=> console.log("Servidor iniciado na porta "+ PORTA))
const crud  = new CRUD()
app.use(cors())
app.use(bodyParser())



/**
 * LOG
 */

app.get("/log", async (req, res) => {
  const resultado = await crud.log()
  res.send(resultado)
})

app.get("/", async (req, res) => {
  const resultado = await crud.listarPessoas()
  res.send(resultado);
});

app.get("/pessoa", async (req, res) => {
  const resultado = await crud.listarID(req.query.id)
  res.send(resultado);
});

app.post('/incluir', async function (req, res) {
  const nome  = req.body.nome
  const cpf   = req.body.cpf
  const senha = req.body.senha
  res.send(crud.incluir(nome, cpf, senha))
});

app.post('/remover', async function (req, res) {
  const id    = req.body.id
  res.send(crud.remover(id));
});

app.put('/atualizar', async function (req, res) {
  const nome  = req.body.nome
  const cpf   = req.body.cpf
  const senha = req.body.senha
  const id    = req.body.id
  res.send(crud.atualizar(nome, cpf, senha, id));
});
