const { readStringArrayFromFile } = require("./lib");

const parsePoint = (st) => {
  const parts = st.split(",");
  return {
    x: parseInt(parts[0]),
    y: parseInt(parts[1])
  }
}
const parseVents = (line) => {
  const points = line.split(" -> ");
  return {
    start: parsePoint(points[0]),
    end: parsePoint(points[1])
  };
}

const addToGridX = (grid, vent) => {
  const y1 = Math.min(vent.start.y, vent.end.y);
  const y2 = Math.max(vent.start.y, vent.end.y);
  for (let y = y1; y <= y2; y++) {
    const loc = `${vent.start.x}:${y}`;
    if (grid[loc]) {
      grid[loc]++;
    } else {
      grid[loc] = 1;
    }
  }
}

const addToGridY = (grid, vent) => {
  const x1 = Math.min(vent.start.x, vent.end.x);
  const x2 = Math.max(vent.start.x, vent.end.x);
  for (let x = x1; x <= x2; x++) {
    const loc = `${x}:${vent.start.y}`;
    if (grid[loc]) {
      grid[loc]++;
    } else {
      grid[loc] = 1;
    }
  }
}

const addToGridDiag = (grid, vent) => {
  const x1 = vent.start.x;
  const x2 = vent.end.x;
  const y1 = vent.start.y;
  const y2 = vent.end.y;
  const deltaX = (x1 < x2) ? 1 : -1;
  const deltaY = (y1 < y2) ? 1 : -1;
  const steps = Math.abs(x1 - x2) + 1;

  // console.log(`x1: ${x1}, x2: ${x2}, y1: ${y1}, y2: ${y2}, deltaX : ${deltaX}, deltaY: ${deltaY}, steps: ${steps}`);

  let x = x1;
  let y = y1;
  let count = 0;
  while (count < steps) {
    const loc = `${x}:${y}`;

    if (grid[loc]) {
      grid[loc]++;
    } else {
      grid[loc] = 1;
    }

    x += deltaX;
    y += deltaY;
    count++;
  }
}

const addToGrid = (grid, vent) => {
  if (vent.start.x == vent.end.x) {
    addToGridX(grid, vent);
  } else if (vent.start.y == vent.end.y) {
    addToGridY(grid, vent);
  } else {
    addToGridDiag(grid, vent);
  }
}

const countOverlaps = (grid, minOverlap) => {
  let overlaps = 0;

  Object.keys(grid).forEach((loc) => {
    if (grid[loc] >= minOverlap) {
      overlaps++
    };
  })

  return overlaps;
}

const debugGrid = (grid, count) => {
  let debugSt = ""
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      const gridVal = grid[`${x}:${y}`];
      const val = gridVal ? `${gridVal}` : ".";
      debugSt += val;
    }
    debugSt += "\n";
  }
  return debugSt;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day5.txt", "\n");
  const vents = data.map(parseVents);

  const grid = {};

  // vents.forEach((vent) => {
  //   const gr = {};
  //   console.log(JSON.stringify(vent));
  //   addToGrid(gr, vent);
  //   console.log(debugGrid(gr, 10));
  //   console.log("");
  // });

  vents.forEach((vent) => { addToGrid(grid, vent); });

  const badSpots = countOverlaps(grid, 2);

  // console.log(debugGrid(grid, 10));
  console.log(`badSpots: ${badSpots}`);
};

module.exports = { run };