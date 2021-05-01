# 음료수 얼려먹기

# DFS로 특정 노드를 방문하고 연결된 모든 노드들도 추가방문
def dfs(x,y):
    # 주어진 범위를 벗어나는 경우에는 즉시 종료
    if x <= -1 or x >= n or y <= -1 or y >= m:
        return False
    # 현재 노드를 아직 방문하지 않았다면 방문처리 및 사방 방문 
    # 재귀적으로 실행되기 때문에 이어진 0들은 계속해서 1로 바뀜
    if graph[x][y] == 0:
        graph[x][y] == 1
        dfs(x - 1, y)
        dfs(x + 1, y)
        dfs(x, y - 1)
        dfs(x, y + 1)
        return True
    return False # 위 if가 모두 실패했을 경우 False

# 모든 노드에 대하여 실행하고 답 구하기
# 한 지점에서 실행해도 재귀적으로 연결된 모든 0이 1로 채워진 후에 True를 1개 반환 하므로
# 나눠져있는 0영역들이 총 몇 개인지 도출되는 것

n,m = map(int,input().split())
graph = []
for i in range(n):
    graph.append(list(map(int, input())))

result = 0

for i in range(1, n + 1):
    for j in range(m):
        if dfs(i, j) == True:
            result += 1

print(result)
