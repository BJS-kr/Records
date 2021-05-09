# 순차적, 직선적 값 찾기

from random import randint as ri

ran_ints = [ri(1,100) for _ in range(10)]
target = ri(1,100)

def seq_srch(ran_ints, target):
    for i in range(len(ran_ints)):
        if ran_ints[i] == target:
            return i
    return False

seq_srch(ran_ints, target)
