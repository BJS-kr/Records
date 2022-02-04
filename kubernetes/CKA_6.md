# Services
Enables communication between various components that in or outside of the application. Serivice helps to establish connectivity other applications or users regardless of front-end or back-end or other data source.
It's common use case is port forwarding. PODs are in the virtual network in the Node. so you can't reach to the POD through public IP and port.
At this point, Service comes in. Service listens to the certain port on the public IP that Node is running on and forward the request to the PODs.
This kind of Services called 'NodePort Service'.

# Service Types
1. NodePort
2. ClusterIP: The Service creates virtual IP inside the cluster to communicate between different Services.
3. Loadbalancer

## NodePort
NodePort is exposed port that we can access through, at the surface on the Node. Service has own IP address(so, it looks like an actual server in the Node. We call that IP a ClusterIP).
```YAML
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
# spec section difers to the specific type of Services like NodePort or ClusterIP or Loadbalancer
spec:
  type: NodePort
  ports: # yes, we can define multiple port forwarding
  - targetPort: 80
    port: 80
    nodePort: 30008 # NodePort range: 30000 - 32767. This will be automatically allocated if didn't configured. It is exposed port on surface of Node.
  # selector is significantly important in Services. Service can't specify the POD without selector.
  # selector selects by labels of the PODs metadata section, so if labels matches to multiple PODs, it forwards to multiple PODs.
  # There is no need of further configurations. It LoadBalances automatically if cloud service supports Native Load Balance for each of multiple PODs(Algorithm: Random, SessionAffinity: Yes).
  # Even if PODs removed or changed Services will automatically updated, what makes Services adaptive and flexible.
  selector:
    app: myapp
    type: back-end
```
After you set up Serivices, you can request through the Node's public IP address like 'curl http://192.168.1.2:30008'.

# CusterIP
Different parts of application needs to communicate between dffrent parts. like the back-end Nodes needs to communicate with the database Nodes, and the front-end Nodes needs to communicate with the back-end Nodes.
The problem is, those Nodes IP address will NOT static. Since you may run multiple Nodes on multiple parts so relations of those PODs will be very complicated, if you configure those connections with IP address, there will be a catastrophic disaster 'cause IP address of Nodes will be changed by each run.
Services provide single interface each of those parts.
```YAML
apiVersion: v1
kind: Service
metadata:
  name: back-end

spec:
  type: ClusterIP # ClusterIP is default type so if type is not configured, type will be ClusterIP
  ports:
  - targetPort: 80
    port: 80 # of course, you can expose same port number of target port number
  selector:
    app: myapp
    type: back-end
```

# Loadbalancer
How to acheive loadbalancing on multiple PODs? you can easily balance the loads using nginx or other things using running on VM, BUT it is tedious and will charge costs on any forms.
If a cloud service supports Native Load Balancer(It is not a special thing. most of cloud services supports this feature, including AWS, Azure, GCP and so on), you can type a Service 'LoadBalancer' that will automatically loacbalance your app.
```YAML
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
# spec section difers to the specific type of Services like NodePort or ClusterIP or Loadbalancer
spec:
  type: LoadBalancer # except loadbalancing, this type have same features with NodePort
  ports:
  - targetPort: 80
    port: 80
    nodePort: 30008
  selector:
    app: myapp
    type: back-end
```
# Practical Test
1. kubectl create -f service-definition.yml
2. kubectl get services
3. 
