const { readStringArrayFromFile, sum } = require("./lib");

const scoreCard = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137
}

const scoreCardInc = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4
}

const getIllegalCharacterScore = (line) => {
  const chunkStack = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line.slice(i, i + 1);
    if ("([{<".indexOf(ch) >= 0) {
      chunkStack.push(ch);
    } else {
      const chunkStart = chunkStack.pop();
      if (chunkStart === "(" && ch === ")") {
        // ok
      } else if (chunkStart === "[" && ch === "]") {
        // ok
      } else if (chunkStart === "{" && ch === "}") {
        // ok
      } else if (chunkStart === "<" && ch === ">") {
        // ok
      } else {
        return scoreCard[ch];
      }
    }
  }
  return 0;
}

const run1 = () => {
  const data = readStringArrayFromFile("./input/day10.txt", "\n");

  let total = 0;
  for (let lineNum = 0; lineNum < data.length; lineNum++) {
    const lineScore = getIllegalCharacterScore(data[lineNum]);
    console.log(`Line ${lineNum}: ${lineScore}`);
    total += lineScore;
  }

  console.log(`total: ${total}`);
};

const calculateScoreForStack = (chunkStack) => {
  let lineTotal = 0;

  while (chunkStack.length > 0) {
    const ch = chunkStack.pop();
    lineTotal *= 5;
    lineTotal += scoreCardInc[ch];
  }

  return lineTotal;
}

const getIncompleteScore = (line) => {
  const chunkStack = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line.slice(i, i + 1);
    if ("([{<".indexOf(ch) >= 0) {
      chunkStack.push(ch);
    } else {
      chunkStack.pop();
      // assuming valid
    }
  }

  return calculateScoreForStack(chunkStack);
}

const run = () => {
  const data = readStringArrayFromFile("./input/day10.txt", "\n");
  const nonCorrupt = []

  for (let lineNum = 0; lineNum < data.length; lineNum++) {
    const lineScore = getIllegalCharacterScore(data[lineNum]);
    if (lineScore === 0) {
      nonCorrupt.push(data[lineNum]);
    }
  }

  const scores = [];
  nonCorrupt.forEach((line) => {
    const lineScore = getIncompleteScore(line);
    scores.push(lineScore);
  })

  scores.sort((a, b) => { return a - b });
  const middle = scores[Math.floor(scores.length / 2)]

  console.log(`middle: ${middle}`);
};


module.exports = { run };