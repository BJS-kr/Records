# https://www.acmicpc.net/problem/2178
# 나동빈 강사의 코드를 따라 작성하였습니다

from collections import deque

def bfs(x, y):
    queue = deque()
    queue.append((x, y))
    while queue:
        
        x, y = queue.popleft()
        
				# 상하좌우 이동하며 시행
        for i in range(4):
            nx = dx[i] + x
            ny = dy[i] + y
            
						# 범위를 벗어나면 실행 X
            if nx < 0 or nx >= N or ny < 0 or ny >= M:
                continue
						# 벽 무시
            if graph[nx][ny] == 0:
                continue
            # 0,0좌표로부터 이동할때마다 +1
            if graph[nx][ny] == 1:
                graph[nx][ny] = graph[x][y] + 1
                queue.append((nx, ny))
		# 모든 이동가능한 좌표에 0,0으로 부터의 거리가 기록되므로, 마지막 칸의 길이를 알 수 있습니다.
    return graph[N - 1][M - 1]


N, M = map(int,input().split())

graph = []
for _ in range(N):
    graph.append(list(map(int,input())))
    
dx = [0, 0, -1, 1]
dy = [-1, 1, 0, 0]

print(bfs(0,0))
