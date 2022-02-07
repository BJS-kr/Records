# Labels
every object has many distinctive aspects in metadata. labels and selectors helps you for picking up specific object you are finding.
it is identically same feature with 'tags' concept that are in every where on the internet you are familiar. it filters objects that scattered all over the system.
labels section is in the metadata section in every object definition file has fields app, function, tier, type, etc.

# Selectors
you can use Selectors in kubectl. for example: kubectl get pods --selector app=App1 -> select matching objects filter by given app field data
but kubernetes mostly use selectors internally to connect diffent object together. for example, in replicaset-definition, you have to define selector in spec section, matchLabels.
common misunderstanding is there is relation between of Replica Set's labels and labels under selector section in Replica Set definition.
it's obvious thing so don't make mistake. 

# Annotations
Annotations are used to record other details for informative purpose.
```YAML
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: simple-webapp
  labels:
    app: App1
    function: Front-end
    annotations:
      buildversion: 1.34 # like this, annotations are for additional information. contact ID, E-mail, Phone number etc...
spec:
  replicas: 3
  selector:
    matchLabels:
      app: App1
  template:
    metadata:
      labels:
        app: App1
        function: Front-end
    spec:
      containers:
      - name: simple-webapp
        image: simple-webapp
```
# Practice Test
1. kubectl get pods --selector env=dev
2. kubectl get all --selector env=prod -> every type of objects
3. kubectl get pod --selector env=prod,bu=finance,tier=frontend -> multiple criteria selector. can't have space between fields
4. fianl question was fixing replicaset-definition.yml, and I didn't know how to do it. it was the label problem in POD defining template section.
