# 1. TCP/IP
  
  TCP는 *패킷을 추적 및 관리
  
  참고 1) 패킷 통신이란?
  참고 2) LAN과 WAN
  참고 3) 이더넷이란?

# 2. IP

# 3. TCP
  패킷을 극복하기 위해!

# 4. OSI 7 계층과 TCP/IP 4 계층

<img src="https://media.vlpt.us/images/gparkkii/post/5b82f13c-e62f-4c37-afae-8059154b897b/F3C5A0A2-62C3-4BAE-8266-F9FFCFC2EBBF.png" width="70%" height="70%">

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

<img src="https://blog.kakaocdn.net/dn/csLXm8/btqzttm3Ntc/EMbBrxFEBmQ0jMsuXr64P0/img.png" width="70%" height="70%">  
TCP Flow
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcOn9Mu%2FbtqCLMk1DSM%2Fp6rV91JbfCa4I136YjyKik%2Fimg.png "width="40%" height="40%">  
UDP Flow
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdAFbbs%2FbtqCO0I111S%2Fed63wVTWv1KzUp5t7DSZ11%2Fimg.png "width="40%" height="40%">



References:  
[TCP vs UDP](https://mangkyu.tistory.com/15)  
[TCP/IP 개론](https://www.joinc.co.kr/w/Site/Network_Programing/Documents/IntroTCPIP)  
[인터넷 네트워크 : TCP/UDP](https://velog.io/@gparkkii/HTTPTCPUPD)  
[개알못을 위한 TCP/IP의 개념](https://brunch.co.kr/@wangho/6)  
[IP란 무엇인가](https://study-recording.tistory.com/7)  
[나무위키 IP](https://namu.wiki/w/IP)  
[나무위키 TCP](https://namu.wiki/w/TCP)  
[나무위키 OSI 7계층](https://namu.wiki/w/OSI%20%EB%AA%A8%ED%98%95)   

<img src="" width="100%" height="100%">
