# https://www.acmicpc.net/problem/2437

n = int(input())
a = sorted(list(map(int,input().split())))
accu = 1

for v in a:
    if accu < v:
        break
    accu += v

print(accu)
