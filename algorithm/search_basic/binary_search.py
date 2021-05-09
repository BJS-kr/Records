# 분할 정복 알고리즘 (Divide and Conquer)
# Divide: 문제를 하나 또는 둘 이상으로 나눈다.
# Conquer: 나눠진 문제가 충분히 작고, 해결이 가능하다면 해결하고, 그렇지 않다면 다시 나눈다.

# 이진 탐색
# Divide: 리스트를 두 개의 서브 리스트로 나눈다.
# Conquer
# 검색할 숫자 (search) > 중간값 이면, 뒷 부분의 서브 리스트에서 검색할 숫자를 찾는다.
# 검색할 숫자 (search) < 중간값 이면, 앞 부분의 서브 리스트에서 검색할 숫자를 찾는다.

# 이진 탐색의 조건은 찾고자 하는 범위가 정렬되어있다는 것임. 정렬되어있지 않다면 이진탐색은 의미가 없음.

from random import randint as ri

ran_ints = sorted([ri(1,10) for _ in range(10)])
target = ri(1,10)

def binary_search(ran_ints, target):
    mid = len(ran_ints)//2
    if len(ran_ints) == 0:
        return False
    if len(ran_ints) == 1 and ran_ints[0] != target:
        return False

    if target == ran_ints[mid]:
        return True
    elif target > ran_ints[mid]:
        return binary_search(ran_ints[mid:], target) # return 안넣고 논리 틀린거 없다고 고민하다가 두 시간 뻘짓함..
    else:
        return binary_search(ran_ints[:mid], target)
    
                        
print(binary_search(ran_ints, target))
print(target)
print(ran_ints) 
