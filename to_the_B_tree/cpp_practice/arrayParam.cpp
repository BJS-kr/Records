#include <cstdio>
#define MAX_SIZE 10

void sub(int x, int arr[]) {
  x = 10;
  arr[0] = 20;
}

int main() {
  int var = 0;
  int list[MAX_SIZE];
  list[0] = 99;
  sub(var, list);
  // 결과를 살펴보면 var의 값은 바뀌지 않았고 list[0]의 값은 바뀌어 있습니다.
  // 그 이유는 list라는 이름 자체가 포인터역할을 하여, sub함수에 list의 메모리 주소를 전달했기 때문입니다.
  printf("var=%d\nlist[0]=%d", var, list[0]);
  return 0;
}