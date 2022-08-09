class MaxHeap {
  // 첫 번째 요소(0번 인덱스)를 사용하지 않는 이유는 계산 편의성 때문이다
  // push에서 parentIndex가 0이 아님을 검사하는 부분이 있는데,
  // 이는 parent가 0이면(즉, heap을 벗어났다는 의미) 최상단이라는 의미이다
  heap = [null];

  push(v) {
    // 일단 heap에 push부터
    this.heap.push(v);
    // 방금 넣은 요소의 인덱스
    let currentIndex = this.heap.length - 1;
    // 부모 인덱스를 나누기 2 하는 이유
    // 힙의 완전 이진 트리 구조를 생각해봤을 때,
    // 마지막에 푸쉬한 요소 index의 나누기 2라고 함은:
    // 예를 들어 6,7 인덱스 모두 부모 인덱스는 3인 것이다.
    // 즉, 자동적으로 항상 이진트리가 완성된다.
    // 인덱스 번호 자체가 중요한 것이 아니고 '그렇게 친다'는 표현이 적절하다.
    // 이렇게 해도 되는 이유는, heap은 어차피 root값만 의미가 있으며
    // 나머지 높이에서는 부모노드보다 자식 노드가 작기만 하면(혹은 크기만하면)되기 때문이다.
    let parentIndex = Math.floor(currentIndex / 2);

    // 최상단이 아니고, 삽입 값이 부모노드보다 큰 동안(Max heap이니까)
    // 삽입 값을 상단으로 끌어올리는 작업
    while (parentIndex !== 0 && this.heap[parentIndex] < v) {
      const toBeChild = this.heap[parentIndex];
      // 부모 자식 자리 바꾸기!
      this.heap[parentIndex] = v;
      this.heap[currentIndex] = toBeChild;

      // 다음 while 반복문에서 올바른 검증이 이뤄질 수 있도록 parent, current값 교체
      currentIndex = parentIndex;
      parentIndex = Math.floor(currentIndex / 2);
    }
  }

  pop() {
    // return 할 값은 최상위 노드로 정해져있다
    const result = this.heap[1];
    // 1번 자리가 무조건 가장 작아야 연산이 시작되기 때문에, heap의 마지막 자리는 항상 나머지 모든 층의 부모노드보다 작기 때문에
    // 1번 자리를 0 같은 걸로 지정하면안된다. 넣지 않은 값이 자리를 차지하게 되기 때문이다.
    this.heap[1] = this.heap.pop();
    let parentIndex = 1;
    // nextParentIndex가 자식 노드 중 더 큰 값이어야 하는 이유:
    // 안 그러면 currentIndex와의 위치 교환이 제대로 이뤄지지 않을 수 있다.
    // 예를 들어, heap에 총 4개의 값이 들어있었다고 가정하자. 순서대로 77,22,11,11이라고 하겠다.
    // pop이 일어난 순간, 77은 빠지고 11이 1번이 되어 위치 조정을 시작해야 할 것이다.
    // 그런데, 11은 22와 비교해서는 더 작으므로 위치조정이 일어나야하지만, 만약 11과 비교된다면 동일하여 위치교환 하지 않는 상황이 발생하게 된다.
    // 그러므로 nextParentIndex는 항상 더 큰 값을 기준으로 설정되어야 올바르다
    let nextParentIndex =
      this.heap[parentIndex * 2] < this.heap[parentIndex * 2 + 1]
        ? parentIndex * 2 + 1
        : parentIndex * 2;

    while (this.heap[nextParentIndex] > this.heap[parentIndex]) {
      const toBeChild = this.heap[parentIndex];
      this.heap[parentIndex] = this.heap[nextParentIndex];
      this.heap[nextParentIndex] = toBeChild;

      parentIndex = nextParentIndex;
      nextParentIndex =
        this.heap[parentIndex * 2] < this.heap[parentIndex * 2 + 1]
          ? parentIndex * 2 + 1
          : parentIndex * 2;
    }

    return result;
  }
}

const H = new MaxHeap();
const pops = [];
for (let i = 0; i < 10; i++) {
  H.push(Math.round(Math.random() * 100));
}
console.log(H.heap);

for (let i = 0; i < 10; i++) {
  pops.push(H.pop());
}
console.log(pops);
