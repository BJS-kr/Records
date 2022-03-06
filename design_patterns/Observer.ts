/**
 * 옵저버 패턴은 어떤 객체(subscriber)가 또 다른 객체(publisher)의 활동 혹은 상태를 참조해야 할 때 필요합니다.
 * 이를 마치 스팸메일 같은, 모든 연관 객체에게 알리는 방식으로 오해하면 안됩니다.
 * 
 * 옵저버 패턴은 두 가지 상황을 해결합니다.
 * 1. 참조가 필요한 객체가 끊임없이 대상의 상태를 체크해야하는 비효율성
 * 2. 자신을 참조해야할 가능성이 있는 모든 객체에게 상태를 알리는 비효율성
 * 
 * 옵저버 패턴은 구독이라는 개념을 통해 단순히 연관 객체가 아니라, 런타임에 유동적으로 구독 및 구독 종료를 통해 필수적인 참조를 유지시킵니다.
 * 
 * 이는 실생활의 예제로 쉽게 이해할 수 있는데, 어떤 소비자가 자신이 원하는 브랜드의 신제품 출시를 기다리고 있다고 상상해봅시다.
 * 소비자는 신제품이 출시되었는지 확인하기 위해 매일 상점에 들릅니다. 그러나, 당연하게도 대부분의 날을 허탕치고 맙니다.
 * 상점의 입장도 곤란합니다. 신제품이 출시될 때마다 자신이 보유한 모든 고객의 연락처에게 소식을 알리지만, 대부분의 고객은 우편을 읽지도 않고 버립니다.
 * 이 때, 구독의 개념이 등장합니다. 상점은 더 이상 모든 고객에게 제품 출시 소식을 알리지 않고, 대신 구독자 신청을 받습니다.
 * 신제품 출시 소식을 알고 싶은 고객에게만 신제품 출시 소식을 알림으로써, 고객은 매일 상점에 들리지 않아도 되고 상점은 효용성이 높은 우편만 보내게 되었습니다.
 */

// 위의 예에서 상점을 떠올리면 됩니다. 어떤 객체들이 참조하고자 하는 대상입니다.
// 이는 publisher로 표현되며, 객체의 상태가 바뀌거나 어떤 동작을 수행하는 등의 이벤트를 알리게 됩니다.
// 객체간의 관계를 단순화하여 응집도, 복잡도를 낮추고 확장성을 높이기 위하여, 공통된 subscriber와 publisher 인터페이스를 사용하는 것이 바람직합니다.
// 그러나 아래와 같이 표현된 Subject(publisher)가 이렇게 단순한 형태라고 오해하면 안됩니다.
// subject는 비즈니스 로직을 수행하는 객체일 확률이 높으며, subscriber에 관계된 메서드는 Subject자신의 일부일 뿐 입니다.
interface Subject {
    // 구독 객체를 추가합니다.
    attach(observer: Observer): void;
    // 구독 객체를 떼어냅니다.
    detach(observer: Observer): void;
    // 구독된 객체들에게 이벤트를 알립니다.
    notify(): void;
}

// 위의 인터페이스를 통해 만들어진 concrete publisher입니다.
// 앞서 설명한 것처럼, 이는 설명을 위해 단순화된 객체로, 보통 publisher는 보다 많은 기능(비즈니스 로직)을 수행합니다.
class ConcreteSubject implements Subject {
    // 자신의 상태를 표현합니다. 이 예제에서는 상태지만, 동작일 수도 있습니다.
    public state: number;

    // 자신을 구독하고 있는 subscriber들. 아래의 Observer처럼 공통된 인터페이스로 구현되는 것이 바람직합니다.
    private observers: Observer[] = [];

    // 구독 관리 메서드들
    public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    // 구독 객체들에게 상태를 알립니다.
    public notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    // concreteSubject의 본래 기능입니다. 구독관련 기능들은 본래의 기능이라기보다 참조 관계 유지를 위해 존재함을 명심해야합니다.
    public someBusinessLogic(): void {
        console.log('\nSubject: I\'m doing something important.');
        this.state = Math.floor(Math.random() * (10 + 1));

        console.log(`Subject: My state has just changed to: ${this.state}`);
        this.notify();
    }
}

// subscriber는 notify를 통해 subject의 상태를 업데이트 받는 메소드가 포함된 인터페이스를 구현합니다.
interface Observer {
    update(subject: Subject): void;
}

// 참조대상의 상태를 참조해, 특정 조건을 만족하면 subscriber가 동작합니다.
class ConcreteObserverA implements Observer {
    public update(subject: Subject): void {
        if (subject instanceof ConcreteSubject && subject.state < 3) {
            console.log('ConcreteObserverA: Reacted to the event.');
        }
    }
}

class ConcreteObserverB implements Observer {
    public update(subject: Subject): void {
        if (subject instanceof ConcreteSubject && (subject.state === 0 || subject.state >= 2)) {
            console.log('ConcreteObserverB: Reacted to the event.');
        }
    }
}

// 클라이언트가 실제로 Observer 패턴을 사용하는 예입니다.
// 옵저버 패턴을 통해 객체관 관계를 공통된 인터페이스로 쉽게 관리할 수 있게 되었습니다 :)
const subject = new ConcreteSubject();

const observer1 = new ConcreteObserverA();
subject.attach(observer1);

const observer2 = new ConcreteObserverB();
subject.attach(observer2);

subject.someBusinessLogic();
subject.someBusinessLogic();

subject.detach(observer2);

subject.someBusinessLogic();
