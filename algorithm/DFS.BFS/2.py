# https://www.acmicpc.net/problem/1260

# 풀이 1. 그래프를 list로 구현
# 첨에 dict로 구현했다가 채점하면 KeyError가 나서 list로 바꿈

from collections import deque
        
def dfs(graph, v, visited):
    visited[v] = True
    print(v, end=' ')
    for i in graph[v]:
        if not visited[i]:
            dfs(graph, i, visited)

def bfs(graph, start, visited):    
    queue = deque([start])
    visited[start] = True
    while queue:
        v = queue.popleft()
        print(v, end=' ')
        for i in graph[v]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True
                
n,m,v = map(int,input().split())

graph = [[]for i in range(n+1)]
for i in range(m):
    a,b = map(int,input().split())
    if b not in graph[a]:
        graph[a].append(b)
    if a not in graph[b]:
        graph[b].append(a)
        
for i in range(1,n+1):
    graph[i] = sorted(graph[i])
     
visited = [False] * (n+1)
visited2 = [False] * (n+1)

dfs(graph,v,visited)
print()
bfs(graph,v,visited2)

# 풀이 2. 풀이 1과 논리도 다르고 그래프를 dict로 구현
# 잘 작동하지만 백준 제출하면 KeyError가 난다... 중간에 dict 크기가 바뀌면 에러로 처리한다고 한다.
# 풀이 1과 마찬가지로 list로 바꾸면 무리 없이 통과할 것으로 생각된다. 아카이빙용으로 저장

from copy import deepcopy

def dfs(graph, start_node):
    visited, need_visit = [],[]
    need_visit.append(start_node)
    while need_visit:
        node = min(need_visit[-1])
        need_visit[-1].remove(min(need_visit[-1]))
        if need_visit[-1] == []:
            del need_visit[-1]
        if node not in visited:
            visited.append(node)
            need_visit.append(graph[node])
    return visited

def bfs(graph, start_node):
    visited, need_visit = [],[]
    need_visit.append(start_node)
    while need_visit:
        node = min(need_visit[0])
        need_visit[0].remove(min(need_visit[0]))
        if need_visit[0] == []:
            del need_visit[0]
        if node not in visited:
            visited.append(node)
            need_visit.append(graph[node])
    return visited

n,m,v = map(int,input().split())
v = [v]
v2 = deepcopy(v)

graph = [[]for i in range(n+1)]
for i in range(m):
    a,b = map(int,input().split())
    if b not in graph[a]:
        graph[a].append(b)
    if a not in graph[b]:
        graph[b].append(a)
        
graph2 = deepcopy(graph)

for v in dfs(graph, v):
    print(v, end=' ')
print()
for v in bfs(graph2, v2):
    print(v, end=' ')




