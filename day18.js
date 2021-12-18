const { readStringArrayFromFile } = require("./lib");

const checkValidNode = (snum) => {
  if (!snum) {
    throw new Error("Node is empty");
  } else if (snum.deleted) {
    throw new Error("Node was deleted");
  } else if (typeof snum === 'number') {
    throw new Error("Node is a primitive number");
  } else if (snum.left && !snum.right) {
    throw new Error("Node has left but no right");
  } else if (!snum.left && snum.right) {
    throw new Error("Node has right but no left");
  } else if (!snum.left && !snum.right && !(snum.value || snum.value == 0)) {
    throw new Error("Node has no right, left, or value");
  } else if ((snum.left || snum.right) && (snum.value || snum.value == 0)) {
    throw new Error("Node has left and/or right AND value");
  } else if (typeof snum.left === 'number') {
    throw new Error("Node has left equal to a primitive number");
  } else if (typeof snum.right === 'number') {
    throw new Error("Node has right equal to a primitive number");
  }

  checkValidTree(snum);
}

const checkValidTree = (snum) => {
  if (snum.left) {
    checkValidNode(snum.left);
  }
  if (snum.right) {
    checkValidNode(snum.right);
  }
}

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
  checkValidNode(snum);
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
  checkValidNode(snum);
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
  checkValidNode(snum);
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
  checkValidNode(snum);

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
  checkValidNode(snum);

  // debug(snum, `Exploding: ${getString(snum)}`);
  const leftNumber = getClosestLeftNumber(snum);
  const rightNumber = getClosestRightNumber(snum);

  if (leftNumber) {
    // console.log(`Adding ${snum.left.value} to ${getString(leftNumber)}`);
    leftNumber.value += snum.left.value;
    // debug(snum, `Added ${snum.left.value} to ${getString(leftNumber)}`);
    checkValidNode(leftNumber);
  }

  if (rightNumber) {
    // console.log(`Adding ${snum.right.value} to ${getString(rightNumber)}`);
    rightNumber.value += snum.right.value;
    // debug(snum, `Added ${snum.right.value} to ${getString(rightNumber)}`);
    checkValidNode(rightNumber);
  }

  // console.log(`snum.left was: ${getString(snum.left)}`);
  snum.left.deleted = true;
  snum.left = null;
  // console.log(`snum.right was: ${getString(snum.right)}`);
  snum.right.deleted = true;
  snum.right = null;
  snum.value = 0;
  // debug(snum, `Zeroed out exploded pair`);
  checkValidNode(snum);

  /*
  To explode a pair, the pair's left value is added to the first regular number to the left
  of the exploding pair (if any), and the pair's right value is added to the first regular
  number to the right of the exploding pair (if any). Exploding pairs will always consist
  of two regular numbers. Then, the entire exploding pair is replaced with the regular
  number 0.
  */

  // debug(snum, `After explode`);
  // console.log("");


}

const split = (snum, depth) => {
  checkValidNode(snum);
  // debug(snum, `Splitting: ${getString(snum)}`);
  snum.left = { parent: snum, value: Math.floor(snum.value / 2) };
  snum.right = { parent: snum, value: Math.ceil(snum.value / 2) };
  snum.value = null;
  checkValidNode(snum);
  // debug(snum, `After split`);
  // console.log("");

  // if split produces a pair that meets the explode criteria, that pair explodes before other splits occur.
  if (depth >= 4) {
    debug(snum, `Reducing, nested`);
    explode(snum);
  }
}

const isSimplePair = (snum) => {
  return snum && snum.left && snum.right && !snum.left.left && !snum.right.left;
}

const reduceOne = (snum, depth) => {
  checkValidNode(snum);
  // console.log(`Reducing depth=${depth} : ${getString(snum)}`);
  if (depth >= 4 && isSimplePair(snum)) {
    // debug(snum, `Before Explode`);
    explode(snum); // If any pair is nested inside four pairs, the leftmost such pair explodes.
    // debug(snum, `After Explode`);
    return true;
  } else if (snum.value >= 10) {
    // debug(snum, `About to split because ${snum.value} >= 10`);
    split(snum, depth); // If any regular number is 10 or greater, the leftmost such regular number splits.
    // debug(snum, `After Split`);
    return true;
  } else if (snum.left) {
    if (reduceOne(snum.left, depth + 1)) {
      // console.log(`depth=${depth} : ${getString(snum)}`);
      return true;
    } else if (reduceOne(snum.right, depth + 1)) {
      // console.log(`depth=${depth} : ${getString(snum)}`);
      return true;
    } else {
      // console.log(`depth=${depth} : ${getString(snum)}`);
    }
  }

  return false;
}

const reduce = (snum) => {
  let round = 1;
  while (reduceOne(snum, 0)) {
    debug(snum, `Reducing, round ${round++}`);
  };
}

/*

[[[[4,0],[5,4]],[[7, 7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
[[[[4,0],[5,4]],[[7,7],[6,0]]],[[[6,6],[5,6]],[[6,0],[7,7]]]]
*/
const parseSnailNum = (st, parent) => {
  if (st.length == 1) {
    const valueNode = { parent, value: parseInt(st) };
    checkValidNode(valueNode);
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
  checkValidNode(snum);
  return snum;
}

// const combineSnailNums = (snums) => {
//   let temp = null;

//   snums.forEach((snum) => {
//     checkValidNode(snum);
//     if (temp == null) {
//       temp = snum
//     } else {
//       let newNode = {
//         parent: temp.parent,
//         left: temp,
//         right: snum
//       }
//       temp.parent = newNode;
//       snum.parent = newNode;
//       temp = newNode;
//       checkValidNode(temp);
//     }
//   })

//   // debug(temp, "After combine")
//   return temp;
// }

const combineSnailNums = (snums) => {
  let temp = null;

  snums.forEach((snum) => {
    checkValidNode(snum);
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
      // checkValidNode(temp);
      // reduce(temp);
      // checkValidNode(temp);
      // debug(temp, "Reduced");
      // throw new Error("TEMP STOP");
    }
  })

  // debug(temp, "After combine")
  return temp;
}

const getString = (snum, level) => {
  if (!snum) {
    return "EMPTY";
  }

  if (snum.left) {
    return `[${getString(snum.left)},${getString(snum.right)}]`;
  } else if (snum.value || snum.value == 0) {
    return `${snum.value}`;
  } else {
    return `BROKEN: @ level: ${level}, parent: ${snum.parent}, left: ${snum.left}, right: ${snum.right}, value: ${snum.value}, snum: ${JSON.stringify(snum)}`;
  }
}

const debug = (node, desc) => {
  let level = 0;
  let curr = node;
  while (curr.parent) {
    level++;
    curr = curr.parent;
  }

  console.log(`${desc}: ${getString(curr, level)}`);
}

const getMagnitude = (snum) => {
  /*
  To check whether it's the right answer, the snailfish teacher only checks the magnitude of the final sum.
  The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its
  right element. The magnitude of a regular number is just that number.
  */

  if (snum.left) {
    return 3 * getMagnitude(snum.left) + 2 * getMagnitude(snum.right);
  } else {
    return snum.value;
  }
}

const run = () => {
  const data = readStringArrayFromFile("./input/day18.txt", "\n").map(parseSnailNum);
  const reducedData = data.map((snum) => {
    reduce(snum);
  });
  const combined = combineSnailNums(data);
  debug(combined, "Combined");
  console.log("");
  reduce(combined);
  debug(combined, "Reduced");

  console.log(`magnitude: ${getMagnitude(combined)}`);
};

// TODO The numbers aren't coming up right, there seems to be an issue with the exploding

module.exports = { run };