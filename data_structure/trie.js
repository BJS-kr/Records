// trie를 사용하는 상황은 여러 위치에 삽입이 매우 잦을 확률이 높다.
// 그러므로 시간복잡도를 고려하여 node에 포인터를 저장하는 식으로 사용한다.
class Node {
  children = new Map();
  constructor(value = '') {
    this.value = value;
  }
}

class Trie {
  root = new Node();

  insert(s) {
    let curr = this.root;

    for (const c of s) {
      if (!curr.children.has(c)) {
        curr.children.set(c, new Node(curr.value + c));
      }

      curr = curr.children.get(c);
    }
  }

  find(s) {
    let curr = this.root;
    let currVal = this.root.children;

    for (const c of s) {
      if (!curr.children.get(c)) {
        return currVal;
      } else {
        curr = curr.children.get(c);
        currVal = curr.children;
      }
    }

    return currVal;
  }
}

const T = new Trie();

T.insert('hello');
T.insert('helic');

// console.log(
//   require('util').inspect(T.root, false, null, true /* enable colors */)
// );

console.log(T.find('hel'));
