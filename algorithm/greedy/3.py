# https://www.acmicpc.net/problem/16435
# idea : height와 altitude가 같거나 작을때마다 height에 1 추가. 더 이상 커질 수 없으면 정지.
Count_Height = list(map(int,input().split()))
Altitudes = sorted(list(map(int,input().split())))

for Altitude in Altitudes:
    if Altitude <= Count_Height[1]:
        Count_Height[1] += 1
        
print(Count_Height[1])

# 승준's 피드백: 변수 이름 대문자 X
