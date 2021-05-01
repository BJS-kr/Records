# 재귀적 표현
# 2차원 list로 그래프 만들기. 인덱스 번호를 노드로 씀.
graph = [
    [],
    [2, 3, 8],
    [1, 7],
    [1, 4, 5],
    [3, 5],
    [3, 4],
    [7],
    [2, 6, 8],
    [1,7]
]

# 각 노드가 방문된 정보를 표현 (1차원 리스트)
visited = [False] * 9 
# [False,False,False,False,False,False,False,False,False]
# 노드는 총 8개이지만 직관성으로 위해 0번인덱스는 사용하지 않으므로 총 9개의 False를 표현.

def dfs(graph,v, visited):
    #현재 노드를 방문 처리
    visited[v] = True
    print(v, end=' ') # 출력 끝 부분에 공백 넣기.출력이 재귀적으로 실행되지만 쭉 이어져서 출력되는 효과.
    # 현재 노드와 연결된 다른 노드를 재귀적으로 방문
    for i in graph[v]:
        if not visited[i]:
            dfs(graph, i, visited)
            
dfs(graph,1,visited)

# double-ended queue = deque 양방향에서 삽입 삭제 처리 가능
# 사용 가능한 method
# append(), appendleft(), extend(iterable), extendleft(iterable),pop(), popleft(), 
# rotate(n) -> 양수(오른쪽으로 밀림) 음수(왼쪽으로 밀림) 넣으면 그만큼 elements들 회전시켜줌
# ex) [1,2,3,4,5]를 rotate(1)하면 [5,1,2,3,4]이고 rotate(-1)하면 [2,3,4,5,1]
from collections import deque

visited = [False] * 9 

#BFS 메서드 정의
def bfs(graph, start, visited):
    # 큐 구현을 위해 deque 라이브러리 사용
    queue = deque([start])
    # 현재 노드를 방문 처리
    visited[start] = True
    # 큐가 빌 때까지 반복
    while queue:
        # 큐에서 하나의 원소를 뽑아 출력하기
        v = queue.popleft()
        print(v, end=' ')
        # 아직 방문하지 않은 인접한 원소들을 큐에 삽입
        for i in graph[v]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True
            
bfs(graph,1,visited)
