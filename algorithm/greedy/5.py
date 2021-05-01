# https://www.acmicpc.net/problem/1439
# 이거 생각을 잘못해서 힘들었다

S = input()

count0 = 0
count1 = 0

S0 = S.split('1')
S1 = S.split('0')

for i in S0:
    if i.startswith('0'):
        count0 += 1

for j in S1:
    if j.startswith('1'):
        count1 += 1
        
if count0 >= count1:
    print(count1)
else:
    print(count0)
    
# 승준's 피드백: i는 어차피 0으로시작하거나, 없거나니깐 나라면 저렇게했을듯?

S = input()
count0 = 0
count1 = 0
S0 = S.split('1')
S1 = S.split('0')
for i in S0:
    if i:
        count0 += 1
for j in S1:
    if j:
        count1 += 1
if count0 >= count1:
    print(count1)
else:
    print(count0)
