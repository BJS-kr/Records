# 상식
application proxy: application이 의미하는 바는 user mode라는 것이고, user mode라면 proxy process가 socket을 통해 연결을 받았다는 뜻이고, socket이라는 것은 stream data라는 뜻이다. 

inline + out of path proxy: 커널 중 IP영역에 관여하므로 packet에 관여하는 것이 자명.
# 활용
### 1. 우회
요청 당사자가 목적지에 도달하려고 할 때, 프록시를 통해 우회한 후 도달하게 되면 송신자는 이 요청이 마치 프록시에서 전송된 것 처럼 인식하게 됨. Tor 프로젝트가 대표적인 예인데, 모든 요청을 프록시를 거쳐서 전송시켜 요청자의 정체를 항상 숨겨줌. 해킹에도 좋은 수단인데, 해커의 위치를 숨기기 위해 프록시를 통해 공격할 수 있음. 근데 문제는, 자신의 정체가 숨겨지는 것은 좋은데 내 요청이 프록시를 통해 가는 순간 프락시는 소켓에 오가는 모든 정보를 감청할 수 있게 됨. VPN도 우회의 개념이 있으나 보통 Proxy는 Web수준(보통 HTTP)의 우회고 VPN은 Network수준의 우회임.

### 2. 분석
평문으로 전송하면 모든 정보가 노출되므로 SSL을 붙여서 HTTPS로 보호하는데, SSL로 암호화 되는 계층이 Socket 수준(User mode)이다보니 요청이 IP계층까지 내려왔을 땐 이미 헤더를 제외한 모든 정보가 암호화된 상태라 wire shark등을 통한 패킷 분석(자신의 패킷 분석도 중요한 부분임. 특히 어플리케이션의 크기가 커질 수록)이 어려워짐. 그렇다면 Socket수준으로 돌아가서 암호화가 되기 전에 분석하는 방법을 쓰게 되는데, Proxy가 SSL을 대행하게 되고 WAS와 Proxy간의 소켓 연결은 평문으로 이뤄지게 만들면 데이터 분석도 가능하고 암호화도 가능한 형태를 만들 수 있다.

### 3. 감시 및 보호
이해를 위해 가상의 네트워크 환경을 상상해보자. 3.3.3.x대역이 존재하며, Router가 게이트웨이로써 1번을 사용하며 3.3.3.1을 가진다. 이후 엔드포인트들은 3.3.3.2~ 의 주소들을 할당받은 상태라고 하자. 그리고 엔드포인트중 어딘가에 프록시가 존재하는데, 프록시의 주소는 3.3.3.100이라고 가정한다. 그리고 모든 PC들은 그 3.3.3.100의 프락시를 사용한다.

이 상태에서, 3.3.3.2 host가 악성코드가 존재하는 사이트에 연결을 시도한다고 가정하자. 그렇다면 그 요청은 3.3.3.100으로 일단 간 후 다시 악성 사이트에 연결될 것이다. 그리고 악성 사이트가 보내는 응답 또한 다시 프락시로 되돌아오게 될 것이다. 
그렇다면 호스트에 도달하기 전 프락시에서 악성 코드 유입을 막을 수 있다.

이런 식의 프록시는 Virus Wall로 부를 수 있다. 또한 3.3.3.x 대역에 포함된 모든 컴퓨터는 프록시를 통해 접속하므로 프록시 관리자는 무슨 요청이 들어오는지도 감시할 수 있다. 이런 식의 구현은 특히 사내 인터넷과 같은 곳에 많이 사용되는데, 예를 들자면 회사원 A씨가 업무시간에 Bitcoin거래소에 접속하는 것을 볼 수 있다던가 하는 것이다. SSL은 프락시가 대행하므로 요청내용도 모두 평문으로 감시할 수 있다.
이걸 생각해보면, 프락시는 꽤 위험하다. 특정 요청에 대해 그 요청을 원래 목적지로 전달하는 대신 자신이 대신 가짜응답을 보내는 것도 가능하기 때문이다. 아니면 각 호스트들의 인터넷에 대한 접근 자체를 제어해버릴 수도 있다. 이런식으로 프락시가 위치하는 structure자체를 이해하고 있으면 매우 다양한 방식으로 프락시를 활용할 수 있다. 

### 4. Reverse proxy
1~3번의 공통점이 무엇일까? 바로 프락시가 클라이언트의 요청을 대리하고 있다는 점이다. 일반적으로 프락시라고 하면 1~3번과 같은 형태를 일컫는 말이며, 이를 forward proxy라고 한다. 그런데, 요청을 받는 입장에서도 proxy를 둘 수가 있다. 그러니까, 클라이언트와 서버의 사이에 proxy가 위치해있는 것은 맞는데 proxy가 클라이언트 대신 서버를 대리하는 것이다. 그리고 Reverse Proxy가 있다면 아마 WAS에는 직접 접근할 수 없을 것이고 Proxy를 통해서만 접근이 가능하며 Proxy와 WAS사이의 경로는 Private할 것이다. 이 Proxy도 요청대리이므로 당연히 보호와 감시의 역할을 수행할 수 있다. 이 때, Proxy가 공격을 식별하고 차단할 수 있다면 이를 WAF(Web Application Firewall)이라고 부른다. WAS와 혼동하지 말자.
WAF의 중요한 특징은 감시 트래픽의 단위가 Packet이 아닌 Socket stream이라는 것이다(L7 HTTP(라고 가정하면 TCP기반)->Socket->application proxy니까 당연). 이런 구조가 좋은 점은 특히 대량의 트래픽을 받기 쉬운 상황에서 유리한데, 예를 들어 파일업로드가 가능한 서버라고 가정하면 해커가 악성 파일을 업로드하는 것을 방지하기 위해 파일 내용을 검사해야하는데, 파일의 크기가 커짐에 따라 이를 서버에 모두 맡기면 서버의 부하가 매우 커진다. 수백메가바이트 혹은 몇 기가 바이트의 파일을 떠올려보자. 이런 처리를 프락시 컴퓨터가 대신 하는 구조는 매우 일반적이며, WAF는 필수개념이다.

