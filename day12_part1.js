const { readStringArrayFromFile } = require("./lib");

const createEdge = (e) => {
  const parts = e.split("-");
  return {
    from: parts[0],
    to: parts[1]
  }
}

const getEdgesForNode = (edges, name) => {
  const found = [];

  edges.forEach((edge) => {
    if (edge.from == name) {
      found.push(edge);
    }
  })

  return found;
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
  if (!hasEdgeTo(node1, node2) && (node1.name != "end") && (node2.name != "start")) {
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

const findPathsStartingAt = (start, parentVisitedSmall, pathFollowed) => {
  if (start.name == "end") {
    console.log(`Path followed: ${pathFollowed}`);
    return 1;
  }

  let pathsFound = 0;
  start.edges.forEach((edge) => {
    const visitedSmall = JSON.parse(JSON.stringify(parentVisitedSmall));
    if (visitedSmall.indexOf(edge.name) < 0) {
      if (edge.isSmall) {
        visitedSmall.push(edge.name);
      }
      pathsFound += findPathsStartingAt(edge, visitedSmall, `${pathFollowed}->${edge.name}`);
    }
  })

  return pathsFound;
}

const findValidPaths = (nodes) => {
  // are loops a concern?
  return findPathsStartingAt(nodes.start, [], "start");
};

const run = () => {
  const data = readStringArrayFromFile("./input/day12.txt", "\n");
  const edges = data.map((e) => { return createEdge(e) });
  const nodes = buildGraph(edges);

  const pathCount = findValidPaths(nodes);

  console.log(`pathCount: ${pathCount} `);
};

module.exports = { run };