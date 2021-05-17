# https://www.acmicpc.net/problem/9009
# 함수를 구현하고 함수 인자를 증가시켜가면서 return을 증가시켜 검증하는 방식을 처음에 썼는데,
# 함수가 재실행되지 않고 첫 return고정되어 무한루프에 빠져서 한참 헤맸다...
# 결국 함수를 쓰는건 포기하고 그냥 피보나치 찾는 로직을 중간에 넣어서 구현했음

t = int(input())
nums = [int(input()) for _ in range(t)]

for num in nums:
    fibs = []
    while num > 0:
        c, n = 1, 1
        for i in range(num):
            c, n = n, c + n
            if c > num:
                fibs.append((n - c))
                num -= (n - c)
                break
            elif c == num:
                fibs.append(c)
                num -= c
                break
    fibs.sort()
    for i in range(len(fibs)):
         fibs[i] = str(fibs[i])
    print(' '.join(fibs))
    
# 함수를 썼던 방법. 함수를 쓴 while문이 무한루프에 빠져서 계산 불가
t = int(input())
nums = [int(input()) for _ in range(t)]
 
def fib(n):
    c, n = 1, 1
    for _ in range(n):
        c, n = n, c + n
    return c

for num in nums:
    test_num = 1
    fibs = list()
    while num > 0:
        while num >= fib(test_num): # 함수가 첫 return 값인 1에 고정되어 실패. test_num을 증가시켜도 재실행되지 않았다.
            test_num += 1
        num -= fib(test_num - 1)
        fibs.append(fib(text_num - 1))
    print(fibs)
