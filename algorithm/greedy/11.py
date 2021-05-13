# https://www.acmicpc.net/problem/2217
n = int(input())
weights = sorted([int(input()) for _ in range(n)])
max_weights = list()
c = 0

for weight in weights:
    max_weights.append(weight*(n-c))
    c += 1

print(max(max_weights))
