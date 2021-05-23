# https://www.acmicpc.net/problem/2667

n = int(input())
graph = [list(input()) for _ in range(n)]

dx = [0,0,1,-1]
dy = [1,-1,0,0]

result = list()

def bfs(x, y):
    nv = list()
    cnt = 1
    nv.append((x, y))
    while nv:
        x, y = nv.pop(0)
        for i in range(4):
            nx, ny = x + dx[i], y + dy[i]
            if nx >= 0 and nx < n and ny >= 0 and ny < n:
                if graph[nx][ny] == '1':
                    graph[nx][ny] = 0
                    cnt += 1
                    nv.append((nx, ny))
    return cnt
    

for i in range(n):
    for j in range(n):
        if graph[i][j] == '1':
            graph[i][j] = 0
            result.append(bfs(i,j))

print(len(result))
for v in sorted(result):
    print(v)
