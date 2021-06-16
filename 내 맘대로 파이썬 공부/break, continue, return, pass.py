# pass, continue, return, break

# pass : pass 부분만 넘어가자를 뜻함. 반복문에는 아무런 영향이 없음. if에 넣을 조건이 없거나 class선언할때 초기값 사용.
# 동작 확인을 위해서 특정부분을 pass하는 용도 정도.
for i in range(10):
    if i % 2 == 0:
        pass
        print(i)    
    else:
        print(i)
print("Done")

#continue : 아래 for는 i[0~9]까지 실행됨. continue는 반복 실행 한번을 넘어감을 뜻함.
# 즉, i%2==0을 실행하는 for 파트는 다 넘기고 1,3,5,7,9만 출력됨.
for i in range(10):
    if i % 2 == 0:
        continue
        print(i)    
    print(i)
print("Done")

# return : 함수 값 리턴. 함수 종료

# break : 루프 자체를 종료. 아래에선 Done만 출력 됨.
for i in range(10):
    if i % 2 == 0:
        break
        print(i)    
    else:
        print(i)
print("Done")
