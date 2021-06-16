# 파이썬에서의 do-while
# 파이썬에는 do,while이 없음. 이걸 구현해보자

# 방법 1
while True: 
    task() 
    if not condition: break


# 방법 2
while True: 
    task() 
    if condition: continue # 컨티뉴하면 다음 루프로 넘어가기 때문에 break가 실행 안되니까. condition이 False가 되면 break가 실행 될것.
        break

# 방법 1과 방법 2는 완전히 같은 결과가 나오지만 걍 직관성 차이.
