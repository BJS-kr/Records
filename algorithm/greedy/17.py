# https://www.acmicpc.net/problem/13413
# 1. 비교대상들의 W혹은 B의 갯수가 같을 경우 작업 횟수는 일치하지 않는 부분의 갯수의 1/2이다.
# 2. 비교군 중 하나라도 W,B의 갯수중 하나가 0일 경우, 모두 뒤집어야 하므로 일치하지 않는 부분의 갯수가 답이다.
# 3. 1,2에 해당하지 않을 경우, 뒤집어야 하는 횟수는 W혹은 B의 갯수가 다른 만큼이고 
#    위치를 바꿔야하는 횟수는 뒤집은 부분을 제외한 나머지에서 일치하지 않는 부분의 갯수의 1/2이다.

# 다시 생각해보니 예전에 푼 것보다 엄청 간단히 표현할 수 있었다.

n = int(input())
cases = [[input() for _ in range(3)] for _ in range(n)]

for case in cases:
    
	exchange = 0
    flip = abs(case[1].count('W') - case[2].count('W'))
    
    for i in range(int(case[0])):
        if case[1][i] != case[2][i]:
            exchange += 1
    
	print((exchange-flip)//2 +flip)
    

# 예전에 푼 답
n = int(input())
l = [[input() for _ in range(3)] for _ in range(n)]

for v in l:
    
    t = 0
    W1 = v[1].count('W')
    B1 = v[1].count('B')
    W2 = v[2].count('W')
    B2 = v[2].count('B')
    
    if W1 == W2 :
        for i in range(int(v[0])):
            if v[1][i] != v[2][i]:
                t += 1
        print(t//2)
        
    
    elif W1 == 0 or B1 == 0 or W2 == 0 or B2 == 0:
        for i in range(int(v[0])):
            if v[1][i] != v[2][i]:
                t += 1
        print(t)
        

    else:
        c = abs(W1 - W2)
        for i in range(int(v[0])):
            if v[1][i] != v[2][i]:
                t += 1
        print((t-c)//2 +c)
