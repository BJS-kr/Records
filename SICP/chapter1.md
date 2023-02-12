SICP에서, 본문의 내용은 다량의 연습 문제를 해결하며 그 의미를 되돌아볼 수 있도록 구성되어 있다. 그러므로 본문의 내용을 옮기기 보다는 연습문제를 해결해 나가는 과정을 기록한다. 

# Chapter 1: 함수를 이용한 추상화

#### 1.1) 다음 각 행의 평가 결과를 서술하라
#### 1.1 A
```js
10; -> 10
5 + 3 + 4; -> 12
9 - 1; -> 8
6 / 2; -> 3
2 * 4 + (4 - 6); -> 6
const a = 3; -> 3할당
const b = a + 1; -> 4할당
a + b + a * b; -> 19
a === b; -> false
b > a && b < a * b ? b : a; -> 곱셈연산이 크기비교 연산보다 우선순위가 높다. 그러므로 b로 평가된다.
a === 4 ? 6 : b === 4 ? 6 + 7 + a : 25; -> 16
2 + (b > a ? b : a); -> 6
(a > b ? a : a < b ? b : -1) * (a + 1); -> 16
```


#### 1.2) 수식을 표현식으로 옮겨라
#### 1.2 A
 ```js
5 + 4 + (2 - (3 - (6 + 4 / 5))) / 3 * (6 - 2) * (2 - 7)
 ```
 
#### 1.3) 세 개의 수을 받고 셋 중 가장 작은 것을 제외한 두 수의 제곱들을 합한 결과를 돌려주는 함수를 선언하라
#### 1.3 A
```js
function squareAndSumExceptSmallestOfThreeNumbers(a, b, c) {
  const [greatest, secondary] = [...arguments].sort((x, y) => y - x);
  return greatest ** 2 + secondary ** 2;
}
``` 

#### 1.4) 다음과 같은 함수 선언들이 있을 때, a_plus_abs_b함수의 작동방식을 서술하라
```js
function plus(a, b) {return a + b;}
function minus(a, b) {return a - b;}
function a_plus_abs_b(a, b) {
  return (b >= 0 ? plus : minus)(a, b)
}
```
#### 1.4 A
술부에서 b가 0보다 크거나 같다면 plus가 괄호식의 평가된 값이 되고 반대의 경우도 마찬가지이다. b가 음수라면 -를 통해 sign이 전환되므로 절댓값으로 평가되어 더하는 효과를 얻을 수 있다.

#### 1.5) 아래와 같은 함수 선언이 있고, 언어 해석기가 인수 우선 평가하는지 정상 순서 평가하는지를 판단하고 근거를 서술하라
```js
function p() { return p(); }

function test(x, y) {
  return x === 0 ? 0 : y;
}

test(0, p());
```
#### 1.5 A
위 함수를 통해 자바스크립트는 인수 우선 평가 해석기임을 알 수 있다. 
근거 1) 정상 순서 평가 해석기였다면 인수를 평가하는 것이 아니라 표현식을 단지 인수에 대입해놓았을 것이다.
근거 2) test는 실행되지 못한다. p()는 탈출 조건없는 무한 재귀로, 인수 우선 평가 방식인 js는 p()의 평가를 결국 실패하게 된다.

#### 1.6) 아래와 같이 조건문을 대체하는 함수와 이를 활용한 뉴턴 방법으로 제곱근을 구하는 함수를 작성했을 때 어떤 일이 생기는지 설명하라
```js
function conditional(predicate, then, else) {
  return predicate ? then : else;
}

function sqrt_iter(guess, x) {
  return conditional(is_good_enough(guess, x), guess, sqrt_iter(improve(guess, x), x));
}
```
#### 1.6 A
최적화 측면에서 굉장히 불리하고, 프로그램이 실행될 가능성도 낮아진다. 1.5에서 살펴보았듯, JS는 인수 우선 평가 해석기이다. 원래의 술어, 귀결, 대안 구조라면 술어가 참을 반환한다면 대안은 평가되지 않을 것이다. 그러나 위의 함수 선언은 조건이 함수의 인자로 평가되므로 무조건 모두 평가된다. 불필요한 부분까지 평가할 뿐 아니라 실행이 되지 않을 수도 있다.

