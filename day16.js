const { readStringArrayFromFile, sum } = require("./lib");

const bitsToString = (bits) => {
  return bits.map((bit) => { return `${bit}` }).join("");
}

const bitsToNumber = (bits, desc) => {
  let num = 0;
  bits.forEach((bit) => {
    num *= 2;
    num += bit;
  });

  // if (bits.length <= 40) {
  //   console.log(`${desc}: ${bitsToString(bits)} = ${num}`);
  // } else {
  //   console.log(`${desc}: ${bits.length} bits = ${num}`);
  // }
  return num;
}

const readValuePacket = (trans, packets, version, packetType) => {
  let expectingMore = true;
  let value = 0
  while (expectingMore) {
    expectingMore = readBits(trans, 1, "finalChunk?");
    const chunk = readBits(trans, 4, "chunk");
    value *= 16;
    value += chunk;
  }

  packets.push({
    version,
    packetType,
    value
  });
}

const readOperatorPacketByLength = (trans, packets, version, packetType) => {
  const len = readBits(trans, 15, "length");

  const subTransBits = readBits(trans, len, "subTrans", true);
  const subTrans = newTransmission(subTransBits);
  parseTransmission(subTrans);

  packets.push({
    version,
    packetType,
    operands: subTrans.packets
  });
}

const readOperatorPacketByPacket = (trans, packets, version, packetType) => {
  const packetCount = readBits(trans, 11, "packetCount");

  const operands = [];
  for (let i = 0; i < packetCount; i++) {
    parsePacket(trans, operands);
  }

  packets.push({
    version,
    packetType,
    operands
  });
}

const readOperatorPacket = (trans, packets, version, packetType) => {
  const lengthTypeId = readBits(trans, 1, "lengthTypeId");

  if (lengthTypeId === 0) {
    packetResult = readOperatorPacketByLength(trans, packets, version, packetType);
  } else {
    packetResult = readOperatorPacketByPacket(trans, packets, version, packetType);
  }
}

const readBits = (trans, numBits, desc, raw) => {
  const bits = trans.bits.slice(trans.pos, trans.pos + numBits);
  trans.pos += numBits;
  if (raw) {
    return bits;
  } else {
    return bitsToNumber(bits, desc);
  }
}

const parsePacket = (trans, packets) => {
  const version = readBits(trans, 3, "version");
  const packetType = readBits(trans, 3, "packetType");
  if (packetType === 4) {
    readValuePacket(trans, packets, version, packetType);
  } else {
    readOperatorPacket(trans, packets, version, packetType)
  }
}

const dataToBits = (st) => {
  const bits = [];
  st.split("").forEach((hexSt) => {
    let hex = parseInt(hexSt, 16);
    if (hex >= 8) {
      bits.push(1);
      hex -= 8;
    } else {
      bits.push(0);
    }
    if (hex >= 4) {
      bits.push(1);
      hex -= 4;
    } else {
      bits.push(0);
    }
    if (hex >= 2) {
      bits.push(1);
      hex -= 2;
    } else {
      bits.push(0);
    }
    if (hex >= 1) {
      bits.push(1);
    } else {
      bits.push(0);
    }
  });

  return bits;
}

const parseTransmission = (trans) => {
  while (trans.pos + 10 < trans.bits.length) {
    parsePacket(trans, trans.packets);
  }
}

const newTransmission = (bits) => {
  return {
    bits,
    packets: [],
    pos: 0
  };
}

const calculateVersionSum = (packets) => {
  let runningSum = 0;
  packets.forEach((packet) => {
    runningSum += packet.version;
    if (packet.operands) {
      runningSum += calculateVersionSum(packet.operands);
    }
  })
  return runningSum;
}

const evaluteSum = (packets) => {
  let runningSum = 0
  packets.forEach((packet) => {
    runningSum += evaluatePacket(packet);
  });
  return runningSum;
}

const evaluteProduct = (packets) => {
  let runningProduct = 1
  packets.forEach((packet) => {
    runningProduct *= evaluatePacket(packet);
  });
  return runningProduct;
}

const evaluteMinimum = (packets) => {
  let minimum = evaluatePacket(packets[0]);

  packets.forEach((packet) => {
    const currValue = evaluatePacket(packet);
    if (currValue < minimum) {
      minimum = currValue;
    }
  });
  return minimum;
}

const evaluteMaximum = (packets) => {
  let maximum = evaluatePacket(packets[0]);

  packets.forEach((packet) => {
    const currValue = evaluatePacket(packet);
    if (currValue > maximum) {
      maximum = currValue;
    }
  });
  return maximum;
}

const evaluteConditional = (packets, condition) => {
  const op1 = evaluatePacket(packets[0]);
  const op2 = evaluatePacket(packets[1]);

  return condition(op1, op2) ? 1 : 0;
}

const evaluatePacket = (packet) => {
  switch (packet.packetType) {
    case 0: // sum
      return evaluteSum(packet.operands);
    case 1: // product
      return evaluteProduct(packet.operands);
    case 2: // minimum
      return evaluteMinimum(packet.operands);
    case 3: // maximum
      return evaluteMaximum(packet.operands);
    case 4: // value
      return packet.value;
    case 5: // greater than
      return evaluteConditional(packet.operands, (op1, op2) => { return op1 > op2 });
    case 6: // less than
      return evaluteConditional(packet.operands, (op1, op2) => { return op1 < op2 });
    case 7: // equal to
      return evaluteConditional(packet.operands, (op1, op2) => { return op1 == op2 });
    default:
      throw new Error(`Unknown packet type; ${packet.packetType}`);
  }
}

const run = () => {
  const data = readStringArrayFromFile("./input/day16.txt", "\n");
  const bits = dataToBits(data[0]);
  const trans = newTransmission(bits);

  parseTransmission(trans);

  const sumOfVersions = calculateVersionSum(trans.packets);
  console.log(`sumOfVersions: ${sumOfVersions}`);

  const result = evaluatePacket(trans.packets[0]);
  console.log(`result: ${result}`);
};

module.exports = { run };