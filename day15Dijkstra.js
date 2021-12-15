const { readStringArrayFromFile } = require("./lib");
const Graph = require('node-dijkstra')

const DIRS = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: +1, deltaY: 0 }
];

const getGraph = (risks) => {
  const endX = risks[0].length - 1;
  const endY = risks.length - 1;

  const route = new Graph()

  for (let x = 0; x <= endX; x++) {
    for (let y = 0; y <= endY; y++) {
      const currKey = `${x}:${y}`;
      let neighbors = {};
      DIRS.forEach((dir) => {
        const newX = x + dir.deltaX;
        const newY = y + dir.deltaY;

        if (newX >= 0 && newY >= 0 && newX < risks[0].length && newY < risks.length) {
          const nextKey = `${newX}:${newY}`;
          neighbors[nextKey] = risks[newY][newX];
        }
      });
      route.addNode(currKey, neighbors);
    }
  }

  return route;
}

const expandGrid = (orig) => {
  const origXSize = orig[0].length;
  const origYSize = orig.length;
  const newXSize = origXSize * 5;
  const newYSize = origYSize * 5;
  const newGrid = [];
  for (let y = 0; y < newYSize; y++) {
    const yAdd = Math.floor(y / origYSize);
    const row = [];
    for (let x = 0; x < newXSize; x++) {
      const xAdd = Math.floor(x / origXSize);
      let newValue = orig[y % origYSize][x % origYSize] + xAdd + yAdd;
      if (newValue > 9) {
        newValue -= 9;
      }
      row.push(newValue);
    }
    newGrid.push(row);
  }

  return newGrid;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day15.txt", "\n");
  const risksPart1 = data.map((line) => {
    return line.split("").map((st) => { return parseInt(st) });
  });
  const risks = expandGrid(risksPart1);

  const endX = risks[0].length - 1;
  const endY = risks.length - 1;

  const route = getGraph(risks)

  const optimal = route.path('0:0', `${endX}:${endY}`, { cost: true })
  console.log(`optimal: ${optimal.cost}`);
};

module.exports = { run };