# Static Pods
Kubelet can manage the ship(Node) without Cluster, Master, Scheduler, ETCD and anything else, even without kube-apiserver, kubelet still can navigate the ship.
In this circumstances, how could you possibly provide command or details for what you want to run? well, it can. kubelet can access to your desires via certain directory in the server.
like '/etc/kubernetes/manifests', if you put your definition files in that crate, kubelet can reach to those informations. 
kubelet periodically checks this directory, so that kubelet can be sure to running PODs in that directory. if some of PODs crashes, Kublet tries to restart it.
Since kubelect keep checking on that directory, if there any changes made in the files, kubelet will recreate the PODs to take effect.

And, like this, created PODs that were not by interventions between API-server, are so called Static Pods.

### Remember, you can't create any object except PODs by put in definitions in designated directory. Kubelet only works in POD level so only can understand POD
so, how can we configure designated directory? well, you can designate any directory on the host. one more left, then how can kubelet knows that directory?
of course, you have to pass the option to kubelet name:'--pod-manifest-path=/path/' in kublet.service. or you can pass the option name:'--config=your_custom_config.yaml'.
and in you have to define the staticPodPath in your custom config file.

Since this two ways are irrespective, Kubernetes will check pod-manifest-path option first, and if there is not, will look for config and config file. also, staticPodPath option in the config file.
When you choose this way, you can view them by 'docker ps'. why? because kube-apiserver does not exists, so kubectl also cannot work with.

theres few ways to kubelet create PODs. first, you can pass definitions to kubelet by designated directory as you saw. second, through HTTP API endpoint. and that is how kube api-server provides inputs to kubelet.

so, above all, why use Static Pods? here are some use cases.
Since Static Pods are not dependent on kubernetes controlplane, you can use static pods to deploy contolplane components itself as PODs on the Nodes.
