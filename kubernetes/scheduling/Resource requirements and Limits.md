# Rescource requirements
Every Nodes have CPU, MEM, DISK capacities. since every POOs consumes those capacities so there might be troublesome situation that a POD can't land
any of Nodes because they have not enough Resources. you can check if these situation occured by POD's state(pending) and Events in described informations.
Kubernetes assumes defaultly that one POD or container in a POD will need 0.5 CPU & 256Mi. this is known as Resource Request for a container, minimum CPU and MEM.
you can amend those minimum values to actual needed values by POD or Deployment definition. 
```YAML
...pod definitions...
spec:
  containers:
    ...
    resources:
      requests:
        memory: "1Gi"
        cpu: 1
```
then, what does '1 cpu' really means? remember, this block is for illustration purposes only. it doesn't have to be incremental value of 0.5. you can specify any value like 0.1.
0.1 cpu means equal with 100m cpu, where m stands for milli, you can down your request to 1m but not lower.
1 cpu is equivalent to 1 AWS vCPU, 1 GCP Core, 1 Azure Core, 1 Hyperthread. Like CPUs, MEM can be specified like 268435456, same with 256Mi.

### bytes expression
- 1G = 1,000,000,000
- 1M = 1,000,000
- 1K = 1,000
- 1Gi(Gibibyte) = 1,073,741,824
- 1Mi(Mebibyte) = 1,048,576
- 1Ki(Kibibyte) = 1,024

In Docker, thete is no limits for the containers so if a container consumes too much resources of Node, it can suffocating native porcesses of Node and other containers.
However, you can set limit the resource usage of these PODs. By default, kubernetes sets 1 vCPU, 512Mi limit to a POD. of course you can define your custom limitation.
```YAML
...pod definitions...
spec:
  containers:
    ...
    resources:
      ...
      limits:
        memory: "2Gi"
```
so, waht happens if POD trying to exceeds the resource limits? Kubernets throttles the cpu so POD cannot go beyond of it's limits.
BUT, this is not applied when the case is MEM. POD can exceed the memory limit, and if this state continues, POD will be terminated.

# Practice Test

