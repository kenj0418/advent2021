const { readStringArrayFromFile } = require("./lib");

const parseRules = (ruleStrings) => {
  let rules = {};
  ruleStrings.forEach((ruleSt) => {
    const parts = ruleSt.split(" -> ");
    rules[parts[0]] = parts[1];
  })

  return rules;
}

const countPairs = (poly) => {
  let counts = {}
  for (let i = 0; i < poly.length - 1; i++) {
    const pair = poly.slice(i, i + 2);
    addToCount(counts, pair, 1);
  }

  return counts;
}

const addToCount = (count, key, value) => {
  if (count[key]) {
    count[key] += value;
  } else {
    count[key] = value;
  }
}

const applyRules = (polyPairs, rules) => {
  const newCounts = {};

  Object.keys(polyPairs).forEach((key) => {
    const newChar = rules[key];
    const left = key.slice(0, 1) + newChar;
    const right = newChar + key.slice(1);
    addToCount(newCounts, left, polyPairs[key]);
    addToCount(newCounts, right, polyPairs[key]);
  });

  return newCounts;
}

const countElements = (polyPairs, lastChar) => {
  const countsObject = {};

  Object.keys(polyPairs).forEach((key) => {
    const left = key.slice(0, 1)
    const right = key.slice(1);
    addToCount(countsObject, left, polyPairs[key]);
  });
  addToCount(countsObject, lastChar, 1);

  const counts = [];
  Object.keys(countsObject).forEach((key) => {
    counts.push({ elem: key, count: countsObject[key] });
  })

  return counts;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day14.txt", "\n");
  let poly = data[0];
  let rules = parseRules(data.slice(2));

  let polyPairs = countPairs(poly);
  for (let i = 0; i < 40; i++) {
    polyPairs = applyRules(polyPairs, rules);
  }

  const elementCounts = countElements(polyPairs, poly[poly.length - 1]);
  elementCounts.sort((e1, e2) => {
    return e1.count - e2.count;
  })

  const diff = elementCounts[elementCounts.length - 1].count - elementCounts[0].count;
  console.log(`diff: ${diff}`);
};

module.exports = { run };