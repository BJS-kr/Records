# 예제 1 풀이
def factorial(n):
    if n <= 1:
        return n
    return n*factorial(n-1)

for n in range(10):
    print(factorial(n))
    
# 예제 2 풀이
import random 

list_ = random.sample(range(100), 10)

def list_sum(list_, i=0):
    a = 0
    if i == len(list_)-1:
        return a
    a += list_[i]+list_sum(list_,i+1)
    return a

list_sum(list_)

# 예제 2 개선
import random 

list_ = random.sample(range(100), 10)

def list_sum2(list_):
    if len(list_) <= 1:
        return list_[0]
    return list_[0]+list_sum2(list_[1:]) # [1:]로 슬라이싱 된 리스트가 들어가니 다음 [1:]은 순차적으로 넘어가게 되는 것. 
    
list_sum2(list_) 

# 예제 3 재귀 없이
def palindrome(word):
    a = word[::-1]
    if word == a:
        return True
    else:
        return False

palindrome('mom')

# 재귀적으로 바꿔보자
def palin_recur(word):
    if len(word) <= 1:
        return True
    elif word[0] == word[-1]:
        palin_recur(word[1:-1])
        return True
    else:
        return False

palin_recur('motom')

# 예제 4 풀이
def sick_cal(n):
    print(int(n))
    if n == 1:
        return
    elif n % 2 != 0:
        n = n * 3 + 1
        sick_cal(n)
    else:
        n = n / 2
        sick_cal(n)

sick_cal(11)

# 예제 4 개선
def sick_cal(n):
    print(int(n))
    if n == 1:
        return
    elif n % 2 != 0:
        sick_cal(n * 3 + 1)
    else:
        sick_cal(n / 2)
        
# 예제 5 : 1,2,3만을 조합하여 n을 이루는 순열의 수를 구하라

# 예제 5 풀이 1: 틀림. 이건 1,2,3으로 가능한 모든 조합만을 표시함.
# 정확히 말하면 '조합'이 아니라 조합에 필요한 1,2,3의 갯수를 각각 [[index0~2],...]로 표시하는 리스트를 만듦.
# 거기다 재귀적으로 풀지도 않음
def combinate(n):
    combis = list()
    a = n
    b = n // 2
    c = n // 3
    for i in range(a+1):
        for j in range(b+1):
            for k in range(c+1):
                if i + j*2 + k*3 == n:
                    combis.append([i,j,k])
    return combis

combi(4)

# 예제 5 풀이 2: 구현 성공. 정석풀이가 아닌걸 알지만 공부하고 싶어서 어렵게 풀어봄. 풀이 1의 결과를 이용.
# 풀이 1에서 1,2,3의 갯수를 각각 표시 할 수 있게 만들었으니, 각 조합마다 필요한 숫자들을 리스트화시켜
# 순열을 모두 구해 세는 방식. 다만 permutations의 기능이 id값을 기준으로 순열을 만드는거라 작업이 필요했음.
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

# 예제 5 풀이 3 (combinations만 사용)
# 생각해보니 (1,3) == (3,1) 은 False이니 그냥 not in조건으로 다 넣으면 됨.
# 근데 내가 풀고도 이해 안되는 점은 왜 1,2,3이 꼭 n만큼 append되야 결과가 제대로 나오는지를 모르겠음..
# permutaions를 사용하면 1은 n만큼 append하더라도 2,3은 n//2, n//3만큼 append하면 순열이 나오지만..
# 아니 애초에 1,2,3을 여러개 조합하는건 permutations아니냐고...
from itertools import combinations

tools = list()
combilist = list()

def func(n):
    for _ in range(n):
        tools.append(1)
        tools.append(2)
        tools.append(3)
    for i in range(n//3,n): # 조합의 최소길이는 n//3부터니까. n+1이 아닌이유는 n+1자리조합은 무조건 1+1+1...이니까.
        a = list(combinations(tools,i))
        for j in range(len(a)):
            if sum(a[j][:]) == n and a[j][:] not in combilist:
                combilist.append(a[j][:])
    return len(combilist) + 1 # 하나는 무조건 n과 길이가 같은 1,1,1,1,...이니까

func(5)

# 예제 5 풀이 4 ( permutations만 사용)
# 논리 자체는 딱 맞아떨어지지만 메모리 졸라 부족함
# 대체 위에 combinations는 왜 되는거지??
from itertools import permutations

tools = []
combilist = list()

def func(n):
    for _ in range(n):
        tools.append(1)
    for _ in range(n//2):
        tools.append(2)
    for _ in range(n//3):
        tools.append(3)
    for i in range(n//3,n):
        a = list(permutations(tools,i))
        for j in range(len(a)):
            if sum(a[j][:]) == n and a[j][:] not in combilist:
                combilist.append(a[j][:])
    return len(combilist) + 1

func(4)

# 예제 5 정석 풀이
# f(n) = f(n-1) + f(n-2) + f(n-3)과 같다는 것을 이용. 사실 그냥 순열 공식이다.
# 아무리 값이 커지더라도 연속된 값 세개만 알면 순열을 구할 수 있음. 그래서 n이 1,2,3일경우를 미리 return으로 정해두고
# 재귀호출하게 되면 1,2,3에 해당하는 값을 찾을 때까지 재귀해서 연속된 모든 값을 알게 되는 것.
# 이렇게 쪼개지지 않을때까지 바닥찍고 값 찾아서 다시 순차적으로 계산하면서 돌아오는걸 분할 정복(divide and conquer)이라고
def f(n):
    if n == 1:
        return 1
    elif n == 2:
        return 2
    elif n == 3:
        return 4
    return f(n-1) + f(n-2) + f(n-3)

f(10)
 
