const { readStringArrayFromFile, permutator } = require("./lib");

const run1 = () => {
  const data = readStringArrayFromFile("./input/day8.txt", "\n")
  const outputs = data.map((st) => { return st.split("|")[1].trim().split(" "); });

  let simpleCount = 0;
  outputs.forEach((row) => {
    row.forEach((word) => {
      if (word.length == 2) {
        simpleCount++; // 1
      } else if (word.length == 4) {
        simpleCount++; // 4
      } else if (word.length == 3) {
        simpleCount++; // 7
      } else if (word.length == 7) {
        simpleCount++; // 8
      }
    });
  });


  console.log(`simpleCount: ${simpleCount}`);
};

const led = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg"
];

const translateWord = (input, assignment) => {
  let translated = []
  input.split("").forEach((ch) => {
    let chVal = (ch.charCodeAt(0) - 'a'.charCodeAt(0));
    translated.push(assignment[chVal]);
  });

  return translated.sort().join("");
}

const isValid = (input, assignment) => {
  const translated = translateWord(input, assignment);
  return led.indexOf(translated) >= 0;
}

const calculateMappings = (inputs) => {
  const wires = led[8].split("");
  const possibleAssignments = permutator(wires);

  for (let i = 0; i < possibleAssignments.length; i++) {
    const possibleAssignment = possibleAssignments[i];
    let validAssignment = true;
    for (let j = 0; (j < inputs.length) && validAssignment; j++) {
      const input = inputs[j];
      if (!isValid(input, possibleAssignment)) {
        validAssignment = false;
      } else {
      }
    }

    if (validAssignment) {
      // console.log(`Found it: ${JSON.stringify(possibleAssignment)}`);
      return possibleAssignment;
    }
  }

  throw new Error(`Could not find assignment for: ${inputs}`);
}

const calculateOutputDigit = (mappings, op) => {
  const translated = translateWord(op, mappings);
  for (let i = 0; i < 10; i++) {
    if (translated == led[i]) {
      return i;
    }
  }

  throw new Error(`Unable to find: ${translated} with ${mappings}`);
}

const calculateOutput = (mappings, output) => {
  let value = 0;
  output.forEach((op) => {
    value *= 10;
    value += calculateOutputDigit(mappings, op);
  });

  return value;
}

const processRow = (row) => {
  const parts = row.split("|").map((st) => { return st.trim().split(" ") });
  const input = parts[0];
  const output = parts[1];
  const mappings = calculateMappings(input);
  return calculateOutput(mappings, output);
}

const run = () => {
  const data = readStringArrayFromFile("./input/day8.txt", "\n")
  let total = 0;
  data.forEach((row) => {
    total += processRow(row);
  });

  console.log(`total: ${total}`);
};

module.exports = { run };