# jwt의 원리
당사자간에 JSON Object를 안전하게 주고 받기 위하여 고안되었습니다(RFC7519). 그러나 이를 정보의 안전이라고 혼동해선 안됩니다. JWT는 누구나 decode하여 payload의 내용을 볼 수 있습니다.
jwt는 header, payload, signature로 이루어져있습니다. header에는 토큰에 대한 metadata가 저장되어있고 payload는 우리의 데이터가 encode되어 토큰에 삽입된 부분입니다. 그래서 데이터를 많이 넣으면 많이 넣을수록 jwt의 크기도 커집니다. header와 payload는 단순한 문자열로 'encode'되어있고 'encrypted'는 되어있지 않습니다. 그렇기에, jwt에 민감한 정보를 넣는 것은 금기시됩니다.

그러나, signature부분 덕에 우리는 jwt를 안전하게 사용할 수 있습니다. signature는 header와 payload 그리고 secret을 참조하여 만들어집니다. 이를 두고 'signing the jwt'라고 합니다. sign하는 algorithm은
header와 payload와 secret을 모두 참조하여 unique signature를 생성해내기 때문에, secret or private key가 노출되지 않는 이상 signature를 똑같이 만들어낼 수가 없는 것입니다. hash function을 통해 예상되는 jwt동작을 구현하려면 hash function에 두 가지 전제 조건이 필요합니다. 첫 번째, 한 가지 방식으로만 동작할 것. 두 번째, input이 같다면 output이 같을 것, 이 두 가지 입니다. hash를 통해 동작하는 가장 흔한 jwt의 구현은 HMAC SHA-256과 ECDSA256입니다. 

이와 같은 과정을 거쳐 생성한 토큰을 클라이언트로 보낸 후엔 어떻게 권한을 확인할까요? header에 있는 algorithm정보와, payload에 있는 데이터, 그리고 서버에서 비밀스럽게 간직하고 있는 secret key로 encrypt하여 test signature를 만들어냅니다. 이제 클라이언트로부터 받은 original signature와 test signature 비교하여 완전히 일치하면 올바른 토큰인 것입니다. 

당연하게도 secret key 혹은 private key가 충분히 안전하지 않다면 jwt는 공격에 굉장히 취약해지므로, 긴 무작위의 문자열을 사용하는 것이 좋습니다. 일반적으로 이런 문자열을 생성할 때 제 3자가 작성했거나 노출된 모듈로 생성하는 것은 권장되지 않는데, 코드 자체가 이미 예상되는 결과의 범위를 크게 좁혀주기 때문입니다. 원시적이지만 키보드로 아무 문자열이나 마구잡이로 쳐내려가거나 무작위성을 확실히 보장하는 프로그램을 써야합니다. 권장되는 HS256의 최소 secret 길이는 32byte입니다. 또한, HS256은 CPU를 그리 많이 사용하지 않는 다는 점에서 강점이 있습니다. 

HS256이 symmetric인 것에 비해 ES256은 asymmetric합니다. ES256의 private key는 jwt를 create or verify할 수 있지만, public key는 오직 verify만 가능합니다. 이 public key가 JWK에 저장됩니다. 왜 이런식으로 해야할까요? 이는 클라이언트가 직접 jwt의 verify를 실행할 수 있다는 점에서 큰 강점을 지닙니다. 물론 private key는 서버에서 잘 보관되고 있어야 합니다.

그렇다면 언제 HS 혹은 ES를 선택해야할까요? 서버와 웹 페이지를 표시하는 작업이 하나의 머신에서 작동중이라고 생각해봅시다. 아마 HS가 더 유리할 겁니다. JWT가 다른 머신 간에 네트워크를 타고 전송될 필요가 없으므로 CPU사용률도 낮고 JWK도 딱히 필요하지 않으니까요. 반면, front-end 가 back-end와 다른 머신을 사용한다고 생각해봅시다. 같은 효용을 가진다면 매번 jwt를 서버에 보내 검사를 맡을 필요가 있을까요? 물론 발행은 서버에서 하지만, 유효성 검사는 front-end해서 해도 상관이 없으니 말입니다.

이런 이유들로 인해, RFC에서는 ES256을 recommend+ 로 표기하고 있습니다.

public key를 JWK에 저장한다고 언급했었습니다. 사실 JWK에는 여러개의 public key를 저장할 수 있는데, 이를 두고 JWK Set이라고 합니다. 



