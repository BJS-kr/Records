#https://www.acmicpc.net/problem/1541
a = input().split('-')
b = [int(v) for v in ''.join(a[1:]).split('+')]
result = 0

# a[0]은 무조건 양수
if '+' in a[0]:
    s = a[0].split('+')
    for i in s:
        result += int(i)
else:
    result = int(a[0])
    
result -= sum(b)
print(result)

# 스터디원의 도움을 받아 개선
a = [list(map(int,v.split('+'))) for v in input().split('-')]
result = sum(a[0])

for i in range(len(a[1:])):
    result -= sum(a[1:][i])
    
print(result)
