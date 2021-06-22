# 이분탐색을 좀 더 깊게 생각하게 해준 문제

# 풀이 1
def a():
    n,m = map(int,input().split())
    trees = list(map(int,input().split()))
    start, end = (sum(trees)-m)//n, max(trees)

    while start <= end:
        get = 0
        mid = (start+end)//2
        for v in trees:
            if v >= mid:
                get += v - mid
        
        if get >= m:
            start = mid + 1
        else:
            end = mid - 1
    return print(end)

a()

# 풀이 2. 속도 랭킹을 보고 가장 빠른 코드를 모방하여 작성
import sys
from collections import Counter

input = sys.stdin.readline

n,m = map(int,input().split())
trees = Counter(map(int,input().split()))
sum_trees = sum([h*c for h, c in trees.items()])
start, end = (sum_trees-m)//n, max(trees)

while start <= end:
    mid = (start+end)//2
    get = 0
    for h,c in trees.items():
        if h >= mid:
            get += (h-mid)*c
    if get >= m:
        start = mid + 1
    else:
        end = mid - 1

print(end)
