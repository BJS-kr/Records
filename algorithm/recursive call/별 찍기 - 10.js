// 현상 1. 1칸씩 떨어진 별들은 2번째 줄 부터 시작하여 +3 되는 줄마다 반복된다.
// 현상 2. 3칸씩 떨어진 별들은 4 ~ 6 번째 줄 부터 시작하여 +9되는 줄 마다 반복된다.
// 현상 3. 9칸씩 떨어진 별들은 10 ~ 18 번째 줄 부터 시작하여 +27 되는 줄 마다 반복된다.

// 현상으로 미루어 볼때, 다음의 규칙을 정의할 수 있다.
// 규칙 1. n칸씩 떨어진 별들은 n+1 ~ n+n 번째 줄부터 시작하여 +(3*n) 되는 줄 마다 반복된다.
// 규칙 2. n길이의 공백은 n+1인덱스부터 n길이만큼 지워지며, 이는 그 줄의 n*3의 지점마다 반복된다.
// 규칙 3. 1~최대길이 공백에서, 최대 길이의 공백은 입력받은 수 N/3이다.
// 규칙 4. 공백 길이의 갯수는 1부터 시작하여, 다음 공백은 이전 공백칸의 x3으로 구할 수 있으며, 이는 N/3에 도달하면 종료된다.

// 규칙을 사용하여, 구현 순서는 다음과 같이 정의할 수 있다.
// 1. 입력 받은 N만큼, N*N 2차원 배열을 생성한다.
// 2. N/3에 도달할때까지, 1부터 3씩 곱해지는 수열을 생성한다.
// 3. 생성된 수열에 대하여, 순차적으로 규칙1이 적용되는 line의 index로 이루어진 수열을 생성한다.
// 4. index의 수열에 대하여, 순차적으로 규칙2를 적용한다.

// ***************************
// * ** ** ** ** ** ** ** ** *
// ***************************
// ***   ******   ******   ***
// * *   * ** *   * ** *   * *
// ***   ******   ******   ***
// ***************************
// * ** ** ** ** ** ** ** ** *
// ***************************
// *********         *********
// * ** ** *         * ** ** *
// *********         *********
// ***   ***         ***   ***
// * *   * *         * *   * *
// ***   ***         ***   ***
// *********         *********
// * ** ** *         * ** ** *
// *********         *********
// ***************************
// * ** ** ** ** ** ** ** ** *
// ***************************
// ***   ******   ******   ***
// * *   * ** *   * ** *   * *
// ***   ******   ******   ***
// ***************************
// * ** ** ** ** ** ** ** ** *
// ***************************

// 구현 1: 이중 배열 생성
const N = +require('fs').readFileSync('/dev/stdin').toString();
let target = [];
let count = 1;
while (count++ <= N) {
  target.push(Array(N).fill('*'));
}

// 구현 2: 필요한 공백의 수열 생성
const spaces = [];
let space = 1;
while (space <= N / 3) {
  spaces.push(space);
  space *= 3;
}

for (const space of spaces) {
  // 구현 3: 수열에 대하여 규칙 1 적용
  const spaceWillBeAffectTo = [];
  let startPoint = 0;
  while (startPoint <= N - space) {
    let row = startPoint + space;

    while (row < startPoint + space * 2) {
      spaceWillBeAffectTo.push(row++);
    }
    startPoint += 3 * space;
  }

  // 구현 4: 영향을 받는 각 라인에 대하여, space만큼의 공백에 규칙 2 적용
  for (const index of spaceWillBeAffectTo) {
    let startPoint = 0;
    while (startPoint <= N - space) {
      let spaceIndex = startPoint + space;
      const spaceEnd = spaceIndex + space;
      while (spaceIndex < spaceEnd) {
        target[index][spaceIndex++] = ' ';
      }
      startPoint += 3 * space;
    }
  }
}

for (const v of target) {
  console.log(v.join(''));
}
