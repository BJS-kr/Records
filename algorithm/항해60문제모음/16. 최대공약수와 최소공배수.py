# 최소공배수 및 최대공약수 구하는 공식을 그대로 구현

# for문을 두 수 중 작은 수 범위로 돌려야해서 sorted함
nums = sorted(list(map(int,input().split())))
a,b = nums[0], nums[1]
mat = list()
c = 1

# for 문 돌고 나서도 나눠지는 수가 없을 때까지 나눠야해서 while안으로 넣음
while 1:
    d = list()
    for v in range(2, a+1):
        if a%v == 0 and b%v == 0:
            d.append(v)
            a,b = a//v, b//v
    # d == []이라는 것은 더 이상 나눠지는 수가 없다는 것
    if d == []:
        break
    else:
      mat += d

for v in mat:
    c *= v

print(c)
print(c*a*b)
