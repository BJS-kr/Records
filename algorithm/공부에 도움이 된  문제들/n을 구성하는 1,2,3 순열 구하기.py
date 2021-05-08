# 정석풀이가 아닌걸 알지만 공부하고 싶어서 어렵게 풀어봄.
# combinate(n)에서 1,2,3의 갯수를 각각 표시 할 수 있게 만들었으니, 각 조합마다 필요한 숫자들을 리스트화시켜
# 순열을 구해 모두 더하는 방식. 다만 permutations의 기능이 id값을 기준으로 순열을 만드는거라 작업이 필요했음.
# [1,3,3]의 순열이면 3의 위치끼리만 바뀌어도 각각의 순열로 처리하기 때문에 if not in을 통해 한번 더 걸러줌.

from itertools import permutations

combis = list()

def permutate(combis):
    result = list()
    for i in range(len(combis)):
        target = combis[i]
        listed_target = list()
        for j in range(3):
            for _ in range(target[j]):
                if j == 0:
                    listed_target.append(1)
                elif j == 1:
                    listed_target.append(2)
                else:
                    listed_target.append(3)
        bef_clnd = list(permutations(listed_target,len(listed_target)))
        for l in range(len(bef_clnd)):
            if bef_clnd[l] not in result:
                result.append(bef_clnd[l])
    return len(result)

def combinate(n):
    global combis
    a = n
    b = n // 2
    c = n // 3
    for i in range(a+1):
        for j in range(b+1):
            for k in range(c+1):
                if i + j*2 + k*3 == n:
                    combis.append([i,j,k])
    return permutate(combis)
     
combinate(4)

# 정석풀이는 요거
def func(data):
    if data == 1:
        return 1
    elif data == 2:
        return 2
    elif data == 3:
        return 4
    
    return func(data -1) + func(data - 2) + func(data - 3)
