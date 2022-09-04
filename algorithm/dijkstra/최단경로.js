class MinHeap {
  heap = [null];

  push(v) {
    this.heap.push(v);

    let currentIndex = this.heap.length - 1;
    let parentIndex = Math.floor(currentIndex / 2);

    while (parentIndex !== 0 && this.heap[parentIndex][1] > v[1]) {
      const toBeChild = this.heap[parentIndex];

      this.heap[parentIndex] = v;
      this.heap[currentIndex] = toBeChild;

      currentIndex = parentIndex;
      parentIndex = Math.floor(currentIndex / 2);
    }
  }

  pop() {
    if (this.heap.length === 2) return this.heap.pop();

    const result = this.heap[1];
    this.heap[1] = this.heap.pop();
    let parentIndex = 1;
    let nextParentIndex =
      this.heap[parentIndex * 2][1] > this.heap[parentIndex * 2 + 1][1]
        ? parentIndex * 2 + 1
        : parentIndex * 2;

    while (this.heap[nextParentIndex][1] < this.heap[parentIndex][1]) {
      const toBeChild = this.heap[parentIndex];
      this.heap[parentIndex] = this.heap[nextParentIndex];
      this.heap[nextParentIndex] = toBeChild;

      parentIndex = nextParentIndex;
      nextParentIndex =
        this.heap[parentIndex * 2][1] > this.heap[parentIndex * 2 + 1][1]
          ? parentIndex * 2 + 1
          : parentIndex * 2;
    }

    return result;
  }
}

function dijkstra(vertexes, map, node, weight = 0) {
  vertexes[node] = weight;

  for (let i = 1; i < map[node].heap.length; i++) {
    const [to, distance] = map[node].heap[i];
    const nextWeight = weight + distance;
    distance <= vertexes[to] &&
      nextWeight < vertexes[to] &&
      dijkstra(vertexes, map, to, nextWeight);
  }
}

require('fs').readFile(
  process.platform === 'linux' ? '/dev/stdin' : '../input.txt',
  (err, data) => {
    const [[V, E], [K], ...trunks] = data
      .toString()
      .split('\n')
      .map((x) => x.split(' ').map(Number));

    const map = trunks.reduce(
      (map, [u, v, w]) => {
        map[u].push([v, w]);

        return map;
      },
      Array.from(Array(V + 1), (_) => new MinHeap())
    );

    const vertexes = Array(V + 1).fill(Infinity, 1);
    const result = [];

    for (let i = 1; i <= V; i++) {
      if (i === K) {
        result.push(0);
        continue;
      }
      const sliced = vertexes.slice();
      dijkstra(sliced, map, K);
      result.push(`${sliced[i] === Infinity ? 'INF' : sliced[i]}`);
    }

    console.log(result.join('\n'));
  }
);
