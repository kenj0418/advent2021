const { readStringArrayFromFile } = require("./lib");

const addPoint = (points, point) => {
  if (!hasPoint(points, point.x, point.y) && point.x >= 0 && point.y >= 0) {
    points.push(point);
  }
}

const foldPointsX = (points, value) => {
  const newPoints = [];
  points.forEach((point) => {
    if (point.x <= value) {
      addPoint(newPoints, point);
    } else {
      const newX = value - (point.x - value);
      addPoint(newPoints, { x: newX, y: point.y });
    }
  })

  return newPoints;
}

const foldPointsY = (points, value) => {
  const newPoints = [];
  points.forEach((point) => {
    if (point.y <= value) {
      addPoint(newPoints, point);
    } else {
      const newY = value - (point.y - value);
      addPoint(newPoints, { x: point.x, y: newY });
    }
  })

  return newPoints;
}

const foldPoints = (points, fold) => {
  if (fold.axis == "x") {
    return foldPointsX(points, fold.value);
  } else {
    return foldPointsY(points, fold.value);
  }
}

const hasPoint = (points, x, y) => {
  let foundIt = false;
  points.forEach((point) => {
    if ((point.x == x) && (point.y == y)) {
      foundIt = true;
    }
  });

  return foundIt;
}

const getMax = (points, attr) => {
  let maxSoFar = 0;
  points.forEach((point) => {
    if (point[attr] > maxSoFar) {
      maxSoFar = point[attr];
    }
  })
  return maxSoFar;
}

const debugGrid = (points) => {
  const maxY = getMax(points, "y");
  const maxX = getMax(points, "x");

  let grid = ""
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (hasPoint(points, x, y)) {
        grid += "#";
      } else {
        grid += ".";
      }
    }
    grid += "\n"
  }

  console.log(grid);
}

const run = () => {
  const data = readStringArrayFromFile("./input/day13.txt", "\n");
  let points = []
  const folds = [];

  data.forEach((line) => {
    if (line.match(/[0-9]+,[0-9]+/)) {
      const parts = line.split(",");
      points.push({ x: parseInt(parts[0]), y: parseInt(parts[1]) });
    } else if (line.match(/fold along/)) {
      const parts = line.split(" ");
      const foldParts = parts[2].split("=");
      folds.push({ axis: foldParts[0], value: parseInt(foldParts[1]) });
    }
  })

  console.log(`Now has ${points.length} points`);
  // folds.slice(0,1).forEach((fold) => {
  folds.forEach((fold) => {
    points = foldPoints(points, fold)
  });

  debugGrid(points);

  console.log(`numPoints: ${points.length}`);
};

module.exports = { run };