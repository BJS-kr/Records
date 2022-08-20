// 프로그래머스 "배달" 문제

// 최적화를 위해 노력한 것을 기억하기 위해 기록해둔다.

// 각 마을마다 가지고 있는 간선을 min heap에 넣어 정보를 mapping한다.
// min heap이 더 이상 원소를 가지지 않을 때 까지 실행하며 재귀 함수의 탈출 조건이다. 그 이전까진 하위 마을에서 재귀실행한다.
// 즉, 함수가 실행될 때 가중치를 가지고 시작해야한다. 출발 시점엔 0이다. 재귀 실행될때 기존 가중치에 추가된 인자를 가지고 실행한다.
// 방문 처리 된 노드는 간선 가중치의 합이 갱신된다. 다만, 이전에 기록된 가중치 합이 더 적을 경우 갱신되지 않는다.
// 1을 제외한 노드에서, 가중치 합이 K이하라면 result를 ++한다.

// 다만, 마을의 갯수가 50 이하이므로 굳이 최소힙 구현을 하지 않더라도 거리에 따른 내림차순 정렬과 pop으로 min heap의 역할이 충분히 수행될 것임을 기대할 수 있다.
// 그러므로 힙은 array로 대체하여 작성한다.

// N: 마을의 갯수,
// road: 간선 정보들. 3의 길이를 가지는 배열이며 0,1인덱스는 마을, 2인덱스는 가중치를 나타낸다.
// K: 기준 시간. 마을에 도달하는 시간이 K보다 작거나 같아야 배달 가능하다.
function solution(N, road, K) {
  const towns = Array.from(Array(N + 1), (x) => []);
  const nodes = [Infinity];

  road.forEach(([a, b, c]) => {
    // '더 작을 때 갱신'이라는 하나의 조건으로 동작하기 위해 모두 Infinity로 초기화
    [nodes[a], nodes[b]] = [Infinity, Infinity];
    towns[a].push([b, c]);
    towns[b].push([a, c]);
  });

  towns.forEach((town) => {
    // 다익스트라는 정렬된 자료구조를 통해 움직이기 때문에,
    // 최소힙처럼 사용하기 위하여 정렬
    town.sort((a, b) => b[1] - a[1]);
  });

  // 모든 데이터가 준비되었으니, 로직 실행
  dijkstra(nodes, towns);

  return nodes.filter((x) => x <= K).length;
}

function dijkstra(nodes, towns, town = 1, weight = 0) {
  // Infinity였던 것을 가중치로 갱신
  // 검증이 필요없는 이유는 재귀 호출 될 때 이미 갱신가능함을 검증하고 진입하기 때문
  // 첫 시작은 town이 1이고 가중치가 0이므로 검증없이 갱신해야 함
  nodes[town] = weight;
  // 재귀 탈출 했을 때 남은 간선들을 탐색해야 하는데,
  // 메모리 힙에 있는 원본 객체를 변경시키면 올바른 참조가 불가능하기 떄문에
  // slice하여 복사된 객체를 활용
  const vertex = towns[town].slice();

  // 모든 간선을 탐색할 때 까지
  while (vertex.length > 0) {
    const [nextTown, nextWeight] = vertex.pop();
    // 모든 간선을 점검하되 진입까지 해버리면 정렬한 의미도 없고 다익스트라도 아님
    // 최소를 기준으로 정렬한 이유가 아래의 조건을 활용하기 위함임
    // 가장 최소부터 탐색했으니 보다 큰 가중치를 가지는 경우를 빠르게 생략할 수 있음
    if (nodes[nextTown] > weight + nextWeight) {
      dijkstra(nodes, towns, nextTown, weight + nextWeight);
    }
  }
}
