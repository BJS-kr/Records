# _의 사용
# index값이 필요 없을때. print(_)라고 해도 숫자는 잘 나옴.
for _ in range(3):
    print('test')

# _는 또한 인터프리터의 마지막 값을 저장함. ex) _*3 = 30
10

# 값을 무시하고 건너뛸때 사용함.
a,_,b = 1,2,3
print(a,b) #1,3

a,*_,b = 1,2,3,4,5 
print(a,b) # 1,5

# __init__등 언더스코어(_)의 사용법 잘 정리된 곳. https://gomguard.tistory.com/125
