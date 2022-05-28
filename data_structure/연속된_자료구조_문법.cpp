#include <array>
#include <iostream>

using namespace std;

void nonTemplate(array<int, 4> arr) {
  // index를 사용하는 for반복은 에러 발생의 여지가 있음(없는 요소에 대한 접근 등)
  // 그래서 아래와같은 형태의 반복문 사용
  for (auto e: arr)
    cout << "non-templated: " << e << ", ";
}

template<size_t L>
// 참조형태로 전달하는 것은 깊은 복사를 막고 원 배열을 사용하게 한다.
void templated(const array<int, L>& arr) {
  for (const auto e: arr)
    cout << "templated: " << e << ", ";
}

template<size_t L>
void rangeIteration(const array<int, L>& arr) {
  for (auto i = arr.begin(); i != arr.end(); i++)
    cout << "templated ranged: " << *i << ", ";
}

int main() {
  array<int, 10> arr1;
  arr1[0] = 1;
  cout << "arr1 first element: " << arr1[0] << endl;

  array<int, 4> arr2 = {1,2,3,4};
  cout << "all elements of arr2: ";

  for (int i = 0; i < arr2.size(); i++) 
    cout << arr2[i] << " "; 
  cout << endl;

  cout << "this will throw out of range error: ";
  try {
     for (int i = 0; i < arr2.size(); i++) 
    cout << arr2.at(i + 1) << " "; 
  cout << endl;
  } catch (const out_of_range& ex) {
    cout << endl;
    cerr << ex.what() << endl;
  }
 
  nonTemplate(arr2);
  cout << endl;
  templated(arr2);
  cout << endl;
  rangeIteration(arr2);
  return 0;
}


