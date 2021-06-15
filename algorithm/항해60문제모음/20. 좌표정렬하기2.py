# 바보같이 y좌표 우선인데 x좌표 우선으로 정렬했다가 여러번 틀렸다...
a = int(input())
b = list()
for _ in range(a):
    m,n = map(int,input().split())
    b.append((n,m))

b = sorted(b)
for i in range(a):
    print(b[i][1], b[i][0])
