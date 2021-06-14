# 에라토스테네스의 체를 활용하지 않으면 무조건 시간초과가 나게 되어있는 문제

# 완전 탐색 풀이. 시간초과
# 입력받는 부분
while True:
    q = int(input())
    if q == 0:
        break
    # 처음부터 1과 자기 자신은 제외시킨 상태로 약수가 하나라도 발견되면 즉시 break
    # break가 실행되지 않을시 a의 갯수를 증가시켜 소수의 갯수 검증
    a = 0
    for i in range(q+1, q*2+1):
        for j in range(2, i):
            if i % j == 0:
                break
        else:
            a += 1
    print(a)
    
    
# 에라토스테네스의 체 활용
# 입력
while True:
    q = int(input())
    if q == 0:
        break
    # True 배열을 만든 후 에라토스테네스의 체 구현은 False로 
    t = q*2+1
    nums = [True] * t
    # 2부터 t제곱근까지에 해당하는 숫자들의 배수들만 삭제하면 소수 제외하고 모두 삭제 가능
    a = int(t ** 0.5)
    for i in range(2, a + 1):
        if nums[i] == True:
          # i부터 목표값의 제곱근까지에 해당하는 i의 배수들 삭제
            for j in range(i+i, t, i):
                nums[j] = False
    
    # 베르트랑 공준 검증이므로 for의 범위는 입력받은 숫자 초과부터 즉, q + 1부터 t까지
    res = [i for i in range(q + 1, t) if nums[i] == True]
    print(len(res))
    
