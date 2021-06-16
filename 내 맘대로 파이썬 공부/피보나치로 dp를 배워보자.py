# fibonacci를 통해 여러 프로그래밍 방식을 배워보자

# 1 : 재귀호출 방식. dynamic programming에선 적합하지 않다. 메모리 부담 심각
# f(50)만 호출해도 메모리 부담
def fib1(n):
    if n == 1:
        return 1
    elif n == 2:
        return 2
    return fib1(n-1) + fib1(n-2)


# 2 : 상향식. 일반적으로 연속된 계산은 상향식이 좋다. 메모리 부담도 가장 적다. 
# DP에서 memoization과 더불어 핵심적인 개념. 
# 상황에 따라 memoization과 상향식중에 선택하는 것.
def fib2(n):
    curr, next_ = 1, 1 # f(0)부터 시행한다면 range(n+1)해야한다. 굳이 계산 한번 더 하는게 의미없으므로 1,1이 적합.
    for _ in range(n):
        curr, next_ = next_, curr + next_
    return curr

# 3 : memoization 활용. 계산된 결과를 저장함으로서 같은 계산은 한 번만 시행함!
# 피보나치 노드 트리를 생각해보자. f(0), f(1), f(2) 등의 결과들은
# 뻗어나가는 가지마다 최하단에서 계산되어 올라올 것 이다.
# 그러나 memoization을 사용하면 같은 계산은 단 한번씩만 수행되므로 효율이 급격히 높아지는 것이다.
from functools import lru_cache
@lru_cache(maxsize=None)

def fib3(n):
    if n == 1:
        return 1
    elif n == 2:
        return 2
    return fib3(n-1) + fib3(n-2)

fib3(1000)