#### 1.7) 언어에서 매우 큰 수와 매우 작은 수를 정확히 표현하는 것에 한계가 있는 이유를 서술하라. 아울러, 뉴턴 방식으로 제곱근을 구할 때 '충분히 좋음'을 평가하는 기준을 추측값의 제곱이 square에 대해 근사치임을 판단하는 것이 아니라, 추측값의 변화량이 매우 작음을 기준으로 동작하도록 해보고 이와 같은 변화가 제곱근의 정확성을 상승시키는지 판단하라.

#### 1.7 A
1) int vs float vs double
int는 정수형(c에서는 char, short, int, long 등으로 표현되지만 일단 js니까 생략). float은 부동소수(1 + 8 + 23, 즉 single precision), double은 두배 정확도를 가진 float(1 + 11 + 52, 즉 double precision)이다. 순환소수 등의 문제로 인해 정확도가 중요하다면 double을 쓰거나 아예 int로 치환해서 쓰는 것이 권장된다. 예를 들어 5.1달러를 저장하는 것이 아니라 5100센트로 저장하는 것이다. 또 한 float에 대해 !=, == 등 같음/다름을 테스트해서는 안된다(MISRA-C: 2004 13.3).

부동소수란 컴퓨터에서 쓰는 방식으로, 1) 부호 2)지수 3)가수 부로 나눠서 메모리에 올리는 방식이다. 소수점을 저장하기 애매하니 그냥 소수점의 위치를 나타내는 부분을 따로 뺀 것(지수)이다. 먼저 저장하고자 하는 숫자를 2진법으로 변환 후 소수점을 제거한다(첫 번째 자리까지 옮긴다고 표현하기도 한다). 변환한 이진수의 첫 번째 자리는 고려하지 않는데, 이진수이므로 당연히 첫 째 자리는 1일것이 자명하기 때문이다. 어쨋든 둘 째 자리부터의 모든 숫자를 가수부에 저장한다. 이 때문에 js의 int정확 범위는 -2의 53제곱 부터 2의 53제곱까지이다. 지수부는 표현가능한 범위(예를 들어 지수부가 8비트라면 256)를 반으로 나눠 -e와 e를 표현한다. 8비트(즉, float)라면 -127~127의 범위로 가능한데 01111111이면 0이고 1111111이면 127인 식이다.
2) Number vs BigInt
Number는 기본적으로 64 float 즉, double이다. 이와 같은 이유로 정확도의 범위가 제한되는데, BigInt라고 무한대로 정확한 것은 절대 아니지만 호스트의 메모리 한계만큼 정확하게 가능하다(!). 이 원리는 https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic를 참조하도록 하자

JS에서 가장 큰 수는 2**1024 - 1(약 1.7976931348623157E+308)이고, 가장 작은 수는 2\*\*-1074(5E-324)이다. 즉, JS에서 정확도를 측정할 수 있는 최대는 (Number.MIN_VALUE >= 근사치)인 경우이다. 이 정확도는 두 가지로 사용가능하다. 제곱근의 변화량의 기준으로 삼을 수도 있고, 제곱근의 제곱과 제곱수 간의 차이를 기준으로 삼을 수도 있다. 둘의 정확도는 차이가 없다. 그 이유는 다음과 같다.

1) 문제를 단순화 시켜, 100의 제곱근을 구한다고 가정해보자. 추측은 두 가지로, 9와 10을 선정하였다고 가정하자.
9의 제곱은 81, 10의 제곱은 100으로써 19의 차이가 생긴다. 그러나 9와 10의 차이는 단 1이었다. 모든 범위에서, 추측값간의 차이는 제곱하였을 때 그 차이가 더욱 커진다. 그러므로, 근사값의 판단은 제곱근의 제곱을 기준으로 판단하는 것이 옳다.

2) 그러나 JS가 판단할 수 있는 가장 작은 범위의 숫자의 한계가 명확하므로 상황은 달라진다. 수학에서는 무한히 가까워질 수 있지만 JS에서는 가까워지는 것에 한계가 있다는 것이다. 한계까지 가까운 제곱근을 곱해 제곱수의 차이가 Number.MIN_VALUE보다 크다고 하더라도 더 이상 가까워질 수 없고, 제곱수의 차이로 계산하더라도 이미 제곱근은 한계에 다달았기 때문에 더 이상 정확해질 수 없다. 그러므로 둘의 정확도 차이는 없다.

