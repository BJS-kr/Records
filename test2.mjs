class Queue {
  head;
  tail;
  queue = [null];
  enqueue(v) {
    if (!this.head) {
      this.queue[1] = v;
      this.head = 1;
      this.tail = 1;
      return;
    }
    this.queue[++this.tail] = v;
  }
  dequeue() {
    const result = this.queue[this.head];
    delete this.queue[this.head++];

    return result;
  }
}

const q = new Queue();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
q.enqueue(4);
q.enqueue(5);
q.enqueue(6);
q.enqueue(7);

console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());

console.log(q.queue);
