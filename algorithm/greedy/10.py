a = input().split('-')
result = 0

# a[0]은 무조건 양수
if '+' in a[0]:
    s = a[0].split('+')
    for i in s:
        g = int(i)
        result += g
else:
    result = int(a[0])

# 이 후의 모든 값은 무조건 -이므로 처리
for i in range(1,len(a)):
    if '+' in a[i]:
        b = a[i].split('+')
        for j in b:
            c = int(j)
            result -= c
    else:
        result -= int(a[i])

print(result)
