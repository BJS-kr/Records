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
