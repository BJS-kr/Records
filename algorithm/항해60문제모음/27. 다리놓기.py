# 1. factorial과 이항계수 공식 사용
from math import factorial
a = int(input())
for _ in range(a):
    k, n = map(int,input().split())
    print(factorial(n)//(factorial(n-k)*factorial(k)))
    
# 2. dp방식 사용
import sys
t = int(sys.stdin.readline())

for _ in range(t):
    n,m = map(int, input().split())
    dp = [[0 for _ in range(m+1)] for _ in range(n+1)]
    for i in range(1, n+1):
        for j in range(1, m+1):
            # 왼쪽의 사이트가 하나라면 오른쪽의 사이트 갯수가 총 조합갯수
            if i == 1:
                dp[i][j] = j
                continue
            # 양쪽의 사이트 수가 같은 경우 조합의 갯수는 1
            if i == j:
                dp[i][j] = 1
            # 왼쪽 사이트 수 n, 오른쪽 사이트 수 m일때
            # (서쪽 n개, 동쪽 m-1개로 지을 수 있는 다리) + (서쪽 n-1개, 동쪽 m-1개로 지을 수 있는 다리)
            else:
                if j > i:
                    dp[i][j] = dp[i][j-1] + dp[i-1][j-1]

print(dp[n][m])

# 3. 이해 못해서 이해하고 싶어서 긁어온 풀이
# ????????????
T = int(input())

for _ in range(T):
    m, n = map(int, input().split())
    answer = 1
    k = n - m
    
    while n > k:
        answer *= n
        n -= 1
    while m > 1:
        answer = answer // m
        m -= 1
    
    print(answer)
