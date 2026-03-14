import os
from neo4j import GraphDatabase
from .utils import load_resource

class Neo4jManager:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI")
        self.user = os.getenv("NEO4J_USERNAME")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password)) # type: ignore
        self.entity_query = load_resource("ingest_entity.cypher")
        self.relationship_query = load_resource("ingest_relationship.cypher")

    def close(self):
        self.driver.close()

    def ingest_graph(self, graph_data):
        if not graph_data:
            return

        with self.driver.session() as session:
            # 1. Ingest Entities Safely
            for entity in graph_data.get("entities", []):
                # Safely get the type and id, defaulting to empty strings if missing
                e_type = entity.get('type', '').strip()
                e_id = entity.get('id', '').strip()
                
                # Skip if LLM forgot the type or ID
                if not e_type or not e_id:
                    continue
                    
                label = e_type.replace(" ", "_")
                query = self.entity_query.replace("{label}", label)
                session.run(query, name=e_id)
            
            # 2. Ingest Relationships Safely
            for rel in graph_data.get("relationships", []):
                rel_type = rel.get('type', '').strip()
                source = rel.get('source', '').strip()
                target = rel.get('target', '').strip()
                
                # Skip if LLM forgot the type, source, or target
                if not rel_type or not source or not target:
                    continue
                    
                rel_type_formatted = rel_type.replace(" ", "_").upper()
                query = self.relationship_query.replace("{rel_type}", rel_type_formatted)
                session.run(query, source=source, target=target)

    def seed_company(self, company_data):
        """
        Seeds a single company into Neo4j.
        company_data: {name, short_name, country, sector}
        """
        query = """
        MERGE (c:Company {name: $name})
        SET c.shortName = $short_name,
            c.sector = $sector,
            c:Entity
        MERGE (r:Region {name: $country})
        SET r:Entity
        MERGE (c)-[:LOCATED_IN]->(r)
        """
        with self.driver.session() as session:
            try:
                session.run(query, 
                            name=company_data['name'], 
                            short_name=company_data['short_name'],
                            country=company_data['country'],
                            sector=company_data['sector'])
                return True
            except Exception as e:
                print(f"Error seeding company {company_data['name']}: {e}")
                return False