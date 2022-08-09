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
      this.heap[parentIndex] = value;
      this.heap[currentIndex] = toBeChild;

      // 다음 while 반복문에서 올바른 검증이 이뤄질 수 있도록 parent, current값 교체
      currentIndex = parentIndex;
      parentIndex = Math.floor(currentIndex / 2);
    }
  }

  pop() {}
}
