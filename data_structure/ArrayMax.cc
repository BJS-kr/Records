#include <iostream>
using namespace std;

int ArrayMax(int num[]) {
  int tmp = num[0];
  for (int i = 1; i < sizeof(num)/sizeof(num[0]); i++) {
    if (num[i] > tmp) { 
      tmp = num[i];
      }
  }
  return tmp;
}

int main() {
  int num[] = {0, 6, 2, 4, 3, 5};
  ArrayMax(num);
  return 0;
}