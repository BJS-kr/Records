/**
 * Facade는 complex한 subsystems에 대하여 간단한 인터페이스를 제공하기 위해 사용됩니다.
 * 좀 더 직관적으로 설명하자면 Client의 subsystems에 대한 요청을 delegate합니다.
 *
 * 예를 들어보겠습니다. 어떤 앱이 유저의 요청에 대하여 subsystem_A와 subsystem_B를 사용하여
 * 요청에 대한 처리를 수행한다고 가정하겠습니다. 그리고 subsystem A와 B는 라이브러리로써
 * 굉장히 복잡한 처리가 필요하다고 가정하겠습니다.
 *
 * 1. 요청에 대하여 라이브러리 A,B의 처리과정을 그대로 노출하는 것이 과연 바람직 할까요?
 * 2. 혹은 여러 요청 경로들에 대하여 그 복잡한 코드를 매번 작성하는 것은 바람직할까요?
 * 3. 이 문제는 클라이언트 객체 타입이 복수일 경우 더욱 심화됩니다.
 *    output의 형식은 같아야하지만 request는 클라이언트 객체에 따라 변한다고 가정해봅시다.
 *    매번 다른 객체면 다른 정제 과정을 거치게 될 것이 자명하며, 가뜩이나 복잡한 라이브러리 A,B의 로직을
 *    더욱 파악하기 힘들게 만들 것입니다. 유지 보수, 생산성 모두 저해될 것은 자명합니다.
 *
 * Facade는 어떻게 이문제를 해결 할까요? 바로 Facade라는 이름 그대로, '허울'을 클라이언트와 소통하는 전면에 내세웁니다.
 * 여러 경로이건, 클라이언트 객체가 복수이건 간에 Facade는 클라이언트가 소통할 수 있는 인터페이스가 되어줍니다.
 * A의 method_A, method_B와 B의 method_A, method_B는 Facade.method_process(가칭)하나의 인터페이스로 추상화 시킬 수 있다는 것입니다.
 * (인터페이스라는 표현이 interface 키워드를 의미하고자 하는 것이 아닙니다)
 *
 * 다시 문제 상황으로 돌아가봅시다.
 * 일단 1번 문제가 즉시 해결되었습니다. layer가 분리되어, 좀 더 추상화된 표현으로 로직을 쉽게파악할 수 있게 되었습니다.
 * 클라이언트는 복잡성에 노출되지 않고 직관적인 Facade의 인터페이스만 이용합니다.
 * 2번 문제는 어떻게 되었을까요? 코드의 반복이 함수화 되어 해결되었습니다.
 * 3번 문제도 역시 해결되었습니다. 클라이언트의 객체 타입이 복수더라도 공통된 facade의 메서드를 사용하며,
 * 처리 과정은 facade내에서 분리된 로직으로 구현됩니다.
 *
 * Facade는 subsystems의 lifecycle도 관리합니다.
 * 주의할 점도 있습니다. Facade가 맞딱드릴 수 있는 최대 문제점은 Facade가 지나치게 거대해 지는 것입니다.
 * 지나치게 많은 비즈니스 로직, 모든 관리, 의존 객체가 모두 포함된 소위 God-Object로 변모될 위험이 있습니다.
 * 결론적으로 Facade는 클라이언트를 complexity에 노출시키지 않고, 코드 복잡도를 줄이는 용도로만 사용되어야합니다.
 * Facade자체가 다시 복잡도를 높여버리는 형태가 되어선 안된다는 것입니다.
 */
class Facade {
  protected subsystem1: Subsystem1;

  protected subsystem2: Subsystem2;

  // subsystems의 처리는 Facade내부에 구현시키기 위하여 사용할 subsystems객체들을 가집니다.
  constructor(subsystem1: Subsystem1 = null, subsystem2: Subsystem2 = null) {
    this.subsystem1 = subsystem1 || new Subsystem1();
    this.subsystem2 = subsystem2 || new Subsystem2();
  }

  // sophisticated functionality를 Facade내부에 구현합니다.
  // 이를 통해 요청객체는 complexity에 노출되지 않으며,
  // 아래의 예시에선 operation이라는 단 하나의 메소드로 로직을 진행시킬 수 있습니다.
  public operation(): string {
    let result = 'Facade initializes subsystems:\n';
    result += this.subsystem1.operation1();
    result += this.subsystem2.operation1();
    result += 'Facade orders subsystems to perform the action:\n';
    result += this.subsystem1.operationN();
    result += this.subsystem2.operationZ();

    return result;
  }
}

// subsystems
class Subsystem1 {
  public operation1(): string {
    return 'Subsystem1: Ready!\n';
  }

  // ...

  public operationN(): string {
    return 'Subsystem1: Go!\n';
  }
}

class Subsystem2 {
  public operation1(): string {
    return 'Subsystem2: Get ready!\n';
  }

  // ...

  public operationZ(): string {
    return 'Subsystem2: Fire!';
  }
}

// 클라이언트는 더 이상 복잡성에 노출되지 않습니다.
// 코드의 가독성이 엄청나게 올라가는 것은 말할 것도 없고
// 심지어 복수의 클라이언트 객체가 존재하더라도 처리과정을 추상화 할 수 있습니다.
function clientCode(facade: Facade) {
  // ...

  console.log(facade.operation());

  // ...
}

const subsystem1 = new Subsystem1();
const subsystem2 = new Subsystem2();
const facade = new Facade(subsystem1, subsystem2);
clientCode(facade);
