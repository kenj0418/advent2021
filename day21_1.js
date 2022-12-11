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

const run = () => {
  const data = readStringArrayFromFile("./input/day21.txt", "\n");
  const p1Start = parseInt(data[0].split(": ")[1]);
  const p2Start = parseInt(data[1].split(": ")[1]);

  let game = {
    rollNum: 0,
    die: 1,
    p1Score: 0,
    p2Score: 0,
    p1Pos: p1Start,
    p2Pos: p2Start,
    p1Turn: true
  }

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