const express = require('express');
const { simulateRace, CHARACTERS, validateCharacterInput } = require('./lib/game');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ info: 'Mario Kart Simulator API - POST /race' });
});

app.get('/characters', (req, res) => {
  res.json(CHARACTERS);
});

app.post('/race', (req, res) => {
  try {
    const { player1, player2, rounds } = req.body;
    validateCharacterInput(player1, 'player1');
    validateCharacterInput(player2, 'player2');

    const result = simulateRace(player1, player2, rounds || 5);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mario Kart Simulator listening on port ${PORT}`);
});
