# pivot값을 기준으로 두개의 리스트로 분리
# 길이가 1이 될때까지 재귀적으로 반복 후 left+[pivot]+right

import random

def qsort(list_):
    if len(list_) <= 1:
        return list_
    pivot = list_[0]
    left = qsort([val for val in list_[1:] if val < pivot]) # pivot값은 제외해야되니까 [1:]
    right = qsort([val for val in list_[1:] if val >= pivot]) # pivot과 동일한 값 여러개면 누락되니까 >=
    return left + [pivot] + right # list와 int는 연산 불가능하니까 [pivot]

qsort(random.sample(range(100), 10))
