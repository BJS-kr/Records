# https://www.acmicpc.net/problem/13413

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
