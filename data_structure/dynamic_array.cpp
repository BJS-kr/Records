#include <iostream>
#include <sstream>
#include <algorithm>

template<typename T>
class dynamic_array {
  T* data;
  size_t n;
  public:
    dynamic_array(int n) {
      this->n = n;
      data = new T[n];// new 연산은 성공하면 0이 아닌 포인터를, 실패하면 0 반환 혹은 throw됨
    }
    // 복사생성자
    // 원본객체에 대한 참조를 인자로 가짐을 확인할 수 있다.
    // 이는 원본 객체와 완전히 동일하면서도, 독립적인 개체를 만들기위한 것이다.
    dynamic_array(const dynamic_array<T> &rhs) {
      n = rhs.n;
      data = new T[n];

      for (int i = 0; i < n; i++)
        data[i] = other[i];
  }

  // 어레이와 비슷하게 동작하도록 각종 연산을 정의
  T& operator[](int index) {
    return data[index];
  }

  const T& operator[](int index) const {
    return data[index];
  }

  T& at(int index) {
    if (index < n) return data[index];
    throw "index out of range"
  }

  size_t size() const {
    return n;
  }
  // 메모리 릭 방지 소멸자
  ~dynamic_array() {
    delete[] data;
  }

  T* begin() { return data; }
  const T* begin() const { return data;}
  T* end() { return data + n;}
  const T* end() const { return data + n;}
};