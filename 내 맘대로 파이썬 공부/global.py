# global은 global 변수인 어떤 변수를 함수 내에서 사용한다는 뜻이다. 
# global 변수는 함수에서의 값 변동에 함수 밖에서도 영향을 받게 된다..
r = 0

def test(n):
    global r
    if r >= 3:
        print(r)
        return
    for i in range(n):
        r += 1

test(3)
print(r) 
