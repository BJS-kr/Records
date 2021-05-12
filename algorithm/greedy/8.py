# https://www.acmicpc.net/problem/11047

# sys쓰면 실행시간 줄어든다해서 사용했는데 왜 더 길게 나옴?(76ms)
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

# sys 안 쓴거(72ms)
n,k = map(int,input().split())
values = sorted([int(input()) for _ in range(n)],reverse=True)
result = 0

for value in values:
    if value <= k:
        n = k//value
        result += n
        k -= n*value
        if k == 0:
            break

print(result)
