# https://www.acmicpc.net/problem/13417
# 변수 = 변수.sort()를 해버리면 list가 아니라 Nonetype이 되버리네??????
# 그냥 변수.sort()이렇게만 처리해야 하는듯
# 그래서 다 변수 = sorted(변수)로 해버림.
case_total = int(input())
i = 0

while i < case_total:
    cardcount = int(input())
    card_list = input().split()
    sorted_card_list = list()
    for card in card_list:
        if not sorted_card_list:
            sorted_card_list.append(card)
        elif card <= sorted_card_list[0]:
            sorted_card_list.insert(0,card)
        else:
            sorted_card_list.append(card)
    print(''.join(sorted_card_list))
    i += 1
    
# 승준's 피드백: 이 문제에선 큰 의미 없지만 python deque 사용법 알아두자
