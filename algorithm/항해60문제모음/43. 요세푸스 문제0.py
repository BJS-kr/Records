# 분명히 쉬운데 애먹은 문제
# 그 이유는 내가 반복문이 돌아가는 과정을 잘 못 이해하고 있던 것에 있다.
# 예를 들어, a = [1,2,3,4]가 있을 때 for v in a반복문을 작성하고, v==2라면 v를 제거한다고 가정해보자.
# 내 생각엔 2를 제거한 후 다음 v는 3이 될 것 같은데, 디버거를 돌려보니 3울 건너뛰고 4가 들어오고 있었다!
# 이를 통해 한 가지를 유추할 수 있다. 내가 인덱스로 a내부의 값을 찾고 있지 않고 바로 값을 찾았음에도 불구하고 컴퓨터는 인덱스를 기준으로 나에게 값을 가져다 준것이다.
# 2의 index는 1. 다음 index는 2. a에서 2가 제거되엇으니 a[2]는 4. 즉 컴퓨터는 내 생각대로 2다음인 3을 가져다 준 것이 아니라, 다음 인덱스에 해당하는 4를 가져다 준것이다.
# 이를 몰라서 분명히 맞는 코드인데 왜 안되는지 답답해 하다가, 원리를 이해하고 해결했다. 바로 값을 찾더라도 list[i]와 같다는 것 기억해두자.

# 답 1
from collections import deque

n,m = map(int,input().split())
a = deque(i for i in range(1,n+1))
j = deque()
c = 0

while a:
    if c == m - 1:
        j.append(a.popleft())
        c = 0
        continue
    a.append(a.popleft())
    c += 1
print('<'+', '.join(list(map(str, j)))+'>')

# 답2. rotate 사용.
from collections import deque

n,m = map(int,input().split())
a = deque(i for i in range(1,n+1))
j = deque()

while a:
    a.rotate(-m+1)
    j.append(a.popleft())

print('<'+', '.join(list(map(str, j)))+'>')

# 답 3. 맨 위에 설명한 것처럼 index가 꼬이지 않게 하기 위해 제거를 False로 표현. 속도는 제일 느렸다.
from collections import deque
n,m = map(int,input().split())
a = deque(i for i in range(1,n+1))
j = deque()
c = 0

while any(a):
    for i in range(len(a)):
        if a[i]:
            if c == m - 1:
                c = 0
                j.append(a[i])
                a[i] = False
                continue
            c += 1 
print('<'+', '.join(list(map(str, j)))+'>')
