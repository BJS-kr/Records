# https://www.acmicpc.net/problem/1715
# 시간초과를 해결하지 못하고 몇 시간을 보내다가 heap을 사용해 풀었다는 말에 힌트를 얻음

import sys
import heapq

n = int(input())
l = sorted([int(sys.stdin.readline()) for _ in range(n)])
result = 0

heapq.heapify(l)

if n == 1:
    print(0)
else:
    while len(l) >= 2:
        temp1 = heapq.heappop(l)
        temp2 = heapq.heappop(l)
        result += temp1 + temp2
        heapq.heappush(l, temp1 + temp2)
    print(result)
