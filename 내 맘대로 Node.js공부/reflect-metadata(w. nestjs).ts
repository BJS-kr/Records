/**
 * reflect-metadata는 TS 공식 홈페이지의 decorator 파트에서 소개되고 있습니다.
 * 꼭 데코레이터로 써야하는 것은 아닙니다만 가장 일반적인 사용법부터
 * 살펴보면서 Production에서 사용되는 코드도 살펴봅시다.
 * 살펴볼 코드 예는 TS 공식 문서와 Nest.js의 레포에서 가져왔습니다.
 *
 * 추가로, reflect-metadata를 살펴볼 가치가 충분한 이유는
 * 이 패키지에서 제공하는 semantics가 ECMA script의 standard로 포함될 가능성이 충분하기 때문입니다.
 */

/**
 * 일단 reflect-metadata의 근간부터 살펴봅시다.
 * JS에는 개발자가 접근할 수 없는 internal property들이 있습니다.
 * 참고로 internal slot이라는 명칭이 좀 더 사용되는 것 같습니다만 internal property또한 동일한 의미로 사용됩니다.
 * 대표적으로 우리가 흔히 접근하는 prototype는 [[Prototype]]이라는 internal slot에 쓰여있습니다.
 * 그리고 [[Prototype]]에 접근하려면 [[GetPrototypeOf]]라는 internal method를 사용해야합니다.
 * 이는 또다시 Reflect.getPrototypeOf와 같은 메서드로 호출할 수 있겠지요.
 * 동작의 예를 들자면 Map에서 사용되는 [[MapData]]가 있겠네요.
 * 이 이유 때문에 Map을 wrap한 proxy가 set 메서드를 실행할 수 없는 상황을 이전에 살펴본바 있습니다.
 * reflect-metadata는 이와 같은 internal property를 추가해 metadata를 관리합니다.
 *
 * 이에 대한 ECMA 표준 문서는: https://262.ecma-international.org/6.0/#table-4
 * 이에 대한 자세한 설명은: https://medium.com/jspoint/what-are-internal-slots-and-internal-methods-in-javascript-f2f0f6b38de
 *
 * 그러니까, reflect-metadata도 같은 방식이라는 것입니다. metadata라는 이름으로 data와 마치 다른 것 처럼 분리하지만
 * 끝까지 생각해보면 metadata도 단순한 data일뿐이고, 저장될 곳이 필요하므로 저장소를 하나 더 추가한 것입니다.
 *
 * 공식문서의 설명을 pseudo하게 표현해보자면 [[Metadata]]라는 곳의 형태는 다음과 같습니다.
 *
 * [[Metadata]]
 * Map {
 *  PropertyKey | undefined =>
 *    Map {
 *      metadataKey => metadataValue
 *    }
 * }
 *
 * Object에 추가적인 internal method들이 추가됩니다.
 * internal method는 개발자가 직접 호출할 수 없는 자바스크립트 내부 메서드로서,
 * 예를 들어보자면 obj[prop]와 같이 접근시, 이는 사실 내부메서드 [[Get]]을 호출하는 것입니다.
 * 또한 우리가 객체 속해있는 메서드를 호출할 때에도 사실은 [[Get]]이 prop을 읽어 함수를 반환하면
 * 우리는 다시 인자를 괄호와 추가해 Function object의 추가 internal method인 [[Call]]을 또다시 호출하는 것입니다.
 * 이러한 과정이 겉으로는 생략되어있으므로 고려되지 않을 뿐이지요.
 *
 * reflect-metadata는 이와같은 internal method를 추가합니다.
 * [[DefineOwnMetadata]], [[GetOwnMetadata]], [[HasOwnMetadata]] 등과 같습니다.
 * 주목할 만한 특징은, 이와 같이 추가된 internal method를 Proxy객체가 override할 수 있다는 것입니다.
 * 애초에 이 패키지의 저자가 goals 항목에 Proxy와 함께 동작할 수 있을 것을 목표했다고 적어두었네요 :)
 *
 * 클래스 선언에 정의된 metadata는 Class.[[Metadata]]에 저장될 것입니다. undefined key와 함께요.
 * static member에 정의된 metadata는 property key를 key로 하여 Class.[[Metadata]]에 저장될 것입니다.
 * instance member에 정의된 metadata는 property key를 key로 하여 Class.prototype.[[Metadata]]에 저장될 것입니다.
 *
 * 정리해볼까요? pseudo하게 표현해보겠습니다.
 * keyof(C.[[Metadata]]) == undefined => Metadata:Class
 * keyof(C.[[Metadata]]) != undefined => Metadata:Static Member
 * keyof(C.prototype.[[Metadata]]) => Metadata:Instance Member
 */

// reflect-metadata는 선언형(Declarative)와 명령형(imperative)한 방식을 문서에서 소개하고 있으며,
// Declarative는 metadata 메서드를 decorator로 사용하는 예로, Imperative는 defineMetadata 메서드를 idiomatic하게 사용하는 방식을 소개하고 있습니다.

// 설명이 너무 길어서 죄송할 지경이 되었으니, 코드를 살펴보겠습니다!
import 'reflect-metadata';

class Point {
  constructor(public x: number, public y: number) {}
}

class Test {}

class Line {
  private _start: any;
  private _end: Point | undefined;
  private custom: any;

  @validate
  // @Reflect.metadata('design:type', Test)
  set start(value: Point) {
    this._start = value;
  }

  get start() {
    return this._start;
  }

  @validate
  // @Reflect.metadata('design:type', Test)
  set end(value: Point) {
    this._end = value;
  }

  get end() {
    return this._end;
  }
}

function validate<T>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  let set = descriptor.set!;

  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata('design:type', target, propertyKey);
    console.log(type);
    if (!(value instanceof type)) {
      throw new TypeError(
        `Invalid type, got ${typeof value} not ${type.name}.`
      );
    }

    set.call(this, value);
  };
}

const line = new Line();
line.start = new Point(0, 0);
console.log(line.start);

// @ts-ignore
// line.end = {};

// Fails at runtime with:
// > Invalid type, got object not Point
const objParent = { hello: '' };
const obj = {
  hi: function () {
    return 'hi?';
  },
  __proto__: objParent,
};
for (const prop in obj) {
  console.log(prop);
}
console.log(obj.hasOwnProperty('hi'));
console.log('hi' in obj);
console.log(obj.hasOwnProperty('hello'));
console.log('hello' in obj);

const newTarget = {};
Reflect.defineMetadata('hi', obj['hi'], newTarget);
console.log(newTarget);
console.log(Reflect.getMetadata('hi', newTarget));
