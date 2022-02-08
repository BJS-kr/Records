# Selectors
assume that you are running multiple Nodes. the Nodes have distinctive features such as CPU, MEM etc. and you may also want to run diffent PODs that needs different capacity.
then, how could you assign PODs to Nodes that suits best? a POD that needs lot of computational resources have to be assigned to Nodes that have large capacity.
Selectos are simple and easy. you may achive the goal that certain PODs have to go to certain Nodes.
```YAML
...
spec:
  nodeSelector:
    size: Large # How kubernetes pick up 'Large' Node? in fact, key-value pair (size:Large) is labels of Nodes. Scheduler uses these labels to match PODs.
```
in kubectl:  
kubectl label nodes <node-name> <key>=<value>  
  
# Affinity
What if you want to implement more complexed and predictable behavior between PODs and Nodes? then, Affinity comes in. Affinity gives solutions for situations such as,
PODs can go to size Medium or size Large Nodes, or, PODs can NOT go to certain Nodes. Great Power Comes With Great Complexity.  

pod-definition.yml
```YAML
  ...
  spec:
    ...
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
          - matchExpressions:
            - key: size
              operator: In # specifies sizes in here. there are Large and Medium in values, so this POD will go to Large or Medium sized Nodes
              values:
              - Large
              - Medium
  ```
if you want to place your POD on Small Node, you can simply do this by using operator: Exists, and don't have to specify 'Small'.
for example,
```YAML
  ...
  spec:
    ...
    affinity:
      nodeAffinity:
        requireDuringSchedulingIgnoreDuringExecution:
          nodeSelectorTerms:
          - matchExpressions:
            - key: size
              operator: Exists # simply check if the labels size exists on the Nodes. there are many other operators so you have to check the documents
```
Type of Affinity(sentence-like property) defines schedulers behavior. two type of Node Affinity available, and one more be added in the future.  
- 'required' means that this POD will mandatorily placed on certain Node by criteria.  
- 'preferred' means that this POD will placed on certain Node if possible, is not mandatory. if there is no Nodes that meets the criteria, it simply ignores the rule and will be placed on any available Nodes.  
- 'During Scheduling' means POD is not existed and created for the first time. 
- 'During Execution' means POD is already running on a Node. current available options of Node Affinity is both 'IgnoredDuringExecution', means that POD will always ignore changes of Node Affinity when running.
  
1. requiredDuringSchedulingIgnoredDuringExecution
2. preferredDuringSchedulingIgnoredDuringExecution
3.(will be added) requiredDuringSchedulingRequiredDuringExecution -> will impact to POD that already running on a Node
  
# Practice Test
1. kubectl create deployment blue --image=nginx --replicas=3
2. kubectl label node node01 color=blue
3. kubectl describe node node01 | grep Taints
4. kubectl edit deployment blue -> I had to edit spec section under template section(same level with 'containers' section), because template defines the PODs, but I didn't know exact use for template of deployment definition so I made mistake of editing wrong section, the root spec section.
5. using operator In or Exists
