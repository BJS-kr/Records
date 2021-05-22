# https://www.acmicpc.net/problem/2606

from collections import deque

def bfs(graph, start=1):
    v, nv = list(), deque()
    nv.append(start)
    while nv:
        node = nv.popleft()
        if node not in v:
            v.append(node)
            nv.extend(graph[node])
    return print(len(v) - 1)
    

n = int(input())
m = int(input())

graph = [[]for i in range(n+1)]
for i in range(m):
    a,b = map(int,input().split())
    if b not in graph[a]:
        graph[a].append(b)
    if a not in graph[b]:
        graph[b].append(a)
        

bfs(graph)
