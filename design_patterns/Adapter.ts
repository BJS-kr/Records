/**
 * Adapter는 객체간 관계의 호환성을 유지시켜줍니다.
 * 이 패턴은 기존의 코드 베이스를 훼손한지 않는 것에 특히 도움이 됩니다.
 * Adapter가 필요한 상황은 주로 제 3자가 작성한 프로그램 혹은 서비스 등을 사용하고자 할때 발생할 가능성이 높습니다.
 */

// Target은 관계를 호환시켜주고자 하는 대상입니다.
class Target {
    public request(): string {
        return 'Target: The default target\'s behavior.';
    }
}

// Adaptee는 우리가 기존에 가지고 있던 기능으로 생각합시다. 예를 들어, 1만 줄의 코드가 연관된 클래스라고 상상해봅시다.
// 이 Adaptee가, 사용하고자 하는 Target에 호환되지 않은 상황입니다.
class Adaptee {
    public specificRequest(): string {
        return '.eetpadA eht fo roivaheb laicepS';
    }
}

// 아래는 전형적인 Adapter 세 가지 구현 중 하나의 경우입니다.
// Client(Adaptee)를 override할 수도 있고, Service(Target)를 그렇게 할 수도, 혹은 양방향으로 구현 할 수도 있습니다.
class Adapter extends Target {
    constructor(private readonly adaptee: Adaptee) {
        super();
    }

    public request(): string {
        const result = this.adaptee.specificRequest().split('').reverse().join('');
        return `Adapter: (TRANSLATED) ${result}`;
    }
}

// 결과적으로 클라이언트는 target 혹은 adaptee를 이용하는 것에 관계없이 코드를 이용할 수 있게 되었습니다.
// Adapter는 Target을 extends했기 때문에 Adapter는 clientCode의 인자로 들어갈 수 있기 때문입니다.
function clientCode(target: Target) {
    console.log(target.request());
}

console.log('Client: I can work just fine with the Target objects:');
const t = new Target();
clientCode(t);

console.log('');

const adaptee = new Adaptee();
console.log('Client: The Adaptee class has a weird interface. See, I don\'t understand it:');
console.log(`Adaptee: ${adaptee.specificRequest()}`);

console.log('');

console.log('Client: But I can work with it via the Adapter:');
const adapter = new Adapter(adaptee);
clientCode(adapter);
