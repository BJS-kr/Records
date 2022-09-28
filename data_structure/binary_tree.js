class BinaryTree {
  tree = [null];
  insert(v) {
    if (!tree[1]) {
      tree[1] = v;
      return;
    }
    let cur = 1;
    let left = cur * 2;
    let right = cur * 2 + 1;

    while (this.tree[left]) {
      if (!this.tree[right]) {
        this.tree[right] = v;
        return;
      }
      cur = left;
      left = cur * 2;
      right = cur * 2 + 1;
    }
    this.tree[left] = v;
  }
}
