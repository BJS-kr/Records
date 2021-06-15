# 정답이 나온 방법 네가지를 모두 적겠다

# 1. 재귀함수 사용. 출제자는 이걸 바라고 낸 게 아닐까? 물론 성능은 최악이다
n,k = map(int,input().split())

def factorial(n):
    return n*factorial(n-1) if n > 1 else 1 # 삼항연산

print(factorial(n)//(factorial(n-k)*factorial(k)))

# 2. 재귀함수면 memoization이 마렵다. 역시나 성능이 대폭 향상된다. 재귀함수가 메모리에 부담을 줄 정도로 큰 숫자여야 성능이 나온다.
from functools import lru_cache

n,k = map(int,input().split())

@lru_cache
def factorial(n):
    return n*factorial(n-1) if n > 1 else 1

print(factorial(n)//(factorial(n-k)*factorial(k)))

# combinations를 사용해보았다
from itertools import combinations
n, k = map(int,input().split())

a = [None for i in range(n)]
b = list(combinations(a,k))

print(len(b))

# 마지막으로 가장 직관적인 math사용
from math import factorial
n,k = map(int,input().split())

print(factorial(n)//(factorial(n-k)*factorial(k)))
