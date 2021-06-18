# https://leedakyeong.tistory.com/entry/%EB%B0%B1%EC%A4%80-1002%EB%B2%88-%ED%84%B0%EB%A0%9B-in-python-%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EC%BD%94%EB%93%9C-%EB%B0%8F-%EC%84%A4%EB%AA%85

n = int(input())

for i in range(n):
    x1, y1, r1, x2, y2, r2 = map(int,input().split())
    # 피타고라스의 정리를 통해 두 원의 중심점의 거리를 계산한다.
    r = ((x1-x2)**2 + (y1-y2)**2)**0.5
    R = [r1,r2,r]
    m = max(R); R.remove(m)
    # r==0 -> 두 원이 일치하고 있음. 즉 추론 가능한 위치는 무한대 -> -1
    # m == sum(R) -> 두 원이 외접 혹은 내접해있음. 외접해 있다면 r == r1+r2가 되고 내접해있다면 r1이나 r2중의 하나가 나머지 두값이 합이 되니까->1
    # m > sum(R) -> 두 원이 서로 만나고 있지 않음. 즉 위치 추론 불가능->0
    # 위의 모든 경우에 포함되지 않는 경우는? 바로 외접도 내접도 아닌 상태로 걸쳐져 있는것 즉 원이 두 지점에서 만나게 됨(교집합 모양) -> 2 
    print(-1 if r==0 else \
        1 if m == sum(R) else \
            0 if m > sum(R) else 2)
