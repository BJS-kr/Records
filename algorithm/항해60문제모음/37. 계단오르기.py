# 처음 맛 본 dp의 매운 맛.

# s와 dp리스트를 초기화할때 n만큼만 생성하면 중간중간 if문을 넣어 코드 진행에 신호등을 세워줘야한다. 인덱스 에러가 나기때문
n = int(input())
s = [int(input()) for _ in range(n)]
dp = [0 for _ in range(n)]

dp[0] = s[0]
if n >= 2:
    dp[1] = s[0] + s[1]
if n >= 3:
    dp[2] = max(s[0] + s[2], s[1] + s[2])
    if n >= 4:
        for i in range(3, n):
            dp[i] = max(s[i] + s[i-1] + dp[i-3], s[i] + dp[i-2])

print(dp[n-1])


# 그렇다면 그냥 모든 값을 0으로 초기화 시킨 상태에서 출발하면 어떨까. 문제에서 제한한 길이인 300이하의 자연수이다.

n = int(input())
s = [0 for i in range(301)]
dp = [0 for i in range(301)]

# 여기서 테스트 케이스 숫자만큼 0이 케이스의 값으로 변하게 된다.
for i in range(n):
    s[i] = int(input())

# 어차피 케이스만큼만 0이 아니고 나머지 리스트 내의 값들은 모두 0이므로 계산결과에 영향이 없다. 인덱스 에러를 걱정할 필요가 없게되어 코드가 짧아 진다.
dp[0] = s[0]
dp[1] = s[0] + s[1]
dp[2] = max(s[1] + s[2], s[0] + s[2])

for i in range(3, n):
    dp[i] = max(dp[i - 3] + s[i - 1] + s[i], dp[i - 2] + s[i])
print(dp[n - 1])
