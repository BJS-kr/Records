# Taints
To understand concept of taint, imagine a bug spray. In the summer night, vermins flies all around you to suck your blood. you are having a bug spray that safe on human's body, so you sparyed it on your body.
Some bugs are flew away but not all of them. Let's take this situation in to kubernetes. Nodes are people and PODs are bugs. 



Taints and Tolerations are used to restrict what PODs can scheduled on which Nodes. Taints are attribute of Nodes and Tolerations are attributes of PODs.
PODs are default to have no toleration if not configured. so if there is any taint on Nodes and only default PODs, none of PODs can approach to Nodes. 
but if POD have matching particular toleration for certain Node, that POD can reach to that Node. all these things are affects to Scheduler.

There are three taint-effect
1. NoSchedule: POD will not be schduled on the node
2. PreferNoSchedule: system will try to avoid schedule pod to node, but not guarantees
3. NoExecute: POD will not be scheduled and existing pods, if any, will be evicted if they are not tolerated to taint

example;

kubectl taint nodes node-name key=value:taint-effect: this command will be like,   
kubectl taint nodes node1 app=blue:NoSchedule

# Tolerations
if POD want to have tolerations, it can be achived using pod-definition.yml
tolerations below will be effective to command example above.
```YAML
...
spec:
  ...
  tolerations:
  - key: app
    operator: "Equal" # app "=" blue
    value: "blue"
    effect: "NoSchedule"
```

# Common Misunderstandable things
1. **Taints and Tolerations are NOT have any relations with security or intrusion**
2. **Taints and Tolerations are not 'DIRECTION', much more like 'EXCEPTION'. for example, if one of Nodes is tainted and one of POD tolerated to that Node. it does not mean that POD will go to the Node. that POD can go to any Nodes even if that POD is only can pass through the tainted Node. it doesn't matter because Taints and Tolerations are only EXCEPTION.**
3. **if you want to restrict certain POD to go certain Nodes, we need other approach, Node Affinity**
4. **Scheduler does not schedule any POD on Master Node. Technically, Master Node is also a Node but kubernetes taints the Master Node: NoSchedule. if you want to check out the tain on the Master Node, run 'kubectl describe node kubemaster | grep taint' 

# Practice Test
1. kubectl get nodes
2. kubectl describe node node01 | grep taint
3. kubectl taint nodes node01 spray=mortein:NoSchedule
4. kubectl run --image=nginx mosquito
5. adding toleration in pod definition file
6. kubectl taint node controlplane node-role.kubernetes.io/master:NoSchedule- -> remove NoSchedule taint from Master Node (-); so a POD can run on Master Node now
7. 
