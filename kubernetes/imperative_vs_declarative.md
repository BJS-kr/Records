# Imperative vs Declarative
Imperative way of coding means developer defines each steps and also executes. on the other hands, Declarative approach leaves most things to the system or software, only provides simple informations of the goal.
In kubernetes, imperative way is like using kubectl command on each step. Declartive way, on the contrary, using single kubectl command like 'kubectl apply -f nginx.yaml'.
Imperative way is convenient 'cause you don't have to deal with YAML files and will be very helpful to pass the exam. but it also has many weaknesses. first, commands cannot be stored. If you run many commands to make objects or deal with troubles, the commands that you used are will be lost. so it makes hard to maintain the application to other developer, and even yourself.
second, they are limited in functionality, requires long and complex commands for advanced use cases.

you can deal with these problems using YAML files but it's not enough! if you run 'kubectl edit' command, it will show you a YAML file similar to what you've wrote, and allows to edit it.
But this is NOT that you were wrote. a YAML that are showing when you run edit command, is file that in kubernetes memory, and if you update it, it will be applied directly to live object, will not change your YAML in the local.
So it's harzardous because you or your colleague can make mistake because edited features didn't applied to your local YAML file.
To prevent this, you have to replace your local YAML file with 'replace' command or use edit command if you sure to not use edited live obejct again in the future.
If you want to delete live object and run whole new obejct, use 'kubectl replace --force' command

And still, it is imperative. cause you have to command all steps like deleting objects, edit, replace and etc..

The Declarative approach is, using 'apply' command. apply command is smart enough to deal with many cases like object is already existing or not.
and also, you can update your obejct simply updating your YAML file and run apply command. apply command will know a live object is already existing and will update features that you have changed in your YAML file.

apply command is useful when you have to update complexed things like environment variables and detailed features, will save your times from errors.

# Apply
We know apply command is declarative and smart enough to catch contexts from previous study. now, let's dig up the details. if you run apply command,
kubernetes will refer your local file and store Live Object Configuration in the memory that looks similar with your local definition file but having more fields like status section.
the local YAML file will converted to JSON file and will stored in Last Applied Configuration. These three file(local definition, Last Applied Configuration, Live Object Configuration) will be compared to each other to figure out what changes have been made.
for example, if you update image version in the local definition file, it will be applied to Live Object Configuration only when it is diffent. and when Live Object Configuration is updated, Last Applied Configuration will be also updated because this change affected to your object.

this is simple process but WHY do we need Last Applied Configuration?
think about deletion of certain field in your local definition file, like type field in labels section. it will affect to Live Object Configuration. and because of local file and Live object configuration have no type field,
type field in Last Applied Configuration will be last as it is. Why? because it have to be compared to figure out what changes have been made.
so, Where does Live Object Configuration data is stored? it's in the Live Object Configuration in metatdata/annotations/kubectl.kubernetes.io/last-applied-configuration field. because of Last Applied Configuration stored only when you run apply command, you must bear in mind that not to mix declarative and imperative approaches while managing kubernetes objects.

if you need more details go to https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/

# Practice Test
1. kubectl run redis --image=redis:alpine --dry-run=client -o yaml > nginx-pod.yaml
1-2. add 'tier' under 'labels' in the yaml and command 'kubectl create -f '
2. kubectl expose pod redis --port=6379 --name=redis-service -> create and expose service at the same time
3. kubectl create deployment webapp --image=kodekloud/webapp-color --replicas=3
4. kubectl run custom-nginx --image=nginx --port=8080 -> create pod and expose port on container 
5. kubectl create namespace dev-ns
6. kubectl create deployment redis-deploy --namespace=dev-ns --image=redis --replicas=2
7. kubectl run httpd --image=httpd:alpine --port=80 --expose -> *important*: creates pod and service at the same time
