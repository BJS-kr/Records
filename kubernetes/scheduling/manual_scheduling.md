every pod-definition file of PODs, there will be a empty field in the spec section named nodeName. because kubernetes automatically fills that field based on Scheduler.
of course you can define nodeName by yourself. if there is no schduler on the system, POD will on pending state, and also pod-definition will not have nodeName field. you can add it manually.
if you want to change nodeName in existing POD, you can make Binding Object, mimicking what Schedulers do.
```YAML
apiVersion: v1
kind: Binding
metadata:
  name: nginx
target:
  apiVersion: v1
  kind: Node
  name: node02 # equivalent to nodeName in pod definition
```
then you can make POST request to bind this object but you have to remember, this Binding definition must be converted to JSON format.
for example: curl --header "Content-Type:application/json" --request POST --data '{"apiVersion":"v1", "kind":"Binding", ...}' http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding/

# Practice Test
was easy and repetitive of previous tests.
