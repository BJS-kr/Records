# Labels
every object has many distinctive aspects in metadata. labels and selectors helps you for picking up specific object you are finding.
it is identically same feature with 'tags' concept that are in every where on the internet you are familiar. it filters objects that scattered all over the system.
labels section is in the metadata section in every object definition file has fields app, function, tier, type, etc.

# Selectors
you can use Selectors in kubectl. for example: kubectl get pods --selector app=App1 -> select matching objects filter by given app field data
but kubernetes mostly use selectors internally to connect diffent object together. for example, in replicaset-definition, you have to define selector in spec section, matchLabels.
common misunderstanding is there is relation between of Replica Set's labels and labels under selector section in Replica Set definition.
it's obvious thing so don't make mistake. 

