const { readStringArrayFromFile } = require("./lib");

const getPixel = (image, i, j, tileToInfinity) => {
  if (i < 0 || j < 0 || i >= image.length || j >= image[0].length) {
    return tileToInfinity;
  } else {
    return image[i][j];
  }
}

const NEARBY = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

const calculatePixelScore = (image, i, j, tileToInfinity) => {
  let score = 0;

  NEARBY.forEach((dir) => {
    score *= 2;
    score += getPixel(image, i + dir[0], j + dir[1], tileToInfinity)
  })

  return score;
}

const enhanceImage = (code, image, tileToInfinity) => {
  let newImage = [];
  for (let i = 0; i < image.length; i++) {
    let newRow = [];
    for (let j = 0; j < image[i].length; j++) {
      const pixelScore = calculatePixelScore(image, i, j, tileToInfinity);
      const newPixel = code[pixelScore];
      newRow.push(newPixel);
    }
    newImage.push(newRow);
  }

  return newImage;
}

const expandImage = (image) => {
  const expandSize = 10;
  const origHeight = image.length;
  const origWidth = image[0].length;

  let newImage = [];
  let blankRow = [];
  let blankPadding = []

  for (let i = 0; i < expandSize; i++) {
    blankPadding.push(0);
  }

  for (let i = 0; i < origWidth + 2 * expandSize; i++) {
    blankRow.push(0);
  }

  for (let i = 0; i < expandSize; i++) {
    newImage.push(blankRow);
  }

  for (let i = 0; i < origHeight; i++) {
    let newRow = []
    blankPadding.forEach((bit) => { newRow.push(bit) });
    image[i].forEach((bit) => { newRow.push(bit) });
    blankPadding.forEach((bit) => { newRow.push(bit) });
    newImage.push(newRow);
  }

  for (let i = 0; i < expandSize; i++) {
    newImage.push(blankRow);
  }

  return newImage;
}

const countLit = (image) => {
  let count = 0;
  image.forEach((row) => {
    row.forEach((bit) => {
      count += bit;
    })
  });

  return count;
}

const debugImage = (image, desc) => {
  let st = `** ${desc} **\n`
  image.forEach((row) => {
    row.forEach((bit) => {
      st += bit ? "#" : ".";
    })
    st += "\n"
  })

  st += "\n"
  console.log(st);
}

const run = () => {
  const data = readStringArrayFromFile("./input/day20.txt", "\n");
  let enhanceCode = [];
  let blankRead = false;
  let image = [];
  data.forEach((line) => {
    const lineBits = line.split("").map((ch) => { return (ch == "#") ? 1 : 0 });
    if (blankRead) {
      image.push(lineBits);
    } else if (lineBits.length == 0) {
      blankRead = true;
    } else {
      lineBits.forEach((bit) => { enhanceCode.push(bit) });
    }
  })

  // debugImage(image, "initial");
  image = expandImage(image);
  // debugImage(image, "first expand");
  image = enhanceImage(enhanceCode, image, 0);
  // debugImage(image, "first enhance");
  // image = expandImage(image);
  // debugImage(image, "second expand");
  image = enhanceImage(enhanceCode, image, enhanceCode[0]);
  // debugImage(image, "second enhance");

  const numLit = countLit(image);

  console.log(`numLit: ${numLit}`);
};

// not 5560

module.exports = { run };