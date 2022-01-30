# POD
Kubernetes's ultimate goal is to deploy application in the form of containers on the set of machines. configured worker nodes in the cluster.
but kubernetes does not deploy directly containers in the worker nodes. the containers encapsulated into a kubernetes object known as POD.
a POD is single instance of application, smallest object you can create in Kubernetes.

for example, if you want to deploy more instance(your webserver) to share the massive load, you do not create container in the same POD, you have to create another POD in Worker Node(multiple PODs can run in same Node).
if you need more capacity than a single Node, you can also create new Node and same POD in the new Node.

PODs usually have OneToOne relation with a container. 'usually' means this is not restricted. you can make 'Multi-Container POD'.
But this does NOT mean you can run same container in a single POD. this means you run kind of combination of containers(like app container and supportive container) in a POD, since they are sharing same network in a single POD(yes, even a POD have it's own network inside. they refer each others as localhost).
you may think POD is complexed thing than running a single containers like 'docker run ...' but this is not true. if you have to deploy all the combinations by run each containers, it may cause waste of times and mistakes.
you can simply deploy pre-configured sets safely and easily by using PODs.

you can deploy PODs by using Kubectl(so called 'kube control'). if order a 'run' command to Kubectl, it will automatically make POD and deploy instance of container image inside.
Kubectl can lists the PODs by using 'get pods' command.

Kubernetes uses YAML for creating objects, so the POD is, known as 'pod-definition.yml'. 
here's the important configurables.

1. apiVersion: this will vary by what kind you using. if you want to configure POD or Service, it will be 'v1'. if you want to configure Replica set or Deployment, it will be 'apps/v1'
2. kind: type of object. in this case this will be 'Pod'
3. metadata: name, labels, type, ... etc. it's very useful to filter and specify from various kinds of PODs you are running.
4. spec: it includes list of containers(name and image) you want to run

after you complete to write pod-definition.yml, you can create POD using 'create' or 'apply' command like 'kubectl create -f pod-definition.yml'
'describe' command is also useful. it will show you details of a POD. run it like 'kubectl describe pod myapp-pod'.

# Practical test
it wasn't easy.. here the commands I used

1. kubectl create [.yml] <- needs to be defined
2. kubectl run [NAME] --image=IMAGE_NAME
3. kubectl get pods
  -> show us brief info of containers like READY state
  -> -o wide: show extra info like Node of pod on etc
4. kubectl explain RESOURC
5. kubectl describe pods
6. kubectl describe pod POD_NAME 
  -> very important to troubleshoot. we can figure it out why some failiure was occurred using the informations of 'events' section. show detail of the pod and containers inside.
7. kubectl delete pod POD_NAME 



