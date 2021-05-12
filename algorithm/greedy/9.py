# https://www.acmicpc.net/problem/5585
target = 1000 - int(input())
coins = [500, 100, 50, 10, 5, 1]
result = 0

for coin in coins:
    if coin <= target:
        n = target//coin
        result += n
        target -= n*coin
        if target == 0:
            break
            
print(result)
