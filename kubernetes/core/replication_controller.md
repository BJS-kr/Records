# Replication Controller
what if some reson our pod crashed? it would be a disaster if you running a single pod. but if there are another pods that identically same with original pod,
your service would still be on running. like this way, you can increase your app's 'High Availability'.

but even if you running a single pod, Replication Controller is still helpful because it will execute remedies immediately. Replication Contoller's duty is 
maintaining. regardless how many PODs to be maintained, Replication Controller will always guarantee exact number of PODs are running as much as you want.

another goal of Recplication Controller is Load Balancing and Scaling. huge benefit of Replicaton Controller is availability across Nodes. 
yes, Replication Controller can load balance even if PODs are on different Nodes. 


example of Replication Controller definition file : rc-definition.yml
```YAML
apiVersion: v1
kind: ReplicationController
metadata: 
  name: myapp-rc
  labels:
    app: myapp
    type: back-end
spec:
  template: # PODs defined under template
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        type: back-end
      spec:
        containers:
          - name: nginx-container
            image: nginx
  replicas: 3 # replicas is same level on template
```

# Replica Set
example of Replica Set definition file : replicaset-definition.yml
```YAML
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-replicaset
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

# Scale
how can we scale the PODs for the future needs? here are some different ways.

1. update the number in definition file and run 'kubectl replace -f replicaset-definition.yml'
2. run 'kubectl scale --replicas=6 -f replicaset-definition.yml' -> will not update your definition file
3. run 'kubectl scale --replicas=6 rs(type) myapp-replicaset(name in metadata)' -> will not update your definition file

# Practical Test
1. kubectl create -f rc-definition.yml
2. kubectl get rc(alias for replicationcontroller) -> after run command, run 'kubectl get pods' will show you copied pods are running
3. kubectl get rs(alias for replicasets)
4. kubectl delete rs myapp-replicaset -> also deletes all underlying PODs
5. kubectl replace -f replicaset-definition.yml
6. kubectl scale --replicas=NUMBER OPTIONS
7. kubectl edit rs -> this command is for edit existing running rs. you have to delete existing PODs to run newly configured PODs!
