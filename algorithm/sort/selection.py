# 선택정렬 
# 전체 중 가장 작은 값 찾아서 맨 앞 인덱스로 배치, 배치한 인덱스는 제외하고 나머지 전체에서 계속 반복

# 값이 두개일땐?
def sel_sort(*args):
    a = list(args)
    if a[0] < a[1]:
        pass
    else:
        a[0], a[1] = a[1], a[0]
    return a

# 값이 여러개 일땐?
def sel_sort2(*args):
    a = list(args)
    for i in range(len(a)):
        if i == len(a) - 1:
            break
        for j in range(i + 1, len(a)):
            if a[j] < a[i]: 
                a[j], a[i] = a[i], a[j]
    return a

sel_sort2(9,2,1,5,7,4,8,3,6)
