const { readStringArrayFromFile } = require("./lib");

const parseStep = (line) => {
  const parts = line.split(" ");
  const coordsMatch = parts[1].match(/x=(-?[0-9]+)\.\.(-?[0-9]+),y=(-?[0-9]+)\.\.(-?[0-9]+),z=(-?[0-9]+)\.\.(-?[0-9]+)/);
  if (!coordsMatch) {
    throw new Error(`Unable to parse: ${parts[1]}`);
  }
  return {
    action: parts[0] == "on",
    x: {
      start: parseInt(coordsMatch[1]),
      end: parseInt(coordsMatch[2])
    },
    y: {
      start: parseInt(coordsMatch[3]),
      end: parseInt(coordsMatch[4])
    },
    z: {
      start: parseInt(coordsMatch[5]),
      end: parseInt(coordsMatch[6])
    }
  }
}

const cleanRange = (range, rangeLimit) => {
  return {
    start: (range.start < rangeLimit.start) ? rangeLimit.start : range.start,
    end: (range.end > rangeLimit.end) ? rangeLimit.end : range.end
  }
}

const cleanStep = (step, rangeLimit) => {
  return {
    action: step.action,
    x: cleanRange(step.x, rangeLimit),
    y: cleanRange(step.y, rangeLimit),
    z: cleanRange(step.z, rangeLimit)
  };
}

const isRelevantStep = (step) => {
  return step.x.start <= step.x.end && step.y.start <= step.y.end && step.z.start <= step.z.end;
}

const activateCubes = (activeCubes, step) => {
  for (let x = step.x.start; x <= step.x.end; x++) {
    for (let y = step.y.start; y <= step.y.end; y++) {
      for (let z = step.z.start; z <= step.z.end; z++) {
        activeCubes[`${x}:${y}:${z}`] = step.action;
      }
    }
  }
}

const part1Run = (steps) => {
  const rangeLimit = { start: -50, end: 50 };
  const cleanSteps = steps.map((step) => { return cleanStep(step, rangeLimit) }).filter(isRelevantStep);

  let activeCubes = {};
  cleanSteps.forEach((step) => {
    activateCubes(activeCubes, step);
  })

  // console.log(cleanSteps);
  const part1Answer = Object.keys(activeCubes).filter((index) => {
    return activeCubes[index];
  }).length;
  console.log(`answer part 1: ${part1Answer}`);
}

const part2Run = (steps) => {
  console.log(`answer part 2: ${0}`);
}

const run = () => {
  const steps = readStringArrayFromFile("./input/day22.txt", "\n").map(parseStep);
  // part1Run(steps);
  part2Run(steps);
};

module.exports = { run };