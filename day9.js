const { readStringArrayFromFile, sum } = require("./lib");

const run1 = () => {
  const data = readStringArrayFromFile("./input/day9.txt", "\n").map((st) => {
    return st.split("").map((ch) => {
      return parseInt(ch)
    })
  })

  const lowPoints = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (
        (i === 0 || data[i][j] < data[i - 1][j]) &&
        (i === data.length - 1 || data[i][j] < data[i + 1][j]) &&
        (j === 0 || data[i][j] < data[i][j - 1]) &&
        (j === data[0].length - 1 || data[i][j] < data[i][j + 1])
      ) {
        lowPoints.push(data[i][j]);
      }
    }
  }

  const total = sum(lowPoints) + lowPoints.length;
};

const getValidFillDirs = (data, pos) => {
  let validDirs = []
  if (pos.i !== 0) {
    validDirs.push({ i: -1, j: 0 });
  }
  if (pos.i !== data.length - 1) {
    validDirs.push({ i: 1, j: 0 });
  }
  if (pos.j !== 0) {
    validDirs.push({ i: 0, j: -1 });
  }
  if (pos.j !== data[0].length - 1) {
    validDirs.push({ i: 0, j: 1 });
  }

  return validDirs;
}

const floodFill = (data, pos) => {
  const validDirs = getValidFillDirs(data, pos);
  let fillSize = 0;
  validDirs.forEach((dir) => {
    const newI = pos.i + dir.i;
    const newJ = pos.j + dir.j;
    if (data[newI][newJ] !== 9) {
      data[newI][newJ] = 9;
      fillSize += 1 + floodFill(data, { i: newI, j: newJ });
    }
  })

  return fillSize;
}

const calculateBasinSize = (data, low) => {
  return floodFill(data, low);
}

const getGrid = (data) => {
  let st = "";
  data.forEach((row) => {
    row.forEach((n) => {
      st += `${n}`;
    })
    st += "\n";
  })
  return st + "\n";
}

const run = () => {
  const data = readStringArrayFromFile("./input/day9.txt", "\n").map((st) => {
    return st.split("").map((ch) => {
      return parseInt(ch)
    })
  })

  const lowPoints = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (
        (i === 0 || data[i][j] < data[i - 1][j]) &&
        (i === data.length - 1 || data[i][j] < data[i + 1][j]) &&
        (j === 0 || data[i][j] < data[i][j - 1]) &&
        (j === data[0].length - 1 || data[i][j] < data[i][j + 1])
      ) {
        lowPoints.push({ i, j });
      }
    }
  }

  let basinSizes = [];

  lowPoints.forEach((low) => {
    basinSizes.push(calculateBasinSize(data, low));
  });

  basinSizes.sort((n1, n2) => { return n2 - n1 });
  const total = basinSizes[0] * basinSizes[1] * basinSizes[2];
  console.log(`total: ${total}`);
};


module.exports = { run };