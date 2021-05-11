# 가이드대로 구현 성공
# node, binary_tree, insert, search, delete

class Node:
    def __init__(self, value):
        self.value = value
        self.left, self.right = None, None
        
class NodeMgmt:
    def __init__(self, head):
        self.head = head
        
    def insert(self, value):
        self.current_node = self.head
        while True:
            if value < self.current_node.value:
                if self.current_node.left != None:
                    self.current_node = self.current_node.left
                else:
                    self.current_node.left = Node(value)
                    break
            else:
                if self.current_node.right != None:
                    self.current_node = self.current_node.right
                else:
                    self.current_node.right = Node(value)
                    break
                    
    def search(self, value):
        self.current_node = self.head
        while self.current_node:
            if value == self.current_node.value:
                return True
            elif value < self.current_node.value:
                self.current_node = self.current_node.left
            else:
                self.current_node = self.current_node.right
        return False
    
    def delete(self, value):
        self.current_node, self.parent_node = self.head, self.head
        searched = False
        while self.current_node:
            if value == self.current_node.value:
                searched = True
                break
            elif value < self.current_node.value:
                self.parent_node = self.current_node
                self.current_node = self.current_node.left
            elif value > self.current_node.value:
                self.parent_node = self.current_node
                self.current_node = self.current_node.right
        if searched == False:
            return False
                
        # 여기까지 도달하면 current_node는 삭제할 node. parent_node는 삭제할 노드의 부모 노드가 됨.
        # case 1 : 삭제할 노드가 leaf node인 경우
        if self.current_node.left == None and self.current_node.right == None:
                if value > self.parent_node.value:
                    self.parent_node.right = None
                else:
                    self.parent_node.left = None
        # case 2 : 삭제할 노드가 child node를 하나 가지고 있는 경우
        elif self.current_node.left != None and self.current_node.right == None:
            if self.current_node == self.parent_node.left:
                self.parent_node.left = self.current_node.left
            else:
                self.parent_node.right = self.current_node.left
        elif self.current_node.left == None and self.current_node.right != None:
            if self.current_node == self.parent_node.left:
                self.parent_node.left = self.current_node.right
            else:
                parent_node.right = current_node.right
        # case 3 : 삭제할 노드가 child node를 두개 가지고 있을때
        elif self.current_node.right != None and self.current_node.left != None:
            # 자신은 parent node의 left일때
            if self.current_node == self.parent_node.left:
                self.target_node = self.current_node.left
                self.parent_node.left = self.current_node.right
                if self.current_node.right.left == None:
                        self.current_node.right.left = self.target_node
                else:
                    self.current_node = self.current_node.right.left
                    while True:
                        if self.current_node.left == None:
                            self.current_node.left = self.target_node
                            break
                        else:
                            self.current_node = self.current_node.left
            # 자신은 parent_node의 right일때
            else:
                self.target_node = self.current_node.right
                self.parent_node.right = self.current_node.left
                if self.current_node.left.right == None:
                    self.current_node.left.right = self.target_node
                else:
                    self.current_node = self.current_node.left.right
                    while True:
                        if self.current_node.right == None:
                            self.current_node.right = target_node
                            break
                        else:
                            current_node = current_node.right
                            
    
                    
                
        
head = Node(1)
binary_tree = NodeMgmt(head)
binary_tree.insert(2)
binary_tree.insert(0)
binary_tree.insert(4)
binary_tree.insert(8)
binary_tree.insert(-2)

binary_tree.delete(8)

binary_tree.search(8)
# 삭제한 8을 찾으니 False
