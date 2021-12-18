const { readStringArrayFromFile } = require("./lib");

const getUnenclosedComma = (st) => {
  let openParens = 0;
  let foundPos = -1;
  st.split("").forEach((ch, i) => {
    switch (ch) {
      case "[":
        openParens++;
        break;
      case "]":
        openParens--;
        break;
      case ",":
        if (openParens === 0) {
          foundPos = i;
        }
        break;
      default: // ignore numbers for now
        break;
    }
  });

  if (foundPos < 0) {
    throw new Error(`error locating center comma: ${st}`);
  }

  return foundPos;
}

const getRightMostNumber = (snum) => {
  if (snum.left) {
    const rightValue = getRightMostNumber(snum.right);
    if (rightValue) {
      return rightValue;
    }
    const leftValue = getRightMostNumber(snum.left);
    if (leftValue) {
      return leftValue;
    }

    return null;
  } else {
    return snum; // this is a value node
  }
}

const getClosestLeftNumber = (snum) => {
  // console.log(`getClosestLeftNumber: ${getString(snum)}`);

  if (!snum.parent) {
    return null;
  } else if (snum.parent.left == snum) {
    return getClosestLeftNumber(snum.parent);
  } else if (snum.parent.right == snum) {
    const rightMost = getRightMostNumber(snum.parent.left);
    // console.log(`rightMost: ${getString(rightMost)}`);
    if (rightMost) {
      return rightMost;
    } else {
      return null;
    }
  } else {
    throw new Error("How did we get here 1?");
  }
}

const getLeftMostNumber = (snum) => {
  if (snum.left) {
    const leftValue = getLeftMostNumber(snum.left);
    if (leftValue) {
      return leftValue;
    }
    const rightValue = getLeftMostNumber(snum.right);
    if (rightValue) {
      return rightValue;
    }

    return null;
  } else {
    return snum; // this is a value node
  }
}

const getClosestRightNumber = (snum) => {
  if (!snum.parent) {
    return null;
  } else if (snum.parent.right == snum) {
    return getClosestRightNumber(snum.parent);
  } else if (snum.parent.left == snum) {
    const leftMost = getLeftMostNumber(snum.parent.right);
    if (leftMost) {
      return leftMost;
    } else {
      return null;
    }
  } else {
    console.log(`wat: ${JSON.stringify(snum.parent)}`);
    debug(snum.parent, "wat1");
    throw new Error("How did we get here 2?");
  }
}

const explode = (snum) => {
  const leftNumber = getClosestLeftNumber(snum);
  const rightNumber = getClosestRightNumber(snum);

  if (leftNumber) {
    leftNumber.value += snum.left.value;
  }

  if (rightNumber) {
    rightNumber.value += snum.right.value;
  }

  snum.left.deleted = true;
  snum.left = null;
  snum.right.deleted = true;
  snum.right = null;
  snum.value = 0;
}

const split = (snum, depth) => {
  snum.left = { parent: snum, value: Math.floor(snum.value / 2) };
  snum.right = { parent: snum, value: Math.ceil(snum.value / 2) };
  snum.value = null;
}

const isSimplePair = (snum) => {
  return snum && snum.left && snum.right && !snum.left.left && !snum.right.left;
}

const reduceOneExplode = (snum, depth) => {
  if (depth >= 4 && isSimplePair(snum)) {
    explode(snum); // If any pair is nested inside four pairs, the leftmost such pair explodes.
    return true;
  } else if (snum.left) {
    if (reduceOneExplode(snum.left, depth + 1)) {
      return true;
    } else if (reduceOneExplode(snum.right, depth + 1)) {
      return true;
    } else {
    }
  }

  return false;
}
const reduceOneSplit = (snum, depth) => {
  if (snum.value >= 10) {
    split(snum, depth); // If any regular number is 10 or greater, the leftmost such regular number splits.
    return true;
  } else if (snum.left) {
    if (reduceOneSplit(snum.left, depth + 1)) {
      return true;
    } else if (reduceOneSplit(snum.right, depth + 1)) {
      return true;
    } else {
    }
  }

  return false;
}

const reduce = (snum) => {
  let numReduced = 0;

  do {
    numReduced = 0;
    while (reduceOneExplode(snum, 0)) {
      numReduced++;
    };

    if (reduceOneSplit(snum, 0)) {
      numReduced++;
    }
  } while (numReduced > 0);
}

const parseSnailNum = (st, parent) => {
  if (st.length == 1) {
    const valueNode = { parent, value: parseInt(st) };
    return valueNode;
  }

  if (st.slice(0, 1) != '[' && st.slice(st.length - 1) != ']') {
    throw new Error(`Parse Error on: ${st}`);
  }

  const comma = getUnenclosedComma(st.slice(1, st.length - 1)) + 1;
  let snum = {}
  snum.left = parseSnailNum(st.slice(1, comma), snum)
  snum.right = parseSnailNum(st.slice(comma + 1, st.length - 1), snum)
  snum.parent = parent;
  return snum;
}

const combineSnailNums = (snums) => {
  let temp = null;

  snums.forEach((snum) => {
    if (temp == null) {
      temp = snum
    } else {
      let newNode = {
        parent: temp.parent,
        left: temp,
        right: snum
      }
      temp.parent = newNode;
      snum.parent = newNode;
      temp = newNode;
      reduce(temp);
    }
  })

  return temp;
}

// const getString = (snum, level) => {
//   if (!snum) {
//     return "EMPTY";
//   }

//   if (snum.left) {
//     return `[${getString(snum.left)},${getString(snum.right)}]`;
//   } else if (snum.value || snum.value == 0) {
//     return `${snum.value}`;
//   } else {
//     return `BROKEN: @ level: ${level}, parent: ${snum.parent}, left: ${snum.left}, right: ${snum.right}, value: ${snum.value}, snum: ${JSON.stringify(snum)}`;
//   }
// }

// const debug = (node, desc) => {
//   let level = 0;
//   let curr = node;
//   while (curr.parent) {
//     level++;
//     curr = curr.parent;
//   }

//   console.log(`${desc}: ${getString(curr, level)}`);
// }

const getMagnitude = (snum) => {
  if (snum.left) {
    return 3 * getMagnitude(snum.left) + 2 * getMagnitude(snum.right);
  } else {
    return snum.value;
  }
}

const run1 = () => {
  const data = readStringArrayFromFile("./input/day18.txt", "\n").map(parseSnailNum);
  const combined = combineSnailNums(data);
  reduce(combined);

  console.log(`magnitude: ${getMagnitude(combined)}`);
};

const run = () => {
  const data = readStringArrayFromFile("./input/day18.txt", "\n");

  let maxMagnitude = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i !== j) {
        const d1 = parseSnailNum(data[i]);
        const d2 = parseSnailNum(data[j]);
        const combined = combineSnailNums([d1, d2]);
        reduce(combined);
        const thisMagnitude = getMagnitude(combined);
        if (thisMagnitude > maxMagnitude) {
          maxMagnitude = thisMagnitude;
        }
      }
    }
  }

  console.log(`maxMagnitude: ${maxMagnitude}`);
};

module.exports = { run };