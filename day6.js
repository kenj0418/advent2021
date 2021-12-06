const { readStringArrayFromFile, sum } = require("./lib");

const processFish1 = (fish) => {
  let newFish = 0;

  for (let i = 0; i < fish.length; i++) {
    if (fish[i] == 0) {
      fish[i] = 6;
      newFish++;
    } else {
      fish[i]--;
    }
  }

  for (let i = 0; i < newFish; i++) {
    fish.push(8);
  }

}

const run1 = () => {
  const fish = readStringArrayFromFile("./input/day6.txt", "\n")[0].split(",").map((st) => { return parseInt(st) });

  for (let i = 0; i < 80; i++) {
    processFish(fish);
  }

  console.log(`fish: ${fish.length}`);
};

const processFish = (fish) => {
  return [
    fish[1],
    fish[2],
    fish[3],
    fish[4],
    fish[5],
    fish[6],
    fish[7] + fish[0],
    fish[8],
    fish[0]
  ]
}


const parseFish = (rawFish) => {
  let fish = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < rawFish.length; i++) {
    fish[rawFish[i]]++
  }
  return fish;
}

const run = () => {
  const rawFish = readStringArrayFromFile("./input/day6.txt", "\n")[0].split(",").map((st) => { return parseInt(st) });
  let fish = parseFish(rawFish);
  // console.log(`fish: ${fish}`);

  for (let i = 0; i < 256; i++) {
    fish = processFish(fish);
    // console.log(`fish: ${fish}`);
  }

  console.log(`fish: ${sum(fish)}`);
};

module.exports = { run };