import os 
from langchain_neo4j import Neo4jGraph

class Neo4jManager:
    def __int__(self):
        self.graph = Neo4jGraph()

    def ingest_graph_documents(self, graph_documents):
        self.graph.add_graph_documents(graph_documents, baseEntityLabel=True)