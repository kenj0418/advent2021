const { readStringArrayFromFile } = require("./lib");

const translateName = (name) => {
  if (name == "start") {
    return "@";
  } else if (name == "end") {
    return "#";
  } else {
    return name;
  }
}

const createEdge = (e) => {
  const parts = e.split("-");
  return {
    from: translateName(parts[0]),
    to: translateName(parts[1])
  }
}

const createNode = (name) => {
  return { name, isSmall: isSmallCave(name), edges: [] }
}

const createNodes = (edges) => {
  let nodes = {}
  edges.forEach((edge) => {
    if (!nodes[edge.from]) {
      nodes[edge.from] = createNode(edge.from);
    }
    if (!nodes[edge.to]) {
      nodes[edge.to] = createNode(edge.to);
    }
  });

  return nodes;
}

const hasEdgeTo = (fromNode, toNode) => {
  let found = false;
  fromNode.edges.forEach((e) => {
    if (e.name == toNode.name) {
      found = true;
    }
  });

  return found;
}

const connectNodes = (node1, node2) => {
  if (!hasEdgeTo(node1, node2) && (node1.name != "#") && (node2.name != "@")) {
    // console.log(`Connecting ${node1.name} to ${node2.name}`);
    node1.edges.push(node2);
  }
}

const addEdges = (nodes, edges) => {
  edges.forEach((edge) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];
    if (!fromNode) {
      throw new Error(`NOT FOUND: ${edge.from}`);
    }
    if (!toNode) {
      throw new Error(`NOT FOUND: ${edge.to}`);
    }

    connectNodes(fromNode, toNode);
    connectNodes(toNode, fromNode);
  });
}

const buildGraph = (edges) => {
  const nodes = createNodes(edges);
  addEdges(nodes, edges);
  return nodes;
}

const isSmallCave = (node) => {
  return node == node.toLowerCase(); // includes start and end
}

const findPathsStartingAt = (start, pathFollowed, hasVisitedASmallTwice) => {
  if (start.name == "#") {
    // console.log(`Path followed: ${pathFollowed}`);
    return 1;
  }

  let pathsFound = 0;
  start.edges.forEach((edge) => {
    const previouslyVisitedSmall = edge.isSmall && pathFollowed.indexOf(edge.name) >= 0;
    if (!previouslyVisitedSmall || !hasVisitedASmallTwice) {
      pathsFound += findPathsStartingAt(edge, `${pathFollowed}->${edge.name}`, hasVisitedASmallTwice || previouslyVisitedSmall);
    }
  })

  return pathsFound;
}

const findValidPaths = (nodes) => {
  // are loops a concern? (Answer: no, with the input given)
  return findPathsStartingAt(nodes["@"], "@", false);
};

const run = () => {
  const data = readStringArrayFromFile("./input/day12.txt", "\n");
  const edges = data.map((e) => { return createEdge(e) });
  const nodes = buildGraph(edges);

  const pathCount = findValidPaths(nodes);

  console.log(`pathCount: ${pathCount} `);
};

module.exports = { run };