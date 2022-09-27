// js에 queue가 필요한 이유
// array에서 shift를 제공하지만 시간복잡도가 선형이고
// JS엔진에서 최적화를 해주긴하지만 어찌됐든 37000개 정도를 넘어가면
// 최적화도 더 이상 소용없이 엄청나게 느려지므로 queue형태가 필요하면 구현해서 써야함

class Queue {
  head = 0;
  tail = 0;
  queue = [];
  constructor(arr) {
    this.queue = arr;
    this.tail = arr.length - 1;
  }
  enqueue(v) {
    if (this.queue.length === 0) {
      this.queue[0] = v;
      return;
    }
    this.queue[++this.tail] = v;
  }
  dequeue() {
    // 더 이상 뽑아낼 값이 없음을 의미
    if (this.head > this.tail) return;
    const result = this.queue[this.head];

    delete this.queue[this.head++];

    return result;
  }
  isEmpty() {
    if (this.head > this.tail) return true;
    return false;
  }
}

const forQueue = Array.from(Array(15 * 10000), (_, i) => i);
const forShift = forQueue.slice();
/** shift와 비교하여 속도 비교 */

// queue: 22 ~ 24ms
console.time('queue');
const q = new Queue(forQueue);

while (!q.isEmpty()) {
  q.dequeue();
}
console.timeEnd('queue');

// shift: 1.69 ~ 1.73s
console.time('shift');
while (forShift.length) {
  forShift.shift();
}
console.timeEnd('shift');

// 이건 뭐 비교자체가 불가능하다...
// 요소 150000개 기준 대략 700배 이상 효율이 좋다...
