const { readStringArrayFromFile } = require("./lib");

const getTargetArea = (st) => {
  const parts = st.split(" ").map((s) => { return s.substring(2) });
  const xParts = parts[2].split("..").map((s) => { return parseInt(s) });
  const yParts = parts[3].split("..").map((s) => { return parseInt(s) });

  return {
    xStart: xParts[0],
    xEnd: xParts[1],
    yStart: yParts[0],
    yEnd: yParts[1]
  };
}

const isInTargetArea = (targetArea, pos) => {
  return (targetArea.xStart <= pos.x) &&
    (targetArea.xEnd >= pos.x) &&
    (targetArea.yStart <= pos.y) &&
    (targetArea.yEnd >= pos.y);
}

const couldStillHit = (targetArea, pos, traj) => {
  if ((traj.deltaY <= 0) && (targetArea.yStart > pos.y)) {
    return false; // too low and falling
  } else if ((traj.x <= 0) && (targetArea.xStart > pos.x)) {
    return false; // to the left and steady or moving left
  } else if ((traj.x >= 0) && (targetArea.xEnd < pos.x)) {
    return false; // to the right and steady or moving right
  }

  return true;
}

const adjustTrajectory = (traj) => {
  // Due to drag, the probe's x velocity changes by 1 toward the value 0; that is, it decreases by 1 if it is greater than 0, increases by 1 if it is less than 0, or does not change if it is already 0.
  // Due to gravity, the probe's y velocity decreases by 1.
  if (traj.deltaX > 0) {
    traj.deltaX -= 1;
  } else if (traj.deltaX < 0) {
    traj.deltaX += 1;
  }

  traj.deltaY -= 1;
}

const isFiringSolution = (targetArea, traj) => {
  let pos = { x: 0, y: 0 };
  let highest = 0;
  while (isInTargetArea(targetArea, pos) || couldStillHit(targetArea, pos, traj)) {
    if (pos.y > highest) {
      highest = pos.y;
    }

    if (isInTargetArea(targetArea, pos)) {
      return { highest, valid: true };
    }

    pos.x += traj.deltaX;
    pos.y += traj.deltaY;
    adjustTrajectory(traj);
  }

  return { highest, valid: false };
}

const findHighest = (targetArea) => {
  // could make more efficient

  let highestSoFar = 0;
  let highestTraj = null;

  for (let deltaX = 0; deltaX <= 150; deltaX++) {
    for (let deltaY = -200; deltaY <= 1000; deltaY++) {
      const traj = { deltaX, deltaY };
      const firingSolution = isFiringSolution(targetArea, traj);
      if (firingSolution.valid) {
        if (firingSolution.highest > highestSoFar) {
          highestSoFar = firingSolution.highest;
          highestTraj = traj;
        }
      }
    }
  }

  return highestSoFar;
}

const countValid = (targetArea) => {
  // could make more efficient

  let count = 0;

  for (let deltaX = 0; deltaX <= 150; deltaX++) {
    for (let deltaY = -200; deltaY <= 1000; deltaY++) {
      const traj = { deltaX, deltaY };
      const firingSolution = isFiringSolution(targetArea, traj);
      if (firingSolution.valid) {
        count++;
      }
    }
  }

  return count;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day17.txt", "\n");
  const targetArea = getTargetArea(data[0]);
  const count = countValid(targetArea);
  console.log(`count: ${JSON.stringify(count)}`);
};

module.exports = { run };