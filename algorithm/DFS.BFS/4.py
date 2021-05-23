# https://www.acmicpc.net/problem/2667
# 1이 이어져 있는 경우에 단지라고 문제에 적혀있어 1이 하나만 있는 경우는 제외하고 코드를 짰었는데
# 아무리 수정해도 계속 틀렸다고 하여 1이 하나만 있는 경우도 포함시켰더니 정답처리되었다
# 부정확한 문제는 좀 수정을 했으면 좋겠다. 어떻게 건물이 하나 있는데 '단지'인가.

n = int(input())
graph = [list(input()) for _ in range(n)]

dx = [0,0,1,-1]
dy = [1,-1,0,0]

result = list()

def bfs(x, y):
    nv = list()
    cnt = 1 # 1이 하나만 있을 경우를 대비해 line30에서 첫 좌표를 0처리했기때문에 cnt = 1로 시작
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
            graph[i][j] = 0 # 1이 두개이상 이어져 있다면 첫 좌표를 0처리 안해도 다음칸에서 0 처리 되기 때문에 불필요했다.
            result.append(bfs(i,j))

print(len(result))
for v in sorted(result):
    print(v)
