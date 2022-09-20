class MaxHeap {
  #heap = [null];
  heapify(arr) {
    for (const v of arr) {
      this.push(v);
    }
  }
  push(n) {
    this.#heap.push(n);
    let cI = this.#heap.length - 1;
    let pI = Math.floor(cI / 2);

    while (this.#heap[cI] > this.#heap[pI] && pI !== 0) {
      [this.#heap[cI], this.#heap[pI]] = [this.#heap[pI], this.#heap[cI]];
      cI = pI;
      pI = Math.floor(cI / 2);
    }
    console.log(this.#heap);
  }
  pop() {
    const result = this.#heap[1];
    this.#heap[1] = this.#heap.pop();
    let pI = 1;
    let cI = this.#heap[2] > this.#heap[3] ? 2 : 3;
    while (this.#heap[pI] < this.#heap[cI]) {
      [this.#heap[pI], this.#heap[cI]] = [this.#heap[cI], this.#heap[pI]];
      pI = cI;
      cI = this.#heap[pI * 2] > this.#heap[pI * 2 + 1] ? pI * 2 : pI * 2 + 1;
    }

    console.log(result);
    return result;
  }
  len() {
    return this.#heap.length - 1;
  }
}

const h = new MaxHeap();

h.heapify([1, 2, 2, 3, 2, 1, 3, 5, 4, 3, 7]);

h.pop();
h.pop();
h.pop();
h.pop();
h.pop();
h.pop();
h.pop();
h.pop();
