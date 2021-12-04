const { readStringArrayFromFile } = require("./lib");

const getBoard = (data) => {
  const nums = []
  for (let i = 0; i < 5; i++) {
    const row = data[i].trim().split(/ +/).map((val) => { return parseInt(val) });
    for (let j = 0; j < 5; j++) {
      nums.push(row[j]);
    }
  }

  return {
    nums,
    called: []
  }
}

const getBoards = (data) => {
  const boards = [];
  for (let i = 0; i < data.length; i += 5) {
    boards.push(getBoard(data.slice(i, i + 5)));
  }

  return boards;
}

const addCall = (boards, call) => {
  for (let i = 0; i < boards.length; i++) {
    boards[i].called.push(call);
  }
}

const winningPatterns = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24]
  // [0, 6, 12, 18, 24],
  // [4, 8, 12, 16, 20]
];

const matchesPattern = (board, pattern) => {

  for (let i = 0; i < pattern.length; i++) {
    const currNum = board.nums[pattern[i]];
    if (!board.called.includes(currNum)) {
      return false;
    }
  }

  return true;
}

const isWinningBoard = (board) => {
  for (let i = 0; i < winningPatterns.length; i++) {
    if (matchesPattern(board, winningPatterns[i])) {
      // console.log(`Winning board: ${JSON.stringify(board)} for pattern ${winningPatterns[i]}`);
      return board;
    }
  }

  return false;
}

const getWinningBoard = (boards) => {
  for (let i = 0; i < boards.length; i++) {
    if (isWinningBoard(boards[i])) {
      return boards[i];
    }
  }

  return null;
}

const calculateBoardScore = (board, lastCall) => {
  let sumOfUnmarked = 0;
  for (let i = 0; i < board.nums.length; i++) {
    const currNum = board.nums[i];
    if (!board.called.includes(currNum)) {
      sumOfUnmarked += currNum;
    }
  }

  console.log(`Score: ${sumOfUnmarked} * ${lastCall}`);
  return sumOfUnmarked * lastCall;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day4.txt", "\n").filter((line) => { return line !== "" });
  const calls = data[0].split(",").map((call) => { return parseInt(call) });
  const boards = getBoards(data.slice(1));

  let winningBoard = null;
  let callNum = -1;
  while (!winningBoard && callNum < calls.length) {
    callNum++;
    addCall(boards, calls[callNum]);
    if (callNum >= 4) {
      winningBoard = getWinningBoard(boards);
    }
  }

  if (callNum >= calls.length) {
    throw new Error("No winner found");
  }

  // console.log(`winningBoard: ${JSON.stringify(winningBoard, null, 2)}`);

  const score = calculateBoardScore(winningBoard, calls[callNum]);
  console.log(`Score: ${score}`);
}

module.exports = { run };