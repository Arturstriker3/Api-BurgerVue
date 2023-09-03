const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Obter a lista de ingredientes
app.get('/api/ingredientes', (req, res) => {
  const ingredientes = JSON.parse(fs.readFileSync('db.json', 'utf8')).ingredientes;
  res.json(ingredientes);
});

// Obter a lista de status
app.get('/api/status', (req, res) => {
  const status = JSON.parse(fs.readFileSync('db.json', 'utf8')).status;
  res.json(status);
});

// Atualizar um pedido de burger existente pelo ID
app.patch('/api/burgers/:id', (req, res) => {
  const burgerId = parseInt(req.params.id);
  const burgerAtualizado = req.body;

  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const index = data.burgers.findIndex((burger) => burger.id === burgerId);

  if (index === -1) {
    return res.status(404).json({ message: 'Burger not found' });
  }

  data.burgers[index] = { ...data.burgers[index], ...burgerAtualizado };
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  res.json(data.burgers[index]);
});

// Excluir um pedido de burger pelo ID
app.delete('/api/burgers/:id', (req, res) => {
  const burgerId = parseInt(req.params.id);

  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const index = data.burgers.findIndex((burger) => burger.id === burgerId);

  if (index === -1) {
    return res.status(404).json({ message: 'Burger not found' });
  }

  const deletedBurger = data.burgers.splice(index, 1)[0];
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  res.json(deletedBurger);
});

// Obter a lista de burgers
app.get('/api/burgers', (req, res) => {
  const burgers = JSON.parse(fs.readFileSync('db.json', 'utf8')).burgers;
  res.json(burgers);
});

// Adicionar um novo burger
app.post('/api/burgers', (req, res) => {
  const novoBurger = req.body;
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  novoBurger.id = data.burgers.length + 1;
  data.burgers.push(novoBurger);
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  res.json(novoBurger);
});

// Rota de teste para verificar se a API está funcionando
app.get('/api/funcionando', (req, res) => {
  res.json({ message: 'Funcionando' });
});

// Log a cada 5 minuto
setInterval(() => {
    console.log('API Funcionando');
  }, 300 * 1000);

app.listen(port, () => {
  console.log(`API está executando na porta ${port}`);
});