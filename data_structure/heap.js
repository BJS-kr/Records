// 참고로 우선순위 큐는 아래의 힙구조를 우선도를 기준으로 짜면 되므로 사실상 힙을 완벽히 구현할 줄 알게되면 우선순위큐는 자동해결이다.
class MaxHeap {
  #heap = [null];
  heapify(arr) {
    for (const v of arr) {
      this.push(v);
    }
  }
  push(n) {
    this.#heap.push(n);
    let child = this.#heap.length - 1;
    let parent = Math.floor(child / 2);

    while (this.#heap[child] > this.#heap[parent] && parent !== 0) {
      [this.#heap[child], this.#heap[parent]] = [
        this.#heap[parent],
        this.#heap[child],
      ];
      child = parent;
      parent = Math.floor(child / 2);
    }
  }
  pop() {
    const result = this.#heap[1];
    this.#heap[1] = this.#heap.pop();
    let parent = 1;
    let child = this.#heap[2] > this.#heap[3] ? 2 : 3;
    while (this.#heap[parent] < this.#heap[child]) {
      [this.#heap[parent], this.#heap[child]] = [
        this.#heap[child],
        this.#heap[parent],
      ];
      parent = child;
      child =
        this.#heap[parent * 2] > this.#heap[parent * 2 + 1]
          ? parent * 2
          : parent * 2 + 1;
    }

    return result;
  }
  len() {
    return this.#heap.length - 1;
  }
}

const h = new MaxHeap();

// 속도 비교
const forSort = Array.from(Array(150000), () => Math.random());
const forHeap = forSort.slice();
// 1. 150000개 요소 정렬 후 최댓값 10개 순차적으로 찾기
// 556 ~ 589ms
console.time('sort');
forSort.sort();
for (let i = 0; i < 10; i++) {
  forSort.pop();
}
console.timeEnd('sort');
// 2. 150000개 요소 heapify 후 최댓값 10개 순차적으로 찾기
// 너무 불공평한 비교가 되지 않도록 배열의 요소를 하나하나 전부 heap push한다.
// 31 ~ 39ms
console.time('heap');
h.heapify(forHeap);
for (let i = 0; i < 10; i++) {
  h.pop();
}
console.timeEnd('heap');

// 위의 실험조건 기준 대략 15배 정도 빠르다.
