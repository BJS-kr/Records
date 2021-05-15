# https://www.acmicpc.net/problem/1715
# 시간초과를 해결하지 못하고 몇 시간을 보내다가 heap을 사용해 풀었다는 말에 힌트를 얻음
# int()는 '\n'도 처리하므로 sys.stdin.readline()에 rstrip()을 실행할 필요가 없다.

import sys
import heapq

n = int(sys.stdin.readline())
k = sorted([int(sys.stdin.readline()) for _ in range(n)])
result = 0

heapq.heapify(k)

if n == 1:
    print(0)
else:
    while len(k) >= 2:
        temp1 = heapq.heappop(k)
        temp2 = heapq.heappop(k)
        result += temp1 + temp2
        heapq.heappush(k, temp1 + temp2)
    print(result)
