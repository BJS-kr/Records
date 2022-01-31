# Namespaces
It's quite easy to understand cause this concept is compatible with Typescript namespaces. Since namespace is seperated space, 
even if some member's names are same with other members under diffent namespace, perfectly divided those members without confilict.
you can call member by just name under same namespace, but if you are at outside the namespace that a memeber you want to call, you have to call it by
namespace and name. this is obvious thing so there is no need of further explanation.

If you run Kubernetes without Namespace configuration, it will be running on Default Namespace. There are two more Namespaces that Kubernetes create automatically.
First, Kube-System: Kubernetes Object set of PODs or Networking Solutions or DNS Services etc. for internal purpose will be put in to this Namespace to be isolated from users.
Second, Kube-Public: resource that available with all users

If your service is small, you don't have to worry about Namespaces. it will be enough with Default Namespace. but as your service grows, you may consider the other Namespaces.
Typical Namepace strategy is Dev, Prod etc. 

Don't misunderstand about relationship between Namespaces and Nodes. Each Nodes are not seperated by Namespaces. Namespaces can share Nodes but just amount of capacity each namespaces were allocated.
![Namespace](https://user-images.githubusercontent.com/78771384/151840136-4f1de9d0-309b-483d-9c68-1b92c12e01d2.png)

Let's take a look how DNS system works. if you calling another Namespace member, you have to call it like this: *mysql.connect("db-service.dev.svc.cluster.local")*
while you can call same service simply like *mysql.connect("db-service")* under same Namespace. DNS follows order : ServcieName.Namespace.Type.domain

if you run a command like 'kubectl get pods', will bring pods in Default Namespace. if you want to check resources in specific Namespace, you can run a command like 'kubectl get pods --namespace=kube-system'.
namespace can be configured in resource-definition YAML file under 'metadata' section(I'm not talking about Namespace definition file. I mean metadata section in like POD-definition). 

# Examples for create Namespace
1. using file  
```YAML
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```
kubectl create -f namespace-dev.yml  

2. using command only  
kubectl create namespace dev

# Switch
You can get what you want by append --namespace=Namespace option but, this is disturbing. you can change your context into another Namespace.
Run command like 'kubectl config set-context $(kubectl config current-context) --namespace=dev'. After you executed those commands, Namespace 'dev' will act like 'Default'.

# Resource Quota
This is for configuration about allocating computing power of Nodes. you can define this configuration by YAML file like 'Compute-quota.yaml'.
```YAML
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    pods: "10"
    requests.cpu: "4"
    requests.memory: 5Gi
    limits.cpu: "10"
    limits.memory: 10Gi
```

# Practical Test
1. kubectl get pods --all-namespaces
2. kubectl get ns
3. kubectl get pods --namespace=Namespace
4. kubectl run Name --image=Image -n Namespace -> create pod in specific Namespace
