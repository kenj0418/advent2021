const { readStringArrayFromFile } = require("./lib");

const MATCHES_REQUIRED = 12;

const ROTATIONS = [
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

const getPairsOfBeacons = (scanner, bothOrders) => {
  const pairs = []

  if (bothOrders) {
    for (let i = 0; i < scanner.beacons.length; i++) {
      for (let j = 0; j < scanner.beacons.length; j++) {
        pairs.push([scanner.beacons[i], scanner.beacons[j]]);
      }
    }
  } else {
    for (let i = 0; i < scanner.beacons.length; i++) {
      for (let j = i + 1; j < scanner.beacons.length; j++) {
        pairs.push([scanner.beacons[i], scanner.beacons[j]]);
      }
    }
  }

  return pairs;
}

const manhattanDist = (pair) => {
  return Math.abs(pair[0].x - pair[1].x) + Math.abs(pair[0].y - pair[1].y) + Math.abs(pair[0].z - pair[1].z)
}

const rotateX = (p) => {
  // (i,j,k) will be mapped to position (i,-k,j)

  return {
    x: p.x,
    y: -p.z,
    z: p.y,
  }

}

const rotateY = (p) => {
  // y-axis maps (i,j,k) to (k,j,-i)
  return {
    x: p.z,
    y: p.y,
    z: -p.x,
  }
}

const simpleRotate = (beacon, rotation) => {
  let newBeacon = { x: beacon.x, y: beacon.y, z: beacon.z };
  rotation.split("").forEach((rot) => {
    if (rot == "X") {
      newBeacon = rotateX(newBeacon);
    } else {
      newBeacon = rotateY(newBeacon);
    }
  })

  return newBeacon;
}

const rotationMatches = (p1, p2, rotation) => {
  const newP2 = simpleRotate(p2, rotation);
  return (p1.x == newP2.x) && (p1.y == newP2.y) && (p1.z == newP2.z);
}

const getRotation = (origin, originalP1, originalP2) => {
  // rotate p2 around origin until they match, if possible

  const p1 = {
    x: originalP1.x - origin.x,
    y: originalP1.y - origin.y,
    z: originalP1.z - origin.z,
  };

  const p2 = {
    x: originalP2.x - origin.x,
    y: originalP2.y - origin.y,
    z: originalP2.z - origin.z,
  };

  for (let i = 0; i < ROTATIONS.length; i++) {
    if (rotationMatches(p1, p2, ROTATIONS[i])) {
      return ROTATIONS[i];
    }
  }

  return false; // no valid rotation makes it match
}

const checkCompatible = (pair1, pair2) => {
  if (manhattanDist(pair1) != manhattanDist(pair2)) {
    return null; // point pairs aren't same distances apart from each other, quick exit
  }

  // first, translate pair2[0] to coincide with pair1[0]
  const translation = {
    x: pair2[0].x - pair1[0].x,
    y: pair2[0].y - pair1[0].y,
    z: pair2[0].z - pair1[0].z
  };

  // next, translate pair2[1] to match
  const newPair2SecondPoint = {
    x: pair2[1].x + translation.x,
    y: pair2[1].y + translation.y,
    z: pair2[1].z + translation.z
  };

  // now, rotate until pair2[1] coincides with pair1[1], if possible
  const rotation = getRotation(pair1[0], pair1[1], newPair2SecondPoint);

  if (rotation) {
    return { translation, rotation };
  } else {
    // no valid rotation for them to match
    return null;
  }
}

const translateBeacon = (beacon, translation, reverse) => {
  const reverseFactor = (reverse) ? -1 : 1;
  return {
    x: beacon.x + translation.x * reverseFactor,
    x: beacon.y + translation.y * reverseFactor,
    x: beacon.z + translation.z * reverseFactor
  };
}

const rotateBeacon = (beacon, rotation, origin) => {
  let newBeacon = translateBeacon(beacon, origin, true);
  newBeacon = simpleRotate(newBeacon, rotation);
  newBeacon = translateBeacon(beacon, origin, false);
  return newBeacon;
}

const rotateAndTranslateBeacon = (beacon, actionsRequired, rotationOrigin) => {
  let newBeacon = translateBeacon(beacon, actionsRequired.translation);
  newBeacon = rotateBeacon(newBeacon, actionsRequired.rotation, rotationOrigin);
}

const rotateAndTranslateScanner = (scanner, actionsRequired, rotationOrigin) => {
  const newScanner = { scannerNum: scanner.scannerNum, beacons: [] };
  scanner.beacons.forEach((beacon) => {
    newScanner.push(rotateAndTranslateBeacon(beacon, actionsRequired, rotationOrigin))
  })

  return newScanner;
}

const isMatch = (scanner1, scanner2) => {
  let numMatches = 0;

  for (let i = 0; i < scanner2.beacons.length; i++) {
    if (beaconExists(scanner1.beacons, scanner2.beacons[i])) {
      numMatches++;

      if (numMatches >= MATCHES_REQUIRED) {
        return true;
      }
    }
  }

  return false;
}

const tryToMatchScanners = (existing, newScanner) => {
  const existingPairs = getPairsOfBeacons(existing, false);
  const newPairs = getPairsOfBeacons(newScanner, true);

  // console.log(`Comparing ${JSON.stringify(existingPairs)} to ${JSON.stringify(newPairs)}`);
  for (let i = 0; i < existingPairs.length; i++) {
    for (let j = 0; j < newPairs.length; j++) {
      const actionsRequired = checkCompatible(existingPairs[i], newPairs[j])
      if (actionsRequired) {
        console.log(`Comparing compatible: ${JSON.stringify(existingPairs[i])} to ${JSON.stringify(newPairs[i])}`);
        const rotatedTranslatedScanner = rotateAndTranslateScanner(newScanner, actionsRequired, existingPairs[i][0]);
        if (rotatedTranslatedScanner && isMatch(existing, rotatedTranslatedScanner)) {
          return rotatedTranslatedScanner
        }
      }
    }
  }
}

const orientAndTranlateScanners = (scanners) => {
  const grid = {
    min: { x: 0, y: 0, z: 0 },
    max: { x: 0, y: 0, z: 0 },
    beacons: []
  };

  let placedScanners = scanners.slice(0, 1);
  let scannersToPlace = scanners.slice(1);

  while (scannersToPlace.length > 0) {
    console.log(`scannersToPlace: ${scannersToPlace.length}`);

    let wasScannerPlacedThisRound = false;
    let i = 0;
    while (i < scannersToPlace.length) {
      console.log(`i: ${i}`);
      const scannerToPlace = scannersToPlace[i];
      const foundMatch = false;
      for (let j = 0; j < placedScanners.length; j++) {
        const existingScanner = placedScanners[j];
        const rotatedTranslatedScanner = tryToMatchScanners(existingScanner, scannerToPlace);
        if (rotatedTranslatedScanner) {
          scannersToPlace.splice(i, 1)
          placedScanners.push(rotatedTranslatedScanner);
          foundMatch = true;
          wasScannerPlacedThisRound = true;
          continue;
        }
      }

      if (!foundMatch) {
        i++;
      }
    }

    if (!wasScannerPlacedThisRound && scannersToPlace.length) {

      throw new Error(`Giving up, couldn't place any more scanners.  ${scannersToPlace.length} still unplaced.`);
    }
  }

  return grid;
}

const beaconExists = (beacons, newBeacon) => {
  for (let i = 0; i < beacons.length; i++) {
    if ((beacons[i].x == newBeacon.x) && (beacons[i].y == newBeacon.y) && (beacons[i].x == newBeacon.z)) {
      return true;
    }
  }

  return false;
}

const getUniqueBeacons = (orientedScanners) => {
  const beacons = [];

  orientedScanners.forEach((scanner) => {
    scanner.beacons.forEach((beacon) => {
      if (!beaconExists(beacons, beacon)) {
        beacons.push(beacon);
      }
    })
  });

  return beacons;
}

const run = () => {
  const data = readStringArrayFromFile("./input/day19.txt", "\n");
  const scanners = parseScanners(data);
  console.log(`Starting with ${scanners.length} scanners.`);
  const orientedScanners = orientAndTranlateScanners(scanners);
  const beacons = getUniqueBeacons(orientedScanners);

  console.log(`beacons: ${beacons.length}`);
};

module.exports = { run };