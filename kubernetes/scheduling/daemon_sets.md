# Daemon sets

So far, we placed PODs on the Nodes using Replica Sets or Deployments, but there's one more, Daemon Set. Daemon Set ensures that A POD will always exists on all each Nodes that are in the same Cluster. It will starts to run automatically and removed when Nodes are gone as well. 
What is the use cases of Daemon Set? well, commonly Daemon Sets have duties for always-needed features like monitoring or logging solutions.
Also, Kube-Proxy can be deployed as Daemon sets since kube-proxy always have to running on each Nodes. and Networking solutions, like weave-net, also 
common use case of Daemon sets. 

Daemon set definition file have very similar structure with Replica set definition file. in fact, they have same structure except 'kind' section
```YAML
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: monitoring-daemon
spec:
  selector:
    matchLabels:
      app: monitoring-agent
  template:
    metadata:
      labels:
        app: monitoring-agent
    spec:
      containers:
      - name: monitoring-agent
        image: monitoring-agent
```
From Kubernetes v.1.12, Daemon set uses NodeAffinity and default scheduler for assign PODs to each specific Nodes

Practice Test
1. kubectl get daemonsets
