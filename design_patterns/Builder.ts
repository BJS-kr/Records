/**
 * 빌더 패턴은 생산하고자 하는 결과물이 여러 요소의 복잡한 집합 혹은 확장적일 때에만 유용합니다.
 * 전체적인 구조는 이러합니다.
 * 
 * 1. 어떠한 타입의 concrete에도 적용가능한 공통된 빌더 인터페이스가 존재합니다. 
 * 2. concrete 빌더는 생산하고자 하는 결과물에 합당한 인터페이스를 구현합니다.
 * 3. 생산된 각 결과물은 공통된 인터페이스를 가지지 않음에도, 생산은 공통된 빌더 인터페이스를 통합니다.
 * 4. Director는 필수적인 객체는 아니지만, 여러 빌더를 통제하는 것에 유용합니다.
 * 
 * 위의 예를 들어보겠습니다. 차를 만드는 공장이 있다고 가정하겠습니다.
 * 차 종도 수 없이 많지만 차에는 차의 모든 동작 요소(인터페이스)에 상응하는 설명서도 포함될 것입니다.
 * 차와 설명서는 당연하게도 같은 동작을 하지 않지만, 포함하는 요소는 같다는 것입니다.
 * 즉, 결과물이 같은 인터페이스를 가지지 않음에도 같은 빌더 인터페이스로 생산이 가능하다는 것입니다.
 * 
 * 디렉터는 빌더가 가진 메소드들이 생산할 순서를 정의하는 객체로 보는 편이 타당합니다.
 * 디렉터는 공통된 Builder타입을 인자로 받지만 실제로 인자로 들어오는 객체는 concrete 빌더일 것이며,
 * 그 빌더를 통제해 빌더가 생산하는 순서를 정의한다는 뜻입니다. 
 * 예를 들면, 스포츠카 빌더(concrete 빌더)를 인자로 받고, 바퀴를 생산, 창문 생산, 문 생산,... 등을 정의한
 * produceSportsCar, produceSuv,... 메서드를 가진 객체라고 상상하면 이해하기 좋습니다. 
 * 
 * 이러한 순서의 정의는 굳이 디렉터를 따로 정의하지 않더라도 빌더를 사용하는 코드가 정의할 수 있기 때문에 디렉터는 필수요소가 아닙니다.
 * 그러나, 특정한 루틴들이 분리될 수 있다거나(스포츠카 생산과 SUV생산이 다른 것 처럼), 코드의 가독성을 높이는 것에 도움이 됩니다.
 * 예를 들면, 클라이언트 코드가 디렉터에게 carBuilder를 constructor 인자로 넣고, 디렉터의 produceSportsCar메서드만 실행시키면 간편하게 결과물을 얻게 된다는 것입니다.
 */
interface Builder {
    producePartA(): void;
    producePartB(): void;
    producePartC(): void;
}

// 공통된 빌더 인터페이스를 구현해 concrete 빌더를 만듭니다.
class ConcreteBuilder1 implements Builder {
    private product: Product1;

    constructor() {
        this.reset();
    }

    // reset메서드가 constructor와 getProduct메서드에서 실행되는 이유:
    // 빌더는 생산이 끝났을때, 무엇도 지니지 않고 있어야합니다.
    // 다음 생산을 위해 이전 결과물에 영향이 없어야한다는 뜻입니다.
    public reset(): void {
        this.product = new Product1();
    }

    // 빌더의 세분화된 생산 기능입니다. 창문, 바퀴, 엔진 등을 떠올리시면 됩니다.
    public producePartA(): void {
        this.product.parts.push('PartA1');
    }

    public producePartB(): void {
        this.product.parts.push('PartB1');
    }

    public producePartC(): void {
        this.product.parts.push('PartC1');
    }

    // 모든 productPart기능이 항상 실행되어야 하는 것이 아님에 주의해야합니다.
    // 어떤 집에는 차고가 있지만 어떤 집에는 없듯이, 모든 부분들이 필수요소는 아닙니다.
    // 다만, 특정 요소들이 포함된 결과물 자체는 Product(집)라는 하나의 이름으로 통일되어 반환되는 것입니다.
    // 그래서 빌더는 getProduct라는 결과 반환 메서드를 따로 가지게 되는 것입니다.
    public getProduct(): Product1 {
        const result = this.product;
        this.reset();
        return result;
    }
}

// 또 다시 집을 떠올려봅시다.
// 추상화 된 집이라는 청사진이 있고, 실제 그 집에 포함되는 요소들(욕실, 정원, 큰 방,...)등은 아래의 parts 배열에 포함될 것입니다.
class Product1 {
    public parts: string[] = [];

    public listParts(): void {
        console.log(`Product parts: ${this.parts.join(', ')}\n`);
    }
}

// 디렉터는 앞서 설명한 것처럼, 빌더 인터페이스를 구현한 객체를 인자로 받게 되며(다양한 concrete builder를 통제가능)
// 클라이언트 코드가 원하는 대로 디렉터의 메서드를 실행시켜 원하는 결과물을 얻을 수 있습니다.
// 디렉터는 단지 빌더가 작업할 순서만을 정의합니다.
class Director {
    private builder: Builder;

    public setBuilder(builder: Builder): void {
        this.builder = builder;
    }

    public buildMinimalViableProduct(): void {
        this.builder.producePartA();
    }

    public buildFullFeaturedProduct(): void {
        this.builder.producePartA();
        this.builder.producePartB();
        this.builder.producePartC();
    }
}

// 클라이언트 코드가 디렉터에게 세부적인 절차를 맡기고, 빌더로 부터는 진행된 작업 결과물을 반환받고 있습니다.
// 거대하고 확장적인 코드라고 할지라도, 빌더 패턴을 따르면 관계를 공통된 인터페이스로 정의할 수 있고, 보다 통제하기 쉬운 코드가 완성됩니다 :)
function clientCode(director: Director) {
    const builder = new ConcreteBuilder1();
    director.setBuilder(builder);

    console.log('Standard basic product:');
    director.buildMinimalViableProduct();
    builder.getProduct().listParts();

    console.log('Standard full featured product:');
    director.buildFullFeaturedProduct();
    builder.getProduct().listParts();

    // 디렉터가 필수가 아님을 명심하세요! 클라이언트도 충분히 빌더에게 작업 순서 지시를 내리고 결과물을 받을 수 있습니다.
    console.log('Custom product:');
    builder.producePartA();
    builder.producePartC();
    builder.getProduct().listParts();
}

const director = new Director();
clientCode(director);
