const { readStringArrayFromFile } = require("./lib");

const getDeltaFromAction1 = (action) => {
  const actionParts = action.split(" ");
  const dist = parseInt(actionParts[1]);
  if (actionParts[0] === "forward") {
    return { x: dist, y: 0 };
  } else if (actionParts[0] === "down") {
    return { x: 0, y: dist };
  } else if (actionParts[0] === "up") {
    return { x: 0, y: -dist };
  } else {
    console.log(`Unable to parse: ${action}`);
  }
}

const run1 = () => {
  const actions = readStringArrayFromFile("./input/day2.txt", "\n");
  let x = 0;
  let y = 0;

  for (let i = 0; i < actions.length; i++) {
    const delta = getDeltaFromAction(actions[i]);
    x += delta.x;
    y += delta.y;
  }

  console.log(`x=${x}, y=${y}, product= ${x * y}`);
}

const getDeltaFromAction = (action, aim) => {
  const actionParts = action.split(" ");
  const dist = parseInt(actionParts[1]);
  if (actionParts[0] === "forward") {
    return { x: dist, y: aim * dist, aim: 0 };
  } else if (actionParts[0] === "down") {
    return { x: 0, y: 0, aim: dist };
  } else if (actionParts[0] === "up") {
    return { x: 0, y: 0, aim: -dist };
  } else {
    console.log(`Unable to parse: ${action}`);
  }
}

const run = () => {
  const actions = readStringArrayFromFile("./input/day2.txt", "\n");
  let x = 0;
  let y = 0;
  let aim = 0;

  for (let i = 0; i < actions.length; i++) {
    const delta = getDeltaFromAction(actions[i], aim);
    x += delta.x;
    y += delta.y;
    aim += delta.aim;
  }

  console.log(`x=${x}, y=${y}, product= ${x * y}`);
}

module.exports = { run };