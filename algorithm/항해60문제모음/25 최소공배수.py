# 소인수 분해 과정 자체를 구현한 풀이
t = int(input())
for _ in range(t):
    nums = sorted(list(map(int,input().split())))
    a,b = nums[0], nums[1]
    mat = list()
    c = 1
    while 1:
        if a == 1:
            break
        d = list()
        for v in range(2, a+1):
            if a%v == 0 and b%v == 0:
                d.append(v)
                a,b = a//v, b//v
        
        if not d:
            break
        else:
            mat += d
    
    if mat:
        for v in mat:
            c *= v

    print(c*a*b)

    
# 유클리드 호제법 활용
import sys

t = int(input())
def gcd(a,b):
    while b != 0:
        r=a%b
        a=b
        b=r
    return a
def lcm(a,b):
    G = gcd(a,b)
    return a*b//G
for _ in range(t):
    a,b = map(int, sys.stdin.readline().split())
    print(lcm(a,b))