## socket 보충설명
윗 문단에서 Socket이니까 stream일 것이라는 언급을 했다. 사실 이는 정확하지는 않은 표현으로, 모든 Socket이 Stream socket은 아니며 Stream socket이라면 아마 TCP연결일 것이다. 일단 Socket이 File인 것을 다시 마음에 새긴채로 시작해보자. 

### 1. Stream socket
TCP 프로토콜에 합당한 구현을 가진다. stream socket은 Record length나 character boundary가 없는 bidirectional한 소켓이다. 이 개념은 사실 위험한 방법인데, 보통 프로세스간 데이터를 전달할 땐 먼저 데이터 길이를 보내고 그 후에 데이터를 보내는 것이 수신 완료 확신이나 read/write순서를 정하기 쉽고 안전하기 때문이다. 가장 쉽게 예상되는 문제는 stream socket에 read와 write를 동시에 실행하는 시나리오다. 물론 application 자체를 stream의 예측할 수 없는 행동을 방어할 수 있도록 짤 수도 있겠지만 그런 노고를 매번 반복한다는 것은 말도 안되는 일이다. 그래서 burden of tranferring을 reliably 하게 맡길 수 있는 존재가 TCP다. stream socket 자체는 record boundaries가 없지만 TCP덕분에 application은 별 다른 노고 없이 맡길 수 있다는 것이다. 이는 TCP처리는 Kernel에 구현되어있고 Socket은 User mode에 존재한다는 사실을 알고 있어야 이해가 가능한 부분이다. nodejs의 duplex stream을 떠올려보자. stream에 read/receive할 수 있고, 반대로 write/send도 할 수 있다. TCP/IP 프로토콜에 따라 sequenced & unduplicated하게 통신할 수 있으며, 대량의 데이터 전송도 문제없이 처리할 수 있다. 

transport layer에서 데이터를 합치던 쪼개던 해서 합리적인 크기의 packet으로 만들어 전송한다. 윈도우에선 CSocket 클래스가 packing 혹은 unpacking을 담당한다.

stream은 명시적 연결을 통해 동작한다. 즉, 연결을 시도하면 상대방이 명시적으로 수락해야만 성립하는 것이다. 이런 특성 때문에 거의 모든 통신, 특히 FTP같은 것에 적합한데, 데이터를 온전히 보존하고 중복이 없는 특징때문이다. 가장 많은 곳에서 Stream socket이 사용되고 Socket하면 기본적으로 Stream을 떠올리는 이유다.

### 2. Datagram Socket
UDP 프로토콜에 합당한 구현을 가진다. Dgram Socket은 데이터가 유실되거나, 중복될 수 있으며 sequential하게 전달하지도 않는다. 데이터 전송마다 연결을 확인하지도 않는다. 그래서 보통 connectionless service라고 표현한다. Datagram의 데이터는 독립적인 Packet들이다. 데이터그램의 사이즈는 디폴트로 8192bytes로 설정되어있고 최댓값은 65535bytes다. 

### 3. Raw
IP/ICMP에 합당한 구현을 가진다. raw socket은 lower layer protocols에 직접 접근을 가능케 한다. IP나 ICMP같은 것들이다. 이 인터페이스는 새로운 프로토콜을 구현할 때 테스트용으로 주로 사용되는데, socket interface를 extend하거나 어떤 서비스를 위한 새로운 형태의 socket을 정의할 수 있기 때문이다. 예를 들어, Transaction-type socket을 VMTP(Versatile Message Transfer Protocol)에 맞춰 정의할 수 있는데 이는 TCP/IP에서는 지원되지 않는다.

### 비교
- 스트림 소켓은 가장 신뢰성이 높다. 신뢰성이 중요하지 않거나, 애플리케이션의 신뢰성이 socket interface의 신뢰성과 관련이 없을 때(대표적인 예로 비디오 스트리밍 플랫폼)Datagram Socket이 적합하다.

- 오버헤드는 신뢰성 확보, flow control, connection maintenance에서 주로 발생하므로 Datagram socket이 Stream socket보다 효율이 좋을 수 밖에 없다.

- Datagram socket은 1회 전송량에 제한을 두고 있다. 만약 1회 전송에 2048bytes 이하의 전송량이 요구되면 Datagram을 이용해도 된다. 더 높다면 stream socket을 사용하는 것이 권장된다. (풀리지 않은 의문: Datagram의 한계는 기본적으로 8192bytes나 되는데 왜 2048bytes가 넘으면 stream socket을 사용하라고 하는가?)

**머릿속으로 Stream도 데이터 여러번 보내는 것 아닌가? 라고 생각하고 있었는데 Datagram과 비교해보니 여러번 전송하는 것 자체는 맞더라도 한 번의 전송 내에서 쪼개서 보내는 것과 Datagram처럼 아예 나눠서 보내는 것의 차이가 느껴진다**

# 출처
https://www.ibm.com/docs/en/zos/2.1.0?topic=concepts-introducing-tcpip-selecting-sockets

https://learn.microsoft.com/en-us/cpp/mfc/windows-sockets-stream-sockets?view=msvc-170


