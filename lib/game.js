const CHARACTERS = {
  Mario:    { name: 'Mario',    speed: 4, handling: 3, power: 3 },
  Peach:    { name: 'Peach',    speed: 3, handling: 4, power: 2 },
  Yoshi:    { name: 'Yoshi',    speed: 2, handling: 4, power: 3 },
  Bowser:   { name: 'Bowser',   speed: 5, handling: 2, power: 5 },
  Luigi:    { name: 'Luigi',    speed: 3, handling: 4, power: 4 },
  DonkeyK:  { name: 'DonkeyK',  speed: 2, handling: 2, power: 5 }
};

const BLOCKS = ['RETA', 'CURVA', 'CONFRONTO'];

function rollDie() {
  return Math.floor(Math.random() * 6) + 1; // 1..6
}

function cloneCharacter(input) {
  if (!input || typeof input !== 'object') throw new Error('character must be an object');
  if (input.name && CHARACTERS[input.name]) {
    const base = CHARACTERS[input.name];
    return { name: base.name, speed: base.speed, handling: base.handling, power: base.power };
  }
  const { name = 'Custom', speed, handling, power } = input;
  if (![speed, handling, power].every(v => typeof v === 'number')) {
    throw new Error('custom character must provide numeric speed, handling and power');
  }
  return { name, speed, handling, power };
}

function validateCharacterInput(input, label = 'character') {
  if (!input || typeof input !== 'object') throw new Error(`${label} is required`);
  if (input.name && CHARACTERS[input.name]) return true;
  if (typeof input.speed === 'number' && typeof input.handling === 'number' && typeof input.power === 'number') return true;
  throw new Error(`${label} must be either a known name or include numeric speed, handling and power`);
}

function simulateRace(rawP1, rawP2, rounds = 5) {
  const p1 = cloneCharacter(rawP1);
  const p2 = cloneCharacter(rawP2);

  const logRounds = [];
  let score1 = 0;
  let score2 = 0;

  for (let i = 0; i < rounds; i++) {
    const block = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
    let attrName;
    if (block === 'RETA') attrName = 'speed';
    else if (block === 'CURVA') attrName = 'handling';
    else attrName = 'power';

    const die1 = rollDie();
    const die2 = rollDie();
    const total1 = die1 + (p1[attrName] || 0);
    const total2 = die2 + (p2[attrName] || 0);

    let roundWinner = null;
    let roundLoser = null;
    let note = '';

    if (block === 'CONFRONTO') {
      if (total1 > total2) {
        roundWinner = p1.name;
        roundLoser = p2.name;
        score2 = Math.max(0, score2 - 1);
      } else if (total2 > total1) {
        roundWinner = p2.name;
        roundLoser = p1.name;
        score1 = Math.max(0, score1 - 1);
      } else {
        note = 'Empate — nenhum perde ponto';
      }
    } else {
      if (total1 > total2) {
        roundWinner = p1.name;
        score1 += 1;
      } else if (total2 > total1) {
        roundWinner = p2.name;
        score2 += 1;
      } else {
        note = 'Empate — sem alteração de pontos';
      }
    }

    logRounds.push({
      round: i + 1,
      block,
      attributeUsed: attrName,
      player1: { name: p1.name, die: die1, attr: p1[attrName], total: total1 },
      player2: { name: p2.name, die: die2, attr: p2[attrName], total: total2 },
      roundWinner,
      roundLoser,
      scoresAfterRound: { [p1.name]: score1, [p2.name]: score2 },
      note
    });
  }

  let winner = null;
  if (score1 > score2) winner = p1.name;
  else if (score2 > score1) winner = p2.name;
  else winner = 'EMPATE';

  return {
    players: { player1: p1, player2: p2 },
    rounds: logRounds,
    finalScores: { [p1.name]: score1, [p2.name]: score2 },
    winner
  };
}

module.exports = { simulateRace, CHARACTERS, validateCharacterInput };
