# 1. TCP/IP
  
  TCP는 *패킷을 추적 및 관리
  
  ### 참고 1) 패킷(packet)이란?
  인터넷 내에서 데이터를 보내기 위한 경로배정(라우팅)을 효율적으로 하기 위해서 데이터를 여러 개의 조각들로 나누어 전송을 하는데 이때, 이 조각을 패킷이라고 합니다.

  ### 참고 2) LAN과 WAN
  
  ### 참고 3) 이더넷이란?

# 2. IP

# 3. TCP

## 패킷 교환
패킷 교환(Packet switching)은 컴퓨터 네트워크와 통신의 방식 중 하나로 현재 가장 많은 사람들이 사용하는 통신 방식이다. 작은 블록의 패킷으로 데이터를 전송하며 데이터를 전송하는 동안만 네트워크 자원을 사용하도록 하는 방법을 말한다. 정보 전달의 단위인 패킷은 여러 통신 지점(Node)을 연결하는 데이터 연결 상의 모든 노드들 사이에 개별적으로 경로가 제어된다. 이 방식은 통신 기간 동안 독점적인 사용을 위해 두 통신 노드 사이를 연결하는 회선 교환 방식과는 달리 짤막한 데이터 트래픽에 적합하다. 

데이터그램 방식에서는 개별 데이터는 발신지 주소, 목적지 주소가 추가되어 하나의 단일한 패킷이 된다. 이런 패킷들의 나열(sequence)는 차례로 목적지까지 보내지고, 목적지에서는 이런 패킷 나열을 다시 원본 파일로 재구성하는 작업이 이루어진다. 각 패킷은 개별적으로 경로가 제어(라우팅)된다. 

회선 교환망(전화)에서도 회선의 경로를 찾기 위해서 마찬가지로 경로제어를 수행한다. 그러나 회선교환 네트워크에서는 일단 경로가 설정되면 데이터를 패킷으로 나누지도 않고 개별적으로 경로를 제어하지도 않는다. 그저 이전 경로를 따라 지속적이고 안정적으로 전송한다.  

*데이터 그램 방식의 패킷 교환  

![패킷 교환](https://upload.wikimedia.org/wikipedia/commons/f/f6/Packet_Switching.gif)

# 4. OSI 7 계층과 TCP/IP 4 계층

<img src="https://media.vlpt.us/images/gparkkii/post/5b82f13c-e62f-4c37-afae-8059154b897b/F3C5A0A2-62C3-4BAE-8266-F9FFCFC2EBBF.png" width="70%" height="70%">

<OSI 7 계층>  
| 계층 | 설명 |
| --- | --- |
| | |
| | |
| | |
| | |
| | |
| | |
| | |
| | |

<TCP/IP 4계층>  
| 계층 | 설명 |
| --- | --- |
| 어플리케이션 계층(HTTP 등) | 사용자 응용 프로그램으로 부터 요청을 받아 이를 적절한 메시지로 변환하고 하위 계층으로 전달한다 |
| 전송계층(TCP, UDP) | IP에 의해 전달되는 패킷의 오류를 검사하고 통신 노드간의 제어 및 자료의 송수신을 담당한다 |
| 인터넷 계층(IP) | 통신 노드 간의 IP패킷을 전송하는 기능 및 라우팅 기능을 담당한다 |
| 네트워크 인터페이스 또는 데이터 링크 계층(LAN, 패킷 망) | 이더넷 카드 등으로 연결된 물리적인 네트워크들을 의미한다 |


# 5. TCP vs UDP  

## UDP란?  
User Datagram Protocol로 컴퓨터가 다른 컴퓨터와 데이터 통신을 하기 위한 프로토콜이다. 데이터 전달 및 순서가 보장되지 않지만 단순하고 빠른 작용을 한다.
IP와 거의 비슷하다. IP기능 + PORT, 체크섬 등만 추가되어있다.

## UDP는 왜 사용하는가?
TCP의 장점인 손실무효화는 실시간 스트리밍 서비스에서는 걸림돌로 작용한다. 전체 영상에서 점 하나 못 받은 것 때문에 버퍼링 돌린다고 재생이 중지되거나, 
혼잡제어를 위해 보내는 양까지 조절하기 때문에 영상 퀄리티가 안정적이지 못했다. 결국 이를 해결하기 위하여 제시된 것이 UDP이다.

매커니즘이 정해져있어서 손을 댈 수 없는 TCP 기반을 더 최적화 하고 싶을 때, TCP는 그대로 두고 UDP를 이용해서 어플리케이션 레벨에서 만들어내면 된다.

### 참고) 흐름제어(Flow Control)와 혼잡제어(Congestion Control)이란?

흐름제어는 데이터를 송신하는 곳과 수신하는 곳의 데이터 처리 속도를 조절하여 수신자의 버퍼 오버플로우를 방지하는 것입니다. 예를 들어 송신하는 곳에서 감당이 안되게 데이터를 빠르게 많이 보내면 수신자에서 문제가 발생하기 때문입니다. 혼잡제어는 네트워크 내의 패킷 수가 넘치게 증가하지 않도록 방지하는 것입니다. 만약 정보의 소통량이 과다하면 패킷을 조금만 전송하여 혼잡 붕괴 현상이 일어나는 것을 막습니다.

<img src="https://blog.kakaocdn.net/dn/csLXm8/btqzttm3Ntc/EMbBrxFEBmQ0jMsuXr64P0/img.png" width="70%" height="70%">  
TCP Flow
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcOn9Mu%2FbtqCLMk1DSM%2Fp6rV91JbfCa4I136YjyKik%2Fimg.png "width="40%" height="40%">  
UDP Flow
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdAFbbs%2FbtqCO0I111S%2Fed63wVTWv1KzUp5t7DSZ11%2Fimg.png "width="40%" height="40%">


# References:  
[TCP vs UDP](https://mangkyu.tistory.com/15)  
[TCP/IP 개론](https://www.joinc.co.kr/w/Site/Network_Programing/Documents/IntroTCPIP)  
[인터넷 네트워크 : TCP/UDP](https://velog.io/@gparkkii/HTTPTCPUPD)  
[개알못을 위한 TCP/IP의 개념](https://brunch.co.kr/@wangho/6)  
[IP란 무엇인가](https://study-recording.tistory.com/7)  
[나무위키 IP](https://namu.wiki/w/IP)  
[나무위키 TCP](https://namu.wiki/w/TCP)  
[나무위키 OSI 7계층](https://namu.wiki/w/OSI%20%EB%AA%A8%ED%98%95)  
[패킷교환](https://ko.wikipedia.org/wiki/%ED%8C%A8%ED%82%B7_%EA%B5%90%ED%99%98)

<img src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Packet_Switching.gif" width="70%" height="70%">
