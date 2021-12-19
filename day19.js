const { readStringArrayFromFile } = require("./lib");

const parseScanners = (data) => {
  const scanners = [];
  let currScanner = null;
  data.forEach((line) => {
    if (line.slice(0, 3) === "---") {
      if (currScanner) {
        scanners.push(currScanner);
      }
      const lineParts = line.split(" ");
      currScanner = {
        scannerNum: parseInt(lineParts[2]),
        beacons: []
      };
    } else if (line.trim().length > 0) {
      const lineParts = line.split(",");
      beacon = {
        x: parseInt(lineParts[0]),
        y: parseInt(lineParts[1]),
        z: parseInt(lineParts[2])
      };
      currScanner.beacons.push(beacon);
    }
  });

  if (currScanner) {
    scanners.push(currScanner);
  }

  return scanners;
}

const translate = (beacon, position) => {
  return {
    x: beacon.x - position.x,
    y: beacon.y - position.y,
    z: beacon.z - position.z
  }
}

const rotations = [
  "",
  "X",
  "Y",
  "XX",
  "XY",
  "YX",
  "YY",
  "XXX",
  "XXY",
  "XYX",
  "XYY",
  "YXX",
  "YYX",
  "YYY",
  "XXXY",
  "XXYX",
  "XXYY",
  "XYXX",
  "XYYY",
  "YXXX",
  "YYYX",
  "XXXYX",
  "XYXXX",
  "XYYYX"
]

const rotateX = (newBeacon) => {
  // (i,j,k) will be mapped to position (i,-k,j)

  return {
    x: newBeacon.x,
    y: -newBeacon.z,
    z: newBeacon.y,
  }

}

const rotateY = (newBeacon) => {
  // y-axis maps (i,j,k) to (k,j,-i)
  return {
    x: newBeacon.z,
    y: newBeacon.y,
    z: -newBeacon.x,
  }
}

const rotate = (beacon, rotation) => {
  const rotationsToPerform = rotations[rotation].split("");
  let newBeacon = JSON.parse(JSON.stringify(beacon));
  rotationsToPerform.forEach((rot) => {
    if (rot == "X") {
      newBeacon = rotateX(newBeacon);
    } else {
      newBeacon = rotateY(newBeacon);
    }
  })

  return newBeacon;
}

const hasMatches = (grid, scanner, position, rotation, minMatches) => {
  const beacons = scanner.beacons.map((beacon) => {
    return translate(rotate(beacon, rotation), position);
  });

  let numMatches = 0;
  beacons.forEach((beacon) => {
    if (beaconExists(grid, beacon)) {
      numMatches++;
    }
  });

  return numMatches >= minMatches;
}

const beaconExists = (grid, beacon) => {
  for (let i = 0; i < grid.beacons.length; i++) {
    if ((grid.beacons[i].x == beacon.x) && (grid.beacons[i].y == beacon.y) && (grid.beacons[i].x == beacon.z)) {
      return true;
    }
  }

  return false;
}

const addBeacon = (grid, beacon) => {
  grid.beacons.push(beacon);

  if (beacon.x < grid.min.x) {
    grid.min.x = beacon.x;
  }
  if (beacon.y < grid.min.y) {
    grid.min.y = beacon.y;
  }
  if (beacon.z < grid.min.z) {
    grid.min.z = beacon.z;
  }

  if (beacon.x > grid.max.x) {
    grid.max.x = beacon.x;
  }
  if (beacon.y > grid.max.y) {
    grid.max.y = beacon.y;
  }
  if (beacon.x > grid.max.z) {
    grid.max.z = beacon.z;
  }
}

const placeOnGridSimple = (grid, scanner, position, rotation) => {
  const canPlace = (grid.beacons.length == 0) || hasMatches(grid, scanner, position, rotation, 12);

  if (canPlace) {
    scanner.beacons.forEach((beacon) => {
      const adjBeacon = translate(rotate(beacon, rotation), position)
      if (!beaconExists(grid, adjBeacon)) {
        addBeacon(grid, adjBeacon);
      }
    })
  }

  return canPlace;
}

const placeOnGrid = (grid, scanner) => {
  if (grid.beacons.length == 0) {
    placeOnGridSimple(grid, scanner, { x: 0, y: 0, z: 0 }, 0);
    console.log(`Placed first scanner, now grid.beacons.length=${grid.beacons.length}`);
    return true;
  }

  const minX = grid.min.x;// - 1000;
  const minY = grid.min.y;// - 1000;
  const minZ = grid.min.z;// - 1000;
  const maxX = grid.max.x;// + 1000;
  const maxY = grid.max.y;// + 1000;
  const maxZ = grid.max.z;// + 1000;

  for (let xPos = minX; xPos <= maxX; xPos++) {
    console.log(`xPos: ${xPos}`);
    for (let yPos = minY; yPos <= maxY; yPos++) {
      console.log(`yPos: ${yPos}`);
      for (let zPos = minZ; zPos <= maxZ; zPos++) {
        const position = { x: xPos, y: yPos, z: zPos };

        for (let rotation = 0; rotation < 24; rotation++) {
          if (placeOnGridSimple(grid, scanner, position, rotation)) {
            console.log(`Placed scanner, now grid.beacons.length=${grid.beacons.length}`);
            return true;
          }
        }
      }
    }
  }

  return false;
}

const findUniqueBeacons = (scanners) => {
  const grid = {
    min: { x: 0, y: 0, z: 0 },
    max: { x: 0, y: 0, z: 0 },
    beacons: []
  };

  placeOnGrid(grid, scanners[0]);
  let scannersToPlace = scanners.slice(1);
  while (scannersToPlace.length > 0) {
    let i = 0;
    while (i < scannersToPlace.length) {
      if (placeOnGrid(grid, scanners[i])) {
        scannersToPlace.splice(i, 1)
      } else {
        i++;
      }
    }
  }

  return grid;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day19.txt", "\n");
  const scanners = parseScanners(data);
  const beacons = findUniqueBeacons(scanners);

  console.log(`beacons: ${beacons.length}`);
};

module.exports = { run };