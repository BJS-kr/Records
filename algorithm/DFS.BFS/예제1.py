graph = dict()

graph['A'] = ['B', 'C']
graph['B'] = ['A', 'D']
graph['C'] = ['A', 'G', 'H', 'I']
graph['D'] = ['B', 'E', 'F']
graph['E'] = ['D']
graph['F'] = ['D']
graph['G'] = ['C']
graph['H'] = ['C']
graph['I'] = ['C', 'J']
graph['J'] = ['I']

def dfs(graph, start_node):
    visited, need_visit = list(), list()
    need_visit.append(start_node)
    
    while need_visit:
        node = need_visit.pop() # 스택
        if node not in visited:
            visited.append(node)
            need_visit.extend(graph[node])
    
    return visited

dfs(graph, 'A')


def bfs(graph, start_node):
    visited, need_visit = list(), list()
    need_visit.append(start_node)
    
    while need_visit:
        node = need_visit.pop(0) # 큐
        if node not in visited:
            visited.append(node)
            need_visit.extend(graph[node])
    
    return visited

bfs(graph, 'A')
