# L4 LB
NAT(Network Address Translation)역할을 수행한다. 요청 수신시 목적지를 내부망 어딘가(밸런싱할 서버들 중 하나)로 변경한다. 마찬가지로 출발지도 자신으로 변경한다. 
이렇게 하면 WAS는 프록시 뒤에 숨을 수 있고 WAS는 요청 허용을 proxy하나로만 고정할 수 있어서 관리 용이 및 안전하다. 
또 한 TCP stream의 앞선 몇 개의 패킷만을 분석하면 분배가 가능하며 이어지는 패킷의 내용물에는 관심이 없다. IP와 PORT로만(L4니까 당연) 분배하기 때문이다. 
L4로드밸런서는 아예 전용된 하드웨어인 경우가 많다. 하드웨어를 구동할 소프트웨어야 존재하지만 기본적으로 하드웨어 의존적인 면이 훨씬 크다. 

L4는 이전 시대에 당연하게 여겨졌다. L7LB보다 저렴한 컴퓨팅 리소스로 가능한데다가, 애초에 application들이 훨씬 단순했기 때문에 보다 단순한 기준으로 LB가 가능했기 때문이다. 
그러나 현재는 기본적으로 컴퓨팅 파워가 비교할수 없이 강해졌고 어플리케이션도 복잡해졌다. 
L4가 여전히 L7 LB보다 가벼운 것은 맞지만 L7 LB에 필요한 자원이 추가된다고해서 유의미한 비용 증가가 아니게 된것이다.

# L7 LB
L7은 오늘날 거의 대부분의 상황에서 사용할 수 있다. 기본적으로 L7은 LB할 기준의 자유도가 굉장히 높다. 
여전히 IP, PORT를 기준으로 분배할 수도 있고, URL, Content, Headers 등 말 그대로 선택하는 대로다. 

# 그래서 proxy서버는 L4? L7?
일반적으로 reverse proxy로서 L7 LB를 제공한다(L4로도 사용은 가능하다).
아마 보통 reverse proxy에서 TLS도 검증할텐데, TLS검사가 가능하다면 Nginx로 따지면 아마 http block일 것이고 이는 L7 LB임을 의미한다(L7, http등).
반면 stream block이라면 TLS 검증 자체가 불가능하다. TCP stream을 검사하기 때문에 TLS까지 도달 조차 할 수 없기 때문이다.

# 예시(Nginx기준)
L4 LB: https://facsiaginsa.com/nginx/configure-nginx-as-layer-4-load-balancer
L7 LB: https://facsiaginsa.com/nginx/configure-nginx-as-layer-7-load-balancer
