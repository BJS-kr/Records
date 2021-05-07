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
        
# 예제 5 : 1,2,3을 조합하여 n을 이루는 모든 경우의 수를 구하라

# 풀이 1: 틀림. 이건 1,2,3으로 가능한 모든 조합을 표시해주긴 하나, 
# 조합 순서의 개념까진 가지고 있지 않음. 1+1+2와 1+2+1을 같은 것으로 처리함.
# 거기다 재귀적으로 풀지도 않음
def combi(n):
    combicount = list()
    a = n
    b = n // 2
    c = n // 3
    for i in range(a+1):
        for j in range(b+1):
            for k in range(c+1):
                if i + j*2 + k*3 == n:
                    combicount.append([i,j,k])
    return combicount

combi(6)


 
