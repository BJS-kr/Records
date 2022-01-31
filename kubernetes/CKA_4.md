# Deployments

Deployment is important part because probably you are gonna deploy multiple instances(reason for learning kubernetes) and if your app is updated in
Docker registry, running instances should be updated as well. but you do NOT want update your instances all at once. because while restart all your servers,
users gonna have trouble to access. from these points, updating your instances should proceed seamlessly and phasely. in addition, if your updated version crashes, Kubernetes helps you to roll-back your app to previous version. 

All these capabilities are available in Kubernetes Deployments.

You are gonna deploy your multiple instances in multiple PODs, that are in Replica Sets. Deployment have higher hierarchy than Replica Sets(so RS is a part in Deployment). 

# Deployment Definition Example
```YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
    type: back-end
spec:
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        tier: back-end # this line should exactly matches with 'tier' under selector/matchLabels
      spec:
        containers:
          - name: nginx-container
            image: nginx
   replicas: 3
   selector:  # this is major difference from Replication Controller. if selector matches to the PODs, regardless the PODs were created before Replica Set created, it also manages those PODs.
    matchLabels:
      tier: back-end
```

# Practical Test

1. kubectl create -f deployment-definition.yml
2. kuberctl get deployments 
   -> if you command 'get rs', you are gonna get running rs under Deployment name. also, if you command 'get pods' you can see pods running under Deployment name 'cause rs are for running PODs after all(deployment -> rs -> pods).
3. kubectl get all -> get all deployment, rs, pods
4. kubectl create deployment httpd-frontend --image=httpd:2.4-alpine  --replicas=3 --dry-run=client -o yaml > httpd-deployment.yaml
  -> create yaml file based on options
  -> if without part '> httpd-deplyment.yaml' it will stdout a yaml text

# Important Tips! (How to not waste your time to create each YAML files)
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/learn/lecture/14937836#overview
