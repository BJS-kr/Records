#include <iostream>
using namespace std;

// virtual은 런타임에 동적으로 포인터가 가리키는 객체의 메서드를 실행할 수 있도록 하는 기능입니다.
// 설명만으론 이해하기 힘드니 바로 예제를 작성해보겠습니다.
class HaveVirtual {
  public:
    virtual void hello() {
      cout << "I am Parent virtual hello!" << endl;
    };

    void hi() {
      cout << "I am Parent concrete hi!" << endl;
    };
};

class NotHaveVirtual: public HaveVirtual {
  public:
    void hello() {
      cout << "I am Child concrete hello!" << endl;
    };

    void hi() {
      cout << "I am Child concrete hi!" << endl;
    };
};

int main() {
  HaveVirtual parent;
  NotHaveVirtual child;

  HaveVirtual* parentPointer = &parent;
  NotHaveVirtual* childPointer = &child;

  parentPointer = childPointer;

  // parent에 정의되어있던 메소드가 아니라 child의 메소드가 실행되었다. 
  // type이 HaveVirtual이지만 virtual 선언으로 인해 포인터를 child 객체 포인터로 할당했을때 method가 child의 것으로 변경되었기 때문이다.
  parentPointer->hello(); // I am Child concrete hello!
  // 당연히 child의 메소드가 실행된다.
  childPointer->hello(); // I am Child concrete hello!
  // type이 HaveVirtual(parent)이기 때문에 concrete method는 정의된 대로 출력된다.
  parentPointer->hi(); // I am Parent concrete hi!
  // child의 메소드가 그대로 실행된다.
  childPointer->hi(); // I am Child concrete hi!

  return 0;
}