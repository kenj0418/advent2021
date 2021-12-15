const { readStringArrayFromFile } = require("./lib");

const DIRS = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: +1, deltaY: 0 }
];


const calculateLowestRisk = (risks, riskValues, x, y, path) => {
  if (riskValues[y][x] >= 0) {
    return riskValues[y][x];
  }
  let bestRisk = -1;

  DIRS.forEach((dir) => {
    const newX = x + dir.deltaX;
    const newY = y + dir.deltaY;
    if (newX >= 0 &&
      newY >= 0 &&
      newX < risks[0].length &&
      newY < risks.length) {
      const key = `${newX}:${newY}`;
      // console.log(`newX: ${newX}, newY: ${newY}, dir: ${JSON.stringify(dir)}}`);
      if (path.indexOf(key) < 0) {
        const newPath = JSON.parse(JSON.stringify(path));
        newPath.push(key)
        const thisPath = risks[newY][newX] + calculateLowestRisk(risks, riskValues, newX, newY, newPath);
        // console.log(`x: ${x}, y: ${y}, dir: ${JSON.stringify(dir)}, thisPath: ${thisPath}`);
        if (thisPath >= 0 && (thisPath < bestRisk || bestRisk < 0)) {
          bestRisk = thisPath;
          // don't need bestDir
        }
      }
    }
  })

  if (bestRisk < 0) {
    console.log(`WTF: ${x},${y} => ${bestRisk}, path: ${JSON.stringify(path)}`);
  }
  riskValues[y][x] = bestRisk;
  console.log(`${x}, ${y} returning: ${bestRisk}`);
  return bestRisk;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day15.txt", "\n");
  const risks = data.map((line) => {
    return line.split("").map((st) => { return parseInt(st) });
  });

  let riskValues = risks.map((row) => {
    return row.map(() => { return -1 });
  });

  const endX = risks[0].length - 1;
  const endY = risks.length - 1;

  riskValues[endY][endX] = risks[endY][endX];
  console.log(`riskValues[${endY}][${endX}]: ${risks[endY][endX]}`);

  const lowestRisk = calculateLowestRisk(risks, riskValues, 0, 0, ["0:0"]);
  console.log(`lowestRisk: ${lowestRisk}`);
};

module.exports = { run };