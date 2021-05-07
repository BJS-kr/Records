# 버블정렬

# 두개를 버블정렬해보자
def bubble1(*args):
    a = list(args)
    if a[0] > a[1]:
        a[0],a[1] = a[1],a[0]
    return a

# 무한히 많아도 버블정렬 해보자
def bubble2_1(*args):
    a = list(args)
    for i in range(len(a)):
        try:
            if a[i] > a[i+1]:
                a[i],a[i+1] = a[i+1],a[i]
        except:
            return a

# try가 위험하다고 생각되면
def bubble2_2(*args):
    a = list(args)
    for i in range(len(a)):
        if i == len(a)-1:
            break
        elif a[i] > a[i+1]:
                a[i],a[i+1] = a[i+1],a[i]
    return a

bubble2_1(1,5,7,1,2,5,5,8,9,2,4,6)
