# https://www.acmicpc.net/problem/11399
customers = int(input())
waiting_times = sorted(list(map(int, input().split())))
total_waiting_times = 0

for i in range(len(waiting_times)):
    total_waiting_times += sum(waiting_times[:i+1])

print(total_waiting_times)

# 승준's 피드백: 중간에 계속 sum을 하기 보다, 값을 기억해놓고 한개씩 더하는게 조금더 좋을듯??
customers = int(input())
waiting_times = sorted(list(map(int, input().split())))
total_waiting_times = 0
res, memo = 0, 0
for i in waiting_times:
    memo += i
    res += memo
print(res)
