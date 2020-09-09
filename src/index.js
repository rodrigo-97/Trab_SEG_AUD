const express = require('express')
const CRUD    = require('./CRUD')


/*
* Servidor
*/
const PORTA = 1232
const app   = express()
app.listen(PORTA, ()=> console.log("Servidor iniciado na porta "+ PORTA))


/*
* Hash
*/
const crud  = new CRUD()



app.get("/", async (req, res) => {
  const resultado = await crud.listarPessoas()
  res.send(resultado);
});

app.get("/pessoa", async (req, res) => {
  const resultado = await crud.listarID(req.query.id)
  res.send(resultado);
});

app.post('/incluir', async function (req, res) {
  res.send(crud.incluir(req.query.nome, req.query.cpf, req.query.senha))
});

app.delete('/remover', async function (req, res) {
  console.log(req.query.id)
  res.send(crud.remover(req.query.id));
});

app.put('/atualizar', async function (req, res) {
  res.send(crud.atualizar(req.query.nome, req.query.cpf, req.query.senha, req.query.id));
});
