# 삽입 정렬
# 그냥 sort와 똑같지만 구현을 해보자

# 값이 두개일땐? return [a if a [1] < a[0] : [1], a[0] = a[0], a[1]]
def insert_sort1(*args):
    a = list(args)
    if a[1] < a[0]:
        a[1], a[0] = a[0], a[1]
    return a

# 값이 무한정일땐?
def insert_sort2(*args):
    a = list(args)
    for j in range(1,len(a)):
        for i in range(len(a)):
            if a[j] < a[i]:
                a[j], a[i] = a[i], a[j]
    return a

insert_sort2(9,7,6,8,1,4,5,3,2)
