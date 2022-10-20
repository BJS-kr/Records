# WebSocket의 정확한 원리

RFC 6455 WebSocket: [https://www.rfc-editor.org/rfc/rfc6455](https://www.rfc-editor.org/rfc/rfc6455)

***The protocol consists of an opening handshake followed by basic message framing, layered over TCP***

웹소켓이 TCP based이며 HTTP와 다르다고해서 HTTP가 아예 끼어들지 않는다고 착각해선 안된다. WS프로토콜은 즉시 체결되지 않는다. 연결시도는 평범한 HTTP Request-Response로 이루어진다. handshake가 성공적이라면 기체결된 HTTP Connection을 WS를 위한 Connection으로 활용하게 된다. 이 연결은 양 당사자가 종료해야함을 인지하는 시점에 해제된다.

ws혹은 wss 프로토콜을 명시하는 점을 제외하면 URI는 http혹은 https프로토콜을 명시하는 부분을 제외하고 완전히 같은 형식을 따른다.

```jsx
"ws:" "//" host [ ":" port ] path [ "?" query ]
```

scheme을 ws류로 명시하면 클라이언트와 서버 양측 모두 ws specification을 준수하여 통신하여야 한다. ws connection은 HTTP request, response를 **upgrade**하여 체결된다. 먼저 클라이언트가 명시하여야하는 헤더부터 살펴보자.

1. Connection: Upgrade
    
    보통 Connection 헤더는 현재 transaction이 종료된 후 연결 유지 여부를 결정하는데에 사용된다. 예를 들어 keep-alive값을 자주 사용하는 모습을 볼 수 있다. Upgrade는 **연결은 유지하되 현재의 프로토콜 외에 다른 것을 사용하겠다** 라는 의미이다.
    
2. Upgrade: websocket
    
    Upgrade를 요청했으니 무슨 프로토콜로 변경할 것인지도 명시해야한다. 이 경우, websocket이다.
    
3. Sec-WebSocket-Key: q4xkcO32u266gldTuKaSOw==
    
    일회성 값으로 클라이언트에서 16바이트 랜덤 값으로 생성되며, base64로 인코딩된 값이다.
    
4. Sec-WebSocket-Version: 13
    
    13 version외에는 모두 무효한 값이다.
    

위의 사항을 준수한 클라이언트의 요청은 예시는 다음과 같다.

```jsx
GET ws://example.com:8181/ HTTP/1.1
Host: localhost:8181
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: q4xkcO32u266gldTuKaSOw==
```

클라이언트는 서버의 응답이 돌아올때 까지 대기하는데, 이 때 서버의 응답 코드는 101 switching protocols이어야만 하며 다른 값은 무효하다. 이 응답 코드의 의미는 클라이언트가 보낸 Upgrade요청을 수락한다는 것이다.

```jsx
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fA9dggdnMPU79lJgAE3W4TRnyDM=
```

각 항목의 의미는 다음과 같다.

1. Upgrade
    
    upgrade 요청을 승인한다.
    
2. Connection
    
    upgrade 요청을 승인한다.
    
3. Sec-WebSocket-Accept
    
    이 값은 클라이언트가 보낸 Sec-WebSocket-Key nonce(암호화 임시값)과 고정 값인 “258EAFA5-E914-47DA-95CA-C5AB0DC85B11”을 concat한 후 base64로 인코딩하고 SHA1로 해싱된 값이다. 굳이 이런 과정이 필요한 이유는 서버와 클라이언트가 양측이 모두 ws를 지원하고 있음을 명시하기 위해서 이다. HTTP를 바탕으로 ws로 업그레이드하는 과정에서, 어느 한쪽이 여전히 HTTP연결이라고 착각하는 것을 방지하기 위해서 사용된다.
    

여기까지 완료되면 데이터를 전송할 준비를 모두 마쳤다.

# frame

보통 WS를 두고 framed protocol이라는 표현을 쓴다. 그 이유는 ws가 데이터 전송에 특정 형태의 frame을 사용하고, 데이터(payload)는 그 frame내부에 포함되어 있기 때문이다. 그 frame이란 다음과 같다.

```jsx
0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

frame의 각 부분에 대하여 간단하게 살펴보자. **더 자세한 내용은 RFC 6455에 서술되어 있다**.

### Fin Bit

WS의 첫 번째 Bit은 FIN으로 표시되어 있는 것을 볼 수 있다. 만약 이번 frame이 message의 마지막 data라면 set된다. 첫 번째 fragment라도 FIN을 표시할 수 있다.

### RSV1, RSV2, RSV3 Bits

항상 0이어야 한다. 정확히는 extension이 negotiated되어있지 않다면 0이어야 한다. 주의해서 사용해야 한다. non-zero value가 extension에 정의되어있지 않다면 즉시 커넥션 에러가 발생한다. extension은 client와 server가 handshake할 때 negotiated되어야 한다. 추가적인 용도를 위해 WS protocol을 확장하는 것이다.

### opcode

payload의 interpretation을 맡는다. unknown opcode를 receive할 경우 즉시 커넥션 에러가 발생한다. opcode의 종류는 다음과 같다.

1. 0x00
    
    이전 frame이 존재했으며, 이 frame은 이어지는 데이터임을 명시한다.
    
2. 0x01
    
    text frame임을 나타낸다. 서버는 text frame일경우 UTF-8로 decode한다.
    
3. 0x02
    
    binary frame임을 나타낸다. 별도의 과정 없이 그대로 서버에 전달된다.
    
4. 0x03~0x07
    
    추후의 non-control frame을 위해 reserve된다.
    
5. 0x08
    
    connection close를 나타낸다.
    
6. 0x09
    
    ping frame임을 나타낸다. connection이 유지되고 있음을 확인하기 위해 heartbeat를 시도하는 것이다. 수령할 경우, 반드시 pong frame으로 응답해야한다.
    
7. 0x0a
    
    pong frame임을 나타낸다. 0x09에 대한 응답이다
    
8. 0x0b~0x0f
    
    추후의 control frame을 위해 reserve된다.
    

### Mask

이 bit을 1로 set하는 것은 masking을 enable한다는 의미이다. WS의 모든 payload는 client가 선정한 random key(the mask)를 이용하여 난독화 된다. data는 먼저 XOR operation으로 masking key와 합쳐져 payload에 적재되게 된다. 이러한 masking은 WS의 frame을 cacheble하다고 misinterpreting하는 오류를 막아준다. 왜 WS data가 캐시되는 것을 막아야할까? 보안때문이다.

WS protocol을 개발할 때, 중간자(proxy 등)가 서버의 응답을 캐시한 후 이어지는 클라이언트의 요청에 cache hit으로 판단해 응답을 보내는 오류가 생겼다. 이를 두고 cache poisoning이라고 한다. 결국 WS는 기존의 infrastructures 위에서 함께 동작해야하기 때문에, 기존 구현은 변경되지 않은 채로 WS가 기존의 구현을 우회하는 것이 필요하기 때문에 Mask를 사용한다는 결론이다.

### Payload len

payload len과 extended payload length가 도식화 된 frame에 표시된 것을 볼 수 있다. payload의 total length를 encode하기 위해 사용된다. 만약 payload의 크기가 126bytes 이하라면 Payload len 항목에서 encode되고 이상이라면 extended payload length가 사용된다.

### Masking-key

Mask가 활성화 되어있을 경우, client가 server에게 전송하는 모든 frame은 무작위 32bit값으로 마스킹되어 보내진다. 그 무작위 값이 Masking-key이다. Mask bit이 1이면 Masking-key가 존재해야 한다.

### Payload data

arbitrary application data이다.

## Close handshake

closing frame(opcode 0x08)이 전송된다. 추가로, close frame은 close의 이유를 frame내에 가질 수 있다. close frame을 받으면 응답도 close frame이어야하며, 이 절차의 시작은 항상 server가 시작한다. close frame이 교환되고 나면 TCP connection이 종료된다.

## TCP socket vs WebSocket

위의 설명에서 느껴지듯이 WebSocket의 기능은 사실 일반적인 TCP socket에 WS protocol을 따르는 frame headers를 씌운 형태에 불과하다.  어디선가 WS의 message를 수신하는 곳에서 TCP chunks를 하나의 완성된 message로 reassemble한 후 handler를 invoke할 뿐이다.

## 왜 WS는 UDP대신 TCP를 사용하는가
(개인 의견입니다. 옳지 않을 수 있습니다)
1. WS의 message는 frame단위로 분리 될 수 있으며, reassemble하기 위해선 데이터 손실이 발생해서는 안된다. 데이터 손실 가능성이 있는 UDP는 적절하지 않다.
2. opcode 0x00을 고려했을 때, 이전 frame이라는 표현이 성립하려면 모든 frame이 순서에 맞게 수신되어야 한다. 순서를 보장할 수 없는 UDP는 적절하지 않다.
