#https://www.acmicpc.net/problem/13904

# 풀이 1
# schedule에 과제수만큼 n을 집어넣고, 과제를 특정 날짜 n에 배정할때마다 n을 삭제
# 과제의 기한과 같거나 작은 n이 schedule에 없으면 배정실패 continue
# 배정이 성공할 때 마다 max_score += 과제의 점수 

n = int(input())
d = sorted([list(map(int,input().split())) for _ in range(n)],key=lambda x : (-x[1],x[0]))
schedule = [i for i in range(1,n+1)]
max_score = 0

for i in range(n):
    if d[i][0] in schedule: # 점수 내림차순이니 기한과 같은 날짜가 있다면 배정
        schedule.remove(d[i][0])
        max_score += d[i][1]
    else:
        lesser = [v for v in schedule if v < d[i][0]]
        if lesser == []: # 배정실패 -> 다음 과제로
            continue
        else:
            schedule.remove(max(lesser)) # 최대한 미룬 날짜
            max_score += d[i][1]

print(max_score)

# 풀이 2. heapq 적용
# input.txt를 폴더에 저장해놓고 변수입력해서 open이 있습니다.
import sys
from heapq import heapify,heappop

sys.stdin = open('input.txt')
n = int(sys.stdin.readline())
k = [list(map(int, v.rstrip('\n').split())) for v in sys.stdin.readlines()]
schedule = [0] * n
tasks = list()
for i in range(n):
    tasks.append([-k[i][1],k[i][0],k[i][1]])

heapify(tasks)

while tasks:
    temp = heappop(tasks)
    for i in range(temp[1],0,-1):
        if schedule[i] == 0:
            schedule[i] = temp[2]
            break

print(sum(schedule))
