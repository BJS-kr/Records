# https://www.acmicpc.net/problem/10162
target = int(input())
btns = list([300, 60, 10])

if target%btns[2]!=0:
    print(-1)
else:
    A = target//btns[0]
    target -= A*btns[0]
    B = target//btns[1]
    target -= B*btns[1]
    C = target//btns[2]
    print(A, B, C)
