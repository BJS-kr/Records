// 1차 답안
function go() {
  const coordinates = require('fs')
    .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
    .toString()
    .trim()
    .split('\n')[1]
    .split(' ')
    .map(Number);

  const greaterDictionary = [...new Set(coordinates)]
    .sort((a, b) => a - b)
    .reduce((acc, curr, i) => ((acc[curr] = i), acc), {});

  return coordinates.reduce(
    (result, coordinate) => (
      (result += `${greaterDictionary[coordinate]} `), result
    ),
    ''
  );
}

console.log(go());

// 2차 답안: map사용 -> 메모리, 시간 향상(메모리 : 317176 -> 271232, 시간: 2136 -> 1728)
function go() {
  const coordinates = require('fs')
    .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
    .toString()
    .trim()
    .split('\n')[1]
    .split(' ')
    .map(Number);

  const greaterDictionary = coordinates
    .slice() // sort는 원본 배열을 정렬시키므로 얕은 복사해야함
    .sort((a, b) => a - b)
    .reduce((map, curr) => {
      !map.has(curr) &&
        (map.set(curr, map.get('i')), map.set('i', map.get('i') + 1));
      return map;
    }, new Map([['i', 0]]));

  return coordinates.reduce(
    (result, coordinate) => (
      (result += `${greaterDictionary.get(coordinate)} `), result
    ),
    ''
  );
}

console.log(go());
