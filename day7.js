const { readStringArrayFromFile } = require("./lib");


const calculateFuel1 = (crabs, pos) => {
  let fuelReq = 0;

  crabs.forEach((crab) => {
    fuelReq += Math.abs(crab - pos);
  })

  return fuelReq;
}

const calculateFuelForDistance = (dist) => {
  let fuel = 0;
  for (let i = 1; i <= dist; i++) {
    fuel += i;
  }

  return fuel;
}

const calculateFuel2 = (crabs, pos) => {
  let fuelReq = 0;

  crabs.forEach((crab) => {
    fuelReq += calculateFuelForDistance(Math.abs(crab - pos));
  })

  return fuelReq;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day7.txt", "\n")[0];
  const crabs = data.split(',').map((st) => { return parseInt(st) });

  const min = Math.min(...crabs);
  const max = Math.max(...crabs);

  let bestPos = max;
  let bestFuel = calculateFuel2(crabs, max);

  for (let i = min; i < max; i++) {
    const thisFuel = calculateFuel2(crabs, i);
    if (bestFuel > thisFuel) {
      bestFuel = thisFuel;
      bestPos = i;
    }
  }

  console.log(`bestFuel: ${bestFuel}`);
  console.log(`bestPos: ${bestPos}`);
};

module.exports = { run };