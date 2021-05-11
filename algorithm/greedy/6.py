# https://www.acmicpc.net/problem/20115
# 너무 기초문제

total = int(input())
drinks = list(map(int,input().split()))
result = max(drinks) + sum(sorted(drinks)[:-1])/2

print(result)
