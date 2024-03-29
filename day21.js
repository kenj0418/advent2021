const { readStringArrayFromFile } = require("./lib");

const roll = (game) => {
  let newRoll = game.die;
  game.die++;
  game.rollNum++;
  return newRoll;
}

const halfTurn = (game) => {
  const r1 = roll(game);
  const r2 = roll(game);
  const r3 = roll(game);
  const advanceBy = (r1 + r2 + r3 - 1) % 10 + 1;
  // console.log(`r1: ${r1}, r2: ${r2}, r3: ${r3}, advanceBy: ${advanceBy}`);

  if (game.p1Turn) {
    game.p1Pos += advanceBy;
    if (game.p1Pos > 10) {
      game.p1Pos -= 10;
    }
    game.p1Score += game.p1Pos;
  } else {
    game.p2Pos += advanceBy;
    if (game.p2Pos > 10) {
      game.p2Pos -= 10;
    }
    game.p2Score += game.p2Pos;
  }
  game.p1Turn = !game.p1Turn;
}

const hash = (p1Pos, p2Pos, p1Score, p2Score, p1Turn) => {
  return (p1Pos << 13) + (p2Pos << 8) + (p1Score << 5) + (p2Score < 1) + (p1Turn ? 1 : 0)
}

const run = () => {
  const data = readStringArrayFromFile("./input/day21.txt", "\n");
  const p1Start = parseInt(data[0].split(": ")[1]);
  const p2Start = parseInt(data[1].split(": ")[1]);

  const p1Victories = []
  const p2Victories = []
  for (let p1Pos = 1; p1Pos <= 10; p1Pos++) {
    for (let p2Pos = 1; p2Pos <= 10; p2Pos++) {
      for (let p1Score = 0; p1Score < 21; p1Score++) {
        for (let p2Score = 0; p2Score < 21; p2Score++) {
          const hash1 = hash(p1Pos, p2Pos, p1Score, p2Score, true);
          const hash2 = hash(p1Pos, p2Pos, p1Score, p2Score, false);
          p1Victories[hash1] = 0;
          p2Victories[hash2] = 0;
        }
      }
    }
  }

  console.log(`p1V Len: ${p1Victories.length}`)
  console.log(`p2V Len: ${p2Victories.length}`)

  // todo need to use the states to figure out the victory counts.  Can't just do brute force since it would take 300,000 seconds just for the for loop
  // todo only 88200 possible game states though
  throw new Error("TEST");
  const game = {
    die: 1, // 1,2,3
    p1Score: 0, // stop at 21
    p2Score: 0, // stop at 21
    p1Pos: p1Start, // 1 - 10
    p2Pos: p2Start, // 1 - 10
    p1Turn: true // T/F
  }

  // states = 21 * 21 * 10 * 10 * 2 = 88200
  // 444356092776315
  // 341960390180808
  // 786316482957123


  // console.log(`start pos: ${game.p1Pos} ${game.p2Pos}`);
  while (game.p1Score < 1000 && game.p2Score < 1000) {
    halfTurn(game);

    // console.log(`pos: ${game.p1Pos} ${game.p2Pos}`);
    // console.log(`scores: ${game.p1Score} ${game.p2Score}`);
    // console.log(`rolls: ${game.rollNum}`);
    // if (game.rollNum > 10) { throw new Error("TEST") }
  }

  const losingScore = (game.p1Score > game.p2Score) ? game.p2Score : game.p1Score;
  console.log(`scores: ${game.p1Score} ${game.p2Score}`);
  console.log(`rolls: ${game.rollNum}`);
  console.log(`answer: ${losingScore * game.rollNum}`);
};

module.exports = { run };