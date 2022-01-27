// 1. 메소드 로직을 바꿨을 때, 실행시간이 얼마나 달라졌는지 테스트해보고자 찾아보고자 했다.
// 2. 파이썬 데코레이터가 생각나서 js에도 똑같이 구현할 수 없을까 해서 데코레이터 위주로 찾아보았다.
// 3. 데코레이터를 적용 가능한 모든 형식은 https://www.typescriptlang.org/docs/handbook/decorators.html에 잘 정리되어 있다.
// 참고한 글: https://stackoverflow.com/questions/68383690/decorator-in-typescript-to-return-timing-of-function

const getElapsedTime =() => {
  return function (target:any, prop:string, descriptor:PropertyDescriptor) {
    const preservedMethod = descriptor.value
    descriptor.value = async function () {
      const start = Date.now()
      await preservedMethod()
      console.log((Date.now() - start)/1000)
    }
  }
}

class Foo {
  @getElapsedTime()
  lazy() {
    return new Promise((resolve) => {
      setTimeout(() => resolve('done!'), 1000)
    }).then(res => console.log(res))
  }
}

new Foo().lazy()

// 확실히 직접 작성해보니 감이 빡 온다. 앞으로 어지간한 편의 기능은 데코레이터로 구현하려고 한다.
