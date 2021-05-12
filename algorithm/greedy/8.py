https://www.acmicpc.net/problem/11047

import sys

n,k = map(int,input().split())
values = sorted([int(sys.stdin.readline()) for _ in range(n)],reverse=True)
result = 0

for value in values:
    if value <= k:
        n = k//value
        result += n
        k -= n*value
        if k == 0:
            break
            
print(result)
