# https://www.acmicpc.net/problem/19539
# 2의 갯수를 세는 방식입니다
n = int(input())
a = list(map(int, input().split()))
c = sum(a)
c2 = c//3

if c % 3 != 0:
    print('NO')
else:
    for i in range(n):
            if a[i] >= 2 and c2 > 0 :
                c2 -= a[i] // 2
                a[i] %= 2  
    # c2의 값은 0 혹은 -입니다. -일경우를 대비해 절대값으로 만들고 2곱해줍니다
		if abs(c2*2) + sum(a) == c//3:
        print('YES')
    else:
        print('NO')
        
# 스터디원의 풀이가 훨씬 좋았다 ㅠ 직접 구현해보고 업로드해보자
n = int(input())
heights = list(map(int, input().split()))

if sum(heights) % 3 != 0:
    print('NO')
else:
    date = 0

    for height in heights:
        date += height // 2

    if date >= sum(heights) // 3:
        print('YES')
    else:
        print('NO')
