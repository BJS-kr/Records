# Core Concepts
1. Worker Nodes : Host application as containers
2. Master: manage, plan, schedule, monitor nodes
3. ETCD: key-val formatted data store
4. Kube-Scheduler: place right containers to the nodes based on capcity, policy, constraints and etc.
5. Controller-Manager:
 - Node-Controller: takes care of nodes
 - Replication-Controller: handle where nodes bacome unavalilable or gets destroyed and the replication
6. Kube-APIServer: ochestration all operations within the cluster
7. Container-RuntimeEngine: Docker, the most popular one, or maybe Rocket, ContainerD etc. must on all nodes including master
8. Kubelet: captain of each nodes. listens for instructions from the kube-api server and deploys or destroys on the nodes. kube-apiserver periodically fetches status reports from the kublet to monitor status of nodes
9. Kube-Proxy: responsible to communicate between different nodes and different containers(like web-server container running on Node1 connected to database container on Node2)

# Kube-APIServer
Primary managing component. authenticate request and validate it. then retreives information from ETCD Cluster and response back with requested information. 
if you create a pod, after authenticate and validate your request, kube-apiserver will update data in ETCD server. then, kube-scheduler will realize that
there is a new pod that no node assgined. because kube-scheduler continuously monitoring kube-apiserver. scheduler identifies the right node for the new pod and communicate back to the kube-apiserver.
then apiserver update information in ETCD cluster, and passes that information to the kublet of approporiate worker node. after the job done, kublet update the status back to api server.
then apiserver updates ETCD cluster.

similar pattern will always follow whatever tasks you may request to kube-apiserver.

## Kube-Controller-Manager
Controller-Manager is on the Master and responsible to two critical parts. first, watch status of the nodes. second, take necessary actions to remediate situation.
for example, kube-apiserver moitor all nodes and send health status to Node-controller every 5 seconds. if one of the nodes became unreachable, it waits for 40 seconds for mark the node 'unreachable'
if a node marked as unreachable, it gives 5 mins to get back up. if it doesn't, it removes the pod and substitue as healthy one, if the pod is part of replica set.

next is recplication contoller. responsible monitor the replica sets and ensures that desired number of pods are available at all times with in the set. if a pod dies, recreates it.

in fact, there is much more controllers available in kubernetes, like deployment-controller, namespace-contoroller and etc. these controllers are packed in one process called 'Kube-Controller-Manager'

## Kube-Scheduler
only decides which pods goes where. why do we need scheduler? to make sure the right pod is loaded on right node. scheduler finds the best node for the pod.
for example, if a pod needs 10 cpu cores, scheduler will assign pod to node that have at least 10 cpu cores available. not just finds one, it ranks node. identifies sufficient nodes and ranks them by criterias.

## Kublet
leads all activites on the node. kublet is literally captain of the ship(node). load the containers as Master's scheduler instructing and send back report of task results.
if an order from scheduler received, kublet request to the container engine(docker etc) on the node. then kublet starts to monitor container's status.

kublet does not automatically assgined to your nodes. you have to manually install kublet on each nodes.

## Kube-Proxy
in kubernetes, every each PODs can reach to another PODs, even if they are on different Node. Kube-Porxy is technique to achive this connections between PODs. POD Network is virtual & internal Network across all nodes in the cluster.
Web-App can simply reach to the database node using the IP address, but you have to remember that PODs does NOT guarantees same IP address each time you run the PODs.
so best choice is using 'service'. service can expose POD to across the cluster. but, service is not in PODs Network. because service is NOT an actual thing. it is not a process but only lives in kubernetes memory.
Kube-Proxy runs on each Nodes and this is why you can access to service anywhere from cluster. whenever services created, Kube-Proxy create approporiate rules on each Nodes to forward traffic to those services using IP tables.
