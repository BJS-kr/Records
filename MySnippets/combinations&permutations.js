function permutations(arr, n) {
  // 1개만 뽑는다면 그대로 순열을 반환한다. 탈출 조건으로도 사용된다.
  if (n === 1) return arr.map((v) => [v]);
  let result = [];

  // 요소를 순환한다
  arr.forEach((fixed, idx, arr) => {
    // 현재 index를 제외한 요소를 추출한다.
    // index번째는 선택된 요소
    // 선택된 요소를 제외하고 재귀 호출한다.
    const perms = permutations(
      arr.filter((_, index) => index !== idx),
      n - 1
    );
    // 선택된 요소와 재귀 호출을 통해 구한 순열을 합쳐준다.
    perms.forEach((perm) => result.push([fixed].concat(perm)));
  });

  // 결과 반환
  return result;
}

function combinations(arr, n) {
  // 1개만 뽑는다면 그대로 조합을 반환한다. 탈출 조건으로도 사용된다.
  if (n === 1) return arr.map((v) => [v]);
  const result = [];

  // 요소를 순환한다
  arr.forEach((fixed, idx, arr) => {
    // 현재 index 이후 요소를 추출한다.
    // index번째는 선택된 요소
    // 선택된 요소 이전 요소들을 제외하고 재귀 호출한다.
    const combis = combinations(arr.slice(idx + 1), n - 1);
    // 선택된 요소와 재귀 호출을 통해 구한 조합을 합쳐준다.
    combis.forEach((combi) => result.push([fixed].concat(combi)));
  });

  // 결과 반환
  return result;
}
const fruits = ['Apple', 'Banana', 'Coconut'];

console.table(permutations(fruits, 2));
console.table(combinations(fruits, 2));
