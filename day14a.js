const { readStringArrayFromFile } = require("./lib");

const parseRules = (ruleStrings) => {
  let rules = {};
  ruleStrings.forEach((ruleSt) => {
    const parts = ruleSt.split(" -> ");
    rules[parts[0]] = parts[1];
  })

  return rules;
}

const applyRules = (poly, rules) => {
  let newPoly = poly;
  let index = 0;

  while (index < newPoly.length) {
    const pair = newPoly.substring(index, index + 2);
    const result = rules[pair];
    if (result) {
      newPoly = newPoly.substring(0, index + 1) + result + newPoly.substring(index + 1);
      index++;
    }

    index++;
  }

  return newPoly;
}

const countElements = (poly) => {
  const countsObject = {};
  poly.split("").forEach((ch) => {
    if (!countsObject[ch]) {
      countsObject[ch] = 1;
    } else {
      countsObject[ch]++;
    }
  });

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

  for (let i = 0; i < 10; i++) {
    console.log(`i: ${i}, poly.length: ${poly.length}`);
    poly = applyRules(poly, rules);
  }

  const elementCounts = countElements(poly);
  elementCounts.sort((e1, e2) => {
    return e1.count - e2.count;
  })
  // console.log(`elementCounts: ${JSON.stringify(elementCounts)}`);

  const diff = elementCounts[elementCounts.length - 1].count - elementCounts[0].count;
  console.log(`diff: ${diff}`);
};

module.exports = { run };