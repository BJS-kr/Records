# 재귀적으로 left right의 값을 하나씩 비교하며 최소값 순서대로 붙이기
# 왜 필요한지는 이해가 잘 안감. 쨌든 구현

from random import sample as sam

def split_merge(list_):
    if len(list_) <= 1:
        return list_
    left = split_merge([val for val in list_[:len(list_)//2]])
    right = split_merge([val for val in list_[len(list_)//2:]])
    return merge(left, right)
    
def merge(left, right):
    sorted_list = list()
    while left and right:
        if min(left) > min(right):
            sorted_list.append(min(right))
            right.remove(min(right))
        else:
            sorted_list.append(min(left))
            left.remove(min(left))
    while left:
        sorted_list.append(min(left))
        left.remove(min(left))
    while right:
        sorted_list.append(min(right))
        right.remove(min(right))
    return sorted_list
        
    
split_merge(sam(range(100), 10))