# secret과 privatekey의 차이?
symmetric한 encryption에는 secret key라는 말을 사용하고, asymmetric할 때는 private key라는 말을 사용합니다. asymmetric할때는 구현이 좀 더 복잡합니다. public key와 private key가 모두 존재하기 때문입니다. 참고로 jsonwebtoken 패키지는 algorithm으로 HS256, PS384, RS512, ES256등의 알고리즘을 사용할 수 있습니다. 이런 알고리즘은 보통 JWA(Json Web Algorithm)으로 불리며, JOSE(JavaScript Object Signing and Encryption)에 속합니다. 알고리즘 이름의 영문 부분은 signature algorithm family이고 숫자부분은 hashing algorithm입니다. 예를 들어 RS 256이라면 RS는 RSASSA-PKCS1-v1_5를 의미하고, 256은 SHA-256을 말합니다. 이런 알고리즘들은 [RFC 7518](https://datatracker.ietf.org/doc/html/rfc7518)에서 찾아볼 수 있지만, jwt가 지원하는 모든 알고리즘은 [JOSE IANA registry](https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms)에서 찾아보실 수 있습니다. 참고로 SHA-256, SHA-384, SHA-512는 대부분의 JWA에서 지원하며, 숫자는 hash의 길이를 의미합니다. 예를 들어 256이면 256bit 해시이고, 512면 512bit 해시입니다. 또한 그 결과는 길이는 숫자와 일치합니다. hash란 이 결과값을 말합니다. 보안 정도는 hash 길이의 절반으로 평가됩니다. 예를 들어, 256 hash면 2^128의 경우의 수를 제공하기 때문입니다. 보통 SHA-256정도면 충분히 안전하다고 여겨집니다. 실제로 RFC 7518에서도 256을 사용하는 알고리즘을 추천하고 있습니다. 위에서 언급한 256, 384, 512는 모두 SHA-2 family이며, SHA-1은 사용해선 안됩니다(매우 취약). 

오해하면 안되는 것이 있습니다. SHA-256정도면 충분히 안전하다고 여겨진다고 언급했는데, 이는 상황이 단순한 sign이기 때문입니다. 컴퓨터 성능의 증가와 병렬처리 기술의 발전(특히, GPU를 이용한 brute force)에 따라, SHA 알고리즘은 취약성이 크게 증대되었습니다. [혹자는 SHA-1과 SHA-512도 큰 차이가 없다고 판단](https://security.stackexchange.com/questions/52041/is-using-sha-512-for-storing-passwords-tolerable) 할 정도입니다. 상황에 따라 안전하고 안전하지 않고는 달라진다는 것을 고려하시기 바랍니다.

[간단한 SHA-1과 SHA-2의 차이](https://www.geeksforgeeks.org/difference-between-sha1-and-sha2/)도 궁금하시면 살펴보시기 바랍니다.
# JWT, JWS, JWE, JWA, JWK의 차이점
먼저, JWT는 사실 JWS 혹은 JWE를 합쳐 부르는 것입니다. JWS는 JSON Web Signature, JWE는 JSON Web Encryption을 이릅니다. 놀랍게도, JWE는 데이터를 들여다볼 수 있는 당사자를 지정할 수 있습니다. 상술한 내용과 모순이지요? 분명히 JWT는 누구던지 decode해서 내용물을 확인할 수 있다고 말했었으니 말입니다. JWK는 JSON Web key의 약어로, hash function의 key를 JSON형태로 저장하는 곳입니다. 보통 public key를 가지고 있습니다(그러니까 asymmetric). JWS는 가장 흔한 형태의 JWT입니다. 아마 어떤 개발자는 JWS만 계속해서 사용해왔을 수도 있습니다. 우리가 흔히하는 header(JOSE header), payload, signature 구조가 JWS입니다. 누구나 decode해서 내용을 볼 수 있다는 말은 즉 정확히 말해 JWT가 아니라 JWS에 해당되는 말입니다. 그러나 대부분의 JWT 구현이 JWS이므로 누구나 내용을 볼 수 있다는 말이 널리 퍼지게 된 것입니다. 그런데 조금만 더 정확한 표현을 사용해봅시다. 사실 decode해서 내용을 볼 수 있다는 말은 사실입니다. 장난치는 것 처럼 보일 수도 있지만, 이는 철저히 용어의 문제입니다. 상술했듯, 우리가 jwt에서 얻을 수 있는 정보는 header와 payload에 집중되어있으며, 이는 encryption이 아니라 encode라고 언급한 바 있습니다. encode이기 때문에 decode이고, JWE는 encrypt이기 때문에 decode가 아니라 decrypt입니다. 그러므로 decode하면 항상 내용을 볼 수 있다는 표현은 어찌보면, 맞을 수도 있는겁니다.

JWS의 간단한 header를 decode해보면 아래와 같은 결과를 얻을 수 있습니다.
```json
{
  "alg": "HS256",
  "kid": "2022-05-01"
}
```
kid는 JWK에서 추가설명하기로하고, alg는 위에서 언급했으니 생략합니다. 참고로 alg만 필수입니다.

다음은 payload를 decode한 예시를 살펴봅시다.
```json
{
  "sub": "1234567890",
  "name": "BJS",
  "iat": 1651422365
}
```
name은 직관적이지만 sub와 iat는 뭘까요? payload에 포함할 수 있는 명세에 따른 prop들을 JWT claims라고 보통 표현합니다. JWT claims는 세 종류가 있습니다. Registered, Public, Private이 그것인데, 위의 예시에서 표시되고 있는 sub는 claims는 Registered입니다. 대표적으로
* iss (Issuer): 발행자
* sub (Subject): JWT를 요청하는 user id(subject)
* aud (Audience): consumer를 명시
* exp (Expiration): 만료 기한

등이 있습니다. 이게 전부는 아니며 전체 리스는 [이곳](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1) 에서 찾아볼 수 있습니다.

다음은 Private입니다. 위의 예시에서는 "name" claim입니다. 예상하신 분도 계시겠지만, Private은 creator혹은 consumer의 재량에 따라 정의할 수 있습니다. 정의가 자유로운 만큼, 이미 명세에 올라가 key값과 겹치지 않도록 주의가 필요합니다.

마지막으로 Public입니다. 마지막인데 김 빠지는 얘기지만, 사실 Public claims는 흔히 사용되진 않습니다. 전체 Public claims는 [이곳](https://www.iana.org/assignments/jwt/jwt.xhtml#claims)에서 찾아보실 수 있는데, 그저 IETF를 통해 등록된 claim이라는 의미 외엔 없습니다. 사용하실 의향이 있으실 때 참고하셔서 구현하시면 됩니다.

그렇다면 JWE는 어떨까요? 사실 JWE는 생략하고자 합니다. JWE의 구현 사례가 거의 없을 뿐더러 현대의 인터넷은 TLS 통신이 일반화 되어 있어 JWE의 의미가 많이 퇴색되기 때문입니다. JWE가 궁금하신 분은 RFC를 읽어보시는 것을 강추합니다.