const { readStringArrayFromFile } = require("./lib");

const calcGamma = (values, bit) => {
  let count0 = 0;
  let count1 = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i][bit] === "1") {
      count1++;
    } else {
      count0++;
    }
  }

  console.log(`count0: ${count0}, count1: ${count1}`);

  return (count0 > count1) ? "0" : "1";
}

const calcEpsilon = (values, bit) => {
  return (calcGamma(values, bit) === "1") ? "0" : "1";
}

const calcEpsilonFromGamma = (gamma) => {
  return (gamma === "1") ? "0" : "1";
}

const run1 = () => {
  const values = readStringArrayFromFile("./input/day3.txt", "\n");
  const numBits = values[0].length;

  let gamma = "";
  let epsilon = "";

  for (let b = 0; b < numBits; b++) {
    const thisGamma = calcGamma(values, b);
    gamma += thisGamma;
    epsilon += calcEpsilonFromGamma(thisGamma);
  }

  const gammaValue = parseInt(gamma, 2);
  const epsilonValue = parseInt(epsilon, 2);

  console.log(`gamma=${gammaValue}, epsilon=${epsilonValue}, product= ${gammaValue * epsilonValue}`);
}

const calculateRating = (values, ratingFunction) => {
  let remainingValues = JSON.parse(JSON.stringify(values));

  let currBit = 0;
  while (remainingValues.length > 1 && currBit < remainingValues[0].length) {
    const targetBit = ratingFunction(remainingValues, currBit);
    remainingValues = remainingValues.filter((value) => { return value[currBit] === targetBit });
    currBit++;
  }

  return remainingValues[0];
}

const calculateOxygen = (values) => {
  return calculateRating(values, calcGamma);
}

const calculateCO2 = (values) => {
  return calculateRating(values, calcEpsilon);
}

const run = () => {
  const values = readStringArrayFromFile("./input/day3.txt", "\n");
  const oxygen = calculateOxygen(values);
  const co2 = calculateCO2(values);

  const oxygenValue = parseInt(oxygen, 2);
  const co2Value = parseInt(co2, 2);

  console.log(`oxygen = ${oxygenValue}, co2 = ${co2Value}, product = ${oxygenValue * co2Value}`);
}

module.exports = { run };