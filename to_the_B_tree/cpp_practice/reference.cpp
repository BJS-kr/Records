#include <iostream>
using namespace std;

void nothingChanges(int x, int y) {
  x -= 1;
  y -= 2;
}

void pointerChange(int* x, int* y) {
  *x -= 1;
  *y -= 2;
}

void referChange(int& x, int& y) {
  x -= 1;
  y -= 2;
}

int main() {
  int x = 10, y = 20;
  int* xP = &x;
  int* yP = &y;

  
  cout << x << ' ' << y << endl;
  nothingChanges(x, y);
  // 값이 변하지 않았다. x, y의 메모리 주소에 직접 접근한 것이 아니기 때문이다.
  
  cout << x << ' ' << y << endl;
  pointerChange(xP, yP);

  // 값이변했다. 포인터로 접근했기 때문이다.
  cout << x << ' ' << y << endl;
  referChange(x, y);
  // 값이변했다. call-by-reference되었기 때문이다.
  // 포인터보다 표현이 간결해진다.
  cout << x << ' ' << y << endl;

  return 0;
}