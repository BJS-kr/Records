/**
 * Abstract Factory Pattern은 각 관계 당사자들이 추상적인 방식으로 생산과 소통을 가능하게 한다.
 * 예를 들어, modern chair, victorian chair와 같이 concrete object를 생성하는 것이 아니라,
 * 공통적인 chair interface를 통해 variants만 부여해 생성하는 것이다.
 * 이러한 방식을 사용했을 때의 이점은, 코드에 일관성과 편리함이 생긴다는 것 외에 더 있는데,
 * 생산된 object를 사용하는 당사자도 공통적인 추상 인터페이스를 통해 소통할 수 있다는 점이다. 
 */
interface AbstractFactory {
    // 실제 구현없이 인터페이스 타입만 지정
    createProductA(): AbstractProductA;

    createProductB(): AbstractProductB;
}

// specified된 factory를 implements
class ConcreteFactory1 implements AbstractFactory {
    // 구체화된 인터페이스
    // 여전히 AbstractProductA 사용 가능
    // 이는 client가 추상화된 인터페이스대로 object를 사용할 수 있게 하는 요소
    public createProductA(): AbstractProductA {
        // 추상적인 ProductA가 구체적인 ProductA1과 compatible
        return new ConcreteProductA1();
    }

    public createProductB(): AbstractProductB {
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 implements AbstractFactory {
    public createProductA(): AbstractProductA {
        return new ConcreteProductA2();
    }

    public createProductB(): AbstractProductB {
        return new ConcreteProductB2();
    }
}

// concrete product는 또한 abstract product를 이용해 공통된 interface를 가짐
interface AbstractProductA {
    usefulFunctionA(): string;
}

class ConcreteProductA1 implements AbstractProductA {
    public usefulFunctionA(): string {
        return 'The result of the product A1.';
    }
}

class ConcreteProductA2 implements AbstractProductA {
    public usefulFunctionA(): string {
        return 'The result of the product A2.';
    }
}

interface AbstractProductB {
    usefulFunctionB(): string;
    // 아래의 메소드는 product A의 인터페이스를 사용
    // 지금까지와 마찬가지로, 타입은 추상적, call은 구체적인 객체를 사용하게 될 것
    anotherUsefulFunctionB(collaborator: AbstractProductA): string;
}


class ConcreteProductB1 implements AbstractProductB {

    public usefulFunctionB(): string {
        return 'The result of the product B1.';
    }

    public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
        const result = collaborator.usefulFunctionA();
        return `The result of the B1 collaborating with the (${result})`;
    }
}

class ConcreteProductB2 implements AbstractProductB {

    public usefulFunctionB(): string {
        return 'The result of the product B2.';
    }

    public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
        const result = collaborator.usefulFunctionA();
        return `The result of the B2 collaborating with the (${result})`;
    }
}

// 클라이언트의 접근 가능성 매우 높음
// 아무리 많은 variants라도 공통된 interface로 통제가능
function clientCode(factory: AbstractFactory) {
    const productA = factory.createProductA();
    const productB = factory.createProductB();

    console.log(productB.usefulFunctionB());
    console.log(productB.anotherUsefulFunctionB(productA));
}


console.log('Client: Testing client code with the first factory type...');
clientCode(new ConcreteFactory1());

console.log('');

console.log('Client: Testing the same client code with the second factory type...');
clientCode(new ConcreteFactory2());
