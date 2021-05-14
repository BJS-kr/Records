# https://www.acmicpc.net/problem/16120
# PEN PINEAPPLE APPLE PEN

n = input()
p = ['P','P','A','P']
stack = list()

for i in range(len(n)):
    stack.append(n[i])
    if stack[-4:] == p:
        stack[-4:] = ['P']

if stack == ['P']:
    print('PPAP')
else:
    print('NP')

