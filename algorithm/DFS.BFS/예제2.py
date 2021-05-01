# 미로탈출 최단거리
from collections import deque

# 이동좌표 정의
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

def bfs(x,y):
    queue = deque()
    queue.append((x,y))# 튜플 append
    while queue:
        x, y = queue.popleft()
        for i in range(4): # 상하좌우 4가지니까
            nx = x + dx[i] # 현재좌표에서 이동값을 더하여 이동할 좌표 nx 도출
            ny = y + dy[i]
            # 범위 벗어난 경우 무시
            if nx < 0 or nx >= n or ny < 0 or ny >= m:
                continue
            # 벽 무시
            if graph[nx][ny] == 0:
                continue
            # 해당노드 첫 방문시만 거리 기록. 노드 값이 1이면 처음 방문한거니까.
            if graph[nx][ny] == 1:
                graph[nx][ny] = graph[x][y] + 1 # while문에서 x,y의 값이 계속 재선언되므로 결국 1칸 이동할때마다 +1이라는 소리.
                queue.append((nx, ny)) # for range(4)이므로 상하좌우중 1이 있는 좌표가 append되어 while이 또 실행됨.
    return graph[n - 1][m - 1] # n, m 에서 -1 해야 index값이 맞으니까.
    # 이게 최단 거리인 이유는, 모든 칸에 시작지점으로부터의 거리를 기록하기 때문이다.
    # [n-1][m-1]은 문제의 목표 위치기 때문에 넣은 것이고 다른 칸을 넣더라도 그 칸까지의 최단거리가 이미 계산되어 값이 되어있기 때문에 출력된다.
                
n,m = map(int,input().split())
graph = []
for i in range(n):
    graph.append(list(map(int, input())))
    
print(bfs(0,0))
