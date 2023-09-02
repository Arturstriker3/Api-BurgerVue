const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Usando variável de ambiente para a porta

app.use(bodyParser.json());

// Rota para obter todos os itens do banco de dados
app.get('/api/', (req, res) => {
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(data);
});

// Rota para adicionar um novo item ao banco de dados
app.post('/api/', (req, res) => {
  const newItem = req.body;
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  data.push(newItem);
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  res.json(newItem);
});

app.listen(port, () => {
  console.log(`API está executando na porta ${port}`);
});
