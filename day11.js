const { readStringArrayFromFile, sum } = require("./lib");

const createOct = (energy) => {
  return {
    energy,
    lastFlashed: -1,
    toFlash: false
  }
}

const increaseLevelForGrid = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j].energy++;
    }
  }
}

const getDirections = (grid, i, j) => {
  const maxI = grid.length - 1;
  const maxJ = grid[0].length - 1;

  const dirs = []
  if (i > 0) {
    if (j > 0) {
      dirs.push({ deltaI: -1, deltaJ: -1 });
    }
    dirs.push({ deltaI: -1, deltaJ: 0 });
    if (j < maxJ) {
      dirs.push({ deltaI: -1, deltaJ: 1 });
    }
  }
  if (j > 0) {
    dirs.push({ deltaI: 0, deltaJ: -1 });
  }
  if (j < maxJ) {
    dirs.push({ deltaI: 0, deltaJ: 1 });
  }
  if (i < maxI) {
    if (j > 0) {
      dirs.push({ deltaI: 1, deltaJ: -1 });
    }
    dirs.push({ deltaI: 1, deltaJ: 0 });
    if (j < maxJ) {
      dirs.push({ deltaI: 1, deltaJ: 1 });
    }
  }

  return dirs;
}

const increaseAdjacent = (grid, i, j) => {
  getDirections(grid, i, j).forEach((dir) => {
    grid[i + dir.deltaI][j + dir.deltaJ].energy++;
  })
}

const flash = (grid, turn) => {
  let flashes = 0;
  let flashesThisRound = 0;

  do {
    flashesThisRound = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].energy > 9 && grid[i][j].lastFlashed < turn) {
          grid[i][j].toFlash = true;
        }
      }
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].toFlash) {
          grid[i][j].toFlash = false;
          grid[i][j].lastFlashed = turn;
          flashesThisRound++;
          increaseAdjacent(grid, i, j);
        }
      }
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].lastFlashed === turn) {
          grid[i][j].energy = 0;
        }
      }
    }

    flashes += flashesThisRound;
  } while (flashesThisRound > 0);



  return flashes;
}

const run1 = () => {
  const data = readStringArrayFromFile("./input/day11.txt", "\n");
  const grid = data.map((row) => {
    return row.split("").map((ch) => { return createOct(parseInt(ch)) });
  })

  let flashCount = 0;
  for (let turn = 1; turn <= 100; turn++) {
    increaseLevelForGrid(grid);
    flashCount += flash(grid, turn);
  }

  console.log(`flashCount: ${flashCount}`);
};

const run = () => {
  const data = readStringArrayFromFile("./input/day11.txt", "\n");
  const grid = data.map((row) => {
    return row.split("").map((ch) => { return createOct(parseInt(ch)) });
  })

  const octCount = grid.length * grid[0].length;

  let foundOnTurn = 0;
  let turn = 1;
  while (!foundOnTurn) {
    increaseLevelForGrid(grid);
    const countThisTurn = flash(grid, turn);
    if (countThisTurn === octCount) {
      foundOnTurn = turn;
    }
    turn++;
  }

  console.log(`foundOnTurn: ${foundOnTurn}`);
};

module.exports = { run };