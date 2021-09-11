// class예제 작성해보자

// static인 method와 아닌 method들 공존가능
class Person {
  constructor(name, height) {
    this.name = name
    this.height = height
  }
  static GOT() {
    console.log('con')
  }
  static POT() {
    console.log('pro')
  }
  KOT() {
    console.log('I\'m not static')
  }
}

// prototype을 지정하면 자식들에게 물려주게 된다.
Person.prototype.weight = 90

const me = new Person('변정섭', 181)

// me에 wegight를 할당하지 않았음에도 weight가 출력된다.
console.log(me.weight, me.height, me.name)
 // me.GOT() -> static method이므로 에러가 나게 된다.
Person.GOT() // con
Person.POT() // pro
// Person.KOT() -> 인스턴스가 필요하므로 에러
Person.prototype.KOT() // I'm not static
me.KOT() // I'm not static
