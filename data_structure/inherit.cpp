#include <iostream>
#include "Class.cpp"
using namespace std;

class SportsCar : public Car {
 public:
  bool turbo;
  void controlTurbo(bool onOff) {
    turbo = onOff;
  }

  void speedUp() {
    if (turbo) {
      speed += 20;
    } else Car::speedUp();
  }
};


int main() {  
  Car myCar(0, 0, "bjs");
  SportsCar sportsCar;
  
  myCar.whereAmI();
  myCar.speedUp();
  myCar.changeGear();
  myCar.changeGear(8);
  myCar.speedUp();
  myCar.display();
  myCar.whereAmI();


  sportsCar.display();
  sportsCar.speedUp();
  sportsCar.display();
  sportsCar.controlTurbo(true);
  sportsCar.speedUp();
  sportsCar.display();
  sportsCar.controlTurbo(false);
  sportsCar.speedUp();
  sportsCar.display();

  return 0;
}