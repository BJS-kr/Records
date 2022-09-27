// 목표 스펙
// pop_front: 상수시간
// pop_back: 상수시간
// push_front: 상수시간
// push_back: 상수시간
// rotate: 상수시간

// 1번 구현
// 상수시간 목표와 다르게 push_front가 unshift로 이루어질 수 있어 매우 위험하다.
// 그러나 코드가 적고 구현이 쉬워 코테에 활용할 가능성이 높다.
class Deque {
  head = 0;
  tail = 0;
  deque = [];
  push_front(v) {
    if (this.head === 0) {
      this.deque.unshift(v);
      if (this.deque.length > 1) ++this.tail;
      return;
    }
    this.deque[--this.head] = v;
  }

  push_back(v) {
    this.deque[++this.tail] = v;
  }

  pop_front() {
    if (this.head > this.tail) return;
    const result = this.deque[this.head];

    delete this.deque[this.head++];

    return result;
  }

  pop_back() {
    if (this.tail < this.head) return;
    const result = this.deque[this.tail];

    delete this.deque[this.tail--];

    return result;
  }

  rotate() {
    const head = this.deque[this.head];
    delete this.deque[this.head++];
    this.deque[++this.tail] = head;
  }
}

// 2번 구현
// Node로 처리. 모든 동작이 상수시간
// deque의 요건은 만족하나, 코드가 길어 코테를 가정하면 시간이 오래걸릴 가능성이 높다
class Node {
  pre = null;
  post = null;
  v;
  constructor(v) {
    this.v = v;
  }
}
class Deque2 {
  head;
  tail;
  push_front(v) {
    const node = new Node(v);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }
    node.post = this.head;
    this.head.pre = node;
    this.head = node;
  }
  push_back(v) {
    const node = new Node(v);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }
    node.pre = this.tail;
    this.tail.post = node;
    this.tail = node;
  }
  pop_front() {
    const result = this.head.v;
    // head와 tail이 같아진경우 즉 요소가 하나인 경우
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.post;
      this.head.pre = null;
    }

    return result;
  }
  pop_back() {
    const result = this.tail.v;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.pre;
      this.tail.post = null;
    }

    return result;
  }
  rotate() {
    const head = this.head;
    this.head = this.head.post;
    this.head.pre = null;

    head.pre = this.tail;
    this.tail.post = head;
    this.tail = this.tail.post;
    this.tail.post = null;
  }
  travel() {
    let cur = this.head;
    let result = [];
    while (cur) {
      result.push(cur.v);
      cur = cur.post;
    }
    console.log(result);
  }
}

const deque = new Deque2();

deque.push_front(1);
deque.push_back(2);
deque.push_front(3);
deque.push_back(4);
deque.push_front(5);
deque.push_back(6);

// 여기 까지 진행했을 때 5 3 1 2 4 6

deque.rotate();

// rotate하여 3 1 2 4 6 5

console.log(deque.pop_front()); // 3
console.log(deque.pop_back()); // 5
console.log(deque.pop_front()); // 1
console.log(deque.pop_back()); // 6
console.log(deque.pop_front()); // 2
console.log(deque.pop_back()); // 4

// 속도비교
// 비교군: unshift(push_front) + push, shift(pop_front) + pop
// 실험방법: 10만개 push_back 이후 10만개 push_front, 10만개 pop_front 후 10만개 pop_back

console.time('array method'); // 3.3 ~ 3.4 s
const tester = [];
for (let i = 0; i < 100000; i++) {
  tester.push(i);
}
for (let i = 0; i < 100000; i++) {
  tester.unshift(i);
}
for (let i = 0; i < 100000; i++) {
  tester.shift();
}
for (let i = 0; i < 100000; i++) {
  tester.pop();
}
console.timeEnd('array method');

console.time('deque'); // 107 ~ 129 ms
const dq2 = new Deque2();
for (let i = 0; i < 100000; i++) {
  dq2.push_back(i);
}
for (let i = 0; i < 100000; i++) {
  dq2.push_front(i);
}
for (let i = 0; i < 100000; i++) {
  dq2.pop_front();
}
for (let i = 0; i < 100000; i++) {
  dq2.pop_back();
}
console.timeEnd('deque');

// 역시 전부 상수시간이라 압도적으로 빠르다.
// 위 실험 결과는 약 300배 정도 빠르다.
