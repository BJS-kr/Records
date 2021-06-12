# LL

class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self, head):
        self.head = Node(1)
    
    def append(self, value):
        currentNode = self.head
        while currentNode.next is not None:
            currentNode = currentNode.next
        currentNode.next = Node(value)
    
    def view_all_value(self):
        headNode = self.head
        while headNode is not None:
            print(headNode.value)
            headNode = headNode.next

    def view_certain_point(self, index):
        headNode = self.head
        for _ in range(index):
            headNode = headNode.next
        print(headNode.value)

    def append_certain_point(self, index, value):
        currentNode = self.head
        parentNode = currentNode
        for _ in range(index):
            parentNode = currentNode
            currentNode = currentNode.next
        newNode = Node(value)
        parentNode.next = newNode
        newNode.next = currentNode

    def delete(self, index):
        currentNode = self.head
        parentNode = currentNode
        for _ in range(index):
            parentNode = currentNode
            currentNode = currentNode.next
        parentNode.next = currentNode.next
    
        

a = LinkedList(1)
a.append(2)
a.append(3)
a.append(4)
a.view_all_value()
print()
a.view_certain_point(2)
print()
a.append_certain_point(4,9)
a.append_certain_point(3,8)
a.view_all_value()
print()
a.delete(5)
a.view_all_value()
