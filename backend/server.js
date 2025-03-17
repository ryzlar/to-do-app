const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.json()); // Zorg ervoor dat JSON gegevens goed worden gelezen

// Endpoint om todo's op te halen
app.get('/todos', (req, res) => {
  fs.readFile(path.join(__dirname, 'todos.txt'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading todos file' });
    }
    const todos = data ? JSON.parse(data) : [];
    res.json(todos);
  });
});

// Endpoint om todo's op te slaan
app.post('/save-todos', (req, res) => {
  const todos = req.body;

  fs.writeFile(path.join(__dirname, 'todos.txt'), JSON.stringify(todos, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving todos' });
    }
    res.status(200).json({ message: 'Todos saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