원문에서 충분히 좋음을 판단하는 기준은 0.001로써 꽤 부정확한 기준이었고, 변화량의 매우 작음을 기준으로 변경하면 정확도는 상승한다.

#### 1.9) 다음 함수들은 반복적인가 재귀적인가? 치환모형으로 표현하라
```js
function plus(a, b) {
  return a === 0 ? b : inc(plus(dec(a), b));
}

function plus(a, b) {
  return a === 0 ? b : plus(dec(a), inc(b)) ;
} 
```

#### 1.9 A)

plus(2,1)
* 1번 plus: 재귀적
inc(plus(1, 1));
inc(inc(plus(0,1)));
inc(inc(1));
inc(2);
3

* 2번 plus: 반복적
plus(1, 2);
plus(0, 3);
3;

#### 1.10) A가 애커만 함수일 때, 다음 각 A의 호출은 어떻게 평가되는가? 또 한 A를 사용하여 작성된 함수 f, g, h가 계산하는 함수를 간결한 수식으로 표현하라
```js
A(1, 10); 
A(2, 4);
A(3, 3);

function f(n) {
  return A(0, n);
}

function g(n) {
  return A(1, n);
}

function h(n) {
  return A(2, n);
}
```

#### 1.10 A
1024
65536
65536

f: 2 * n
g: 2 ** n
h: 2 ** h(n - 1)

#### 1.11) n < 3 이면 f(n) = n이고 n >= 3이면 f(n) = f(n - 1) + 2f(n - 2) + 3f(n - 3)인 함수를 재귀적인 방법과 반복적인 방식으로 작동하도록 각각 작성하라
#### 1.11 A
```js
function f(n) {
  return n < 3 
          ? n 
          : (f(n - 1) + 2 * f(n - 2) + 3 * f(n - 3));
}

function f2(n) {
  return n < 3 
          ? n 
          : n === 3 
          ? 4 
          : f_iter(n, 4, 1, 2, 4);
}

function f_iter(target, count, pre3, pre2, pre1) {
  const dynamics = pre1 + pre2 * 2 + pre3 * 3;

  return count >= target
          ? dynamics
          : f_iter(target, ++count, pre2, pre1, dynamics);
}
```

#### 1.12) 파스칼 삼각형의 성분들을 재귀적으로 계산하는 함수를 작성하라
#### 1.12 A
```js
function pascal(row, target, current = 0, leftUpper = 0, rightUpper = 1) {
  return target === 0 || target === row + 1
          ? 1
          : target === 1
          ? row + 1
          : target === current 
          ? leftUpper + rightUpper
          : pascal(
              row, 
              target, 
              current + 1, 
              rightUpper, 
              pascal(row - 1, current + 1)
            );
}

// 5번 째 줄의 3번 째 요소
console.log(pascal(4, 2));
```
#### 1.16) 연속 제곱을 이용하고 단계수가 로그인 반복적 거듭제곱을 설계하라

#### 1.16A
```js
function isEven(n) {
  return !(n % 2);
}
function fast_expt_iter(a, b, n) {
  return n === 0 
          ? 1
          : n === 1
          ? a
          : isEven(n)
          ? fast_expt_iter(a, b ** 2, n / 2)
          : fast_expt_iter(a * b, b, n -1);
}
```

#### 1.17)  짝수를 절반으로 나누는 함수, 그리고 정수를 두배로 만드는 함수가 있다고 가정하자. 이를 이용해 증가차수가 로그인 곱셈함수를 설계하라

#### 1.17 A
```js
function halve(n) { return n / 2 };
function double(n) { return n * 2 };
function fast_multi_iter(a, b, r = 0) {
  return b === 0
          ? 0
          : b === 1
          ? r
          : isEven(b)
          ? fast_multi_iter(double(a), halve(b), r)
          : fast_multi_iter(a, b - 1, r + a);
}
```






