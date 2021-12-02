const { readArrayFromFile } = require("./lib");

const run_part1 = () => {
  const depths = readArrayFromFile("./input/day1.txt", "\n");
  let numDeeper = 0;
  for (let a = 0; a < depths.length; a++) {
    if (a !== 0 && depths[a] > depths[a - 1]) {
      numDeeper++
    }
  }

  console.log(`Num deeper: ${numDeeper}`);
}

const run = () => {
  const depths = readArrayFromFile("./input/day1.txt", "\n");
  let numDeeper = 0;
  let prevWindow = -1;
  for (let a = 0; a < depths.length; a++) {
    if (a !== 0 && a !== 1) {
      const currWindow = depths[a] + depths[a - 1] + depths[a - 2];
      if (prevWindow !== -1 && currWindow > prevWindow) {
        numDeeper++;
      }
      prevWindow = currWindow;
    }
  }

  console.log(`Num deeper: ${numDeeper}`);
}

module.exports = { run };