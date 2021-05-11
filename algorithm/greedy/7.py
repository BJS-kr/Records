# https://www.acmicpc.net/problem/13305
# 현재 위치의 가격보다 싼 가격까지 도달하는 거리까지 만큼 기름을 넣는다. 도달한 후 반복한다.

city_total = int(input())
road_length = list(map(int,input().split()))
oil_price = list(map(int,input().split()))

def price_cal(oil_price, road_length):
    current = 0
    total_price = 0
    while True:
        for i in range(current, len(oil_price)):
            for j in range(i+1, len(oil_price)):
                if j == len(oil_price) - 1:
                    total_price += sum(road_length[i:])*oil_price[i]
                    return total_price
                elif oil_price[i] <= oil_price[j]:
                    continue 
                elif oil_price[i] > oil_price[j]:
                    current = j
                    total_price += sum(road_length[i:j])*oil_price[i]
                    break             
            break

print(price_cal(oil_price, road_length))
