import os
from langchain_neo4j import Neo4jGraph
import logging

logging.getLogger("neo4j.notifications").setLevel(logging.ERROR)

class Neo4jManager:
    def __init__(self):
        # This creates the 'graph' attribute your terminal is crying about!
        self.graph = Neo4jGraph()

    def ingest_graph_documents(self, graph_documents):
        if graph_documents:
            self.graph.add_graph_documents(graph_documents, baseEntityLabel=True)

    def seed_company(self, company_data):
        query = """
        MERGE (c:Company {id: $name})
        SET c.name = $name,
            c.shortName = $short_name,
            c.sector = $sector
        MERGE (r:Region {id: $country})
        SET r.name = $country
        MERGE (c)-[:LOCATED_IN]->(r)
        """

        params = {
            "name": company_data['name'],
            "short_name": company_data['short_name'],
            "country": company_data['country'],
            "sector": company_data['sector']
        }

        try:
            # Now it uses self.graph properly!
            self.graph.query(query, params=params)
            return True
        except Exception as e:
            print(f"Error seeding company {company_data['name']}: {e}")
            return False

    def save_article_and_links(self, article_metadata, entity_ids):
        """
        Saves an article and links it to existing entities in the graph.
        """
        query = """
        MERGE (a:Article {url: $url})
        SET a.title = $title,
            a.published = $published,
            a.content_snippet = $snippet

        WITH a
        UNWIND $entities AS entity_id
        MATCH (e) WHERE e.id = entity_id
        MERGE (a)-[:REPORTS_ON]->(e)
        """

        params = {
            "url": article_metadata.get('url'),
            "title": article_metadata.get('title'),
            "published": article_metadata.get('published'),
            "snippet": article_metadata.get('snippet'),
            "entities": entity_ids
        }

        try:
            self.graph.query(query, params=params)
            return True
        except Exception as e:
            print(f"Error saving article {article_metadata.get('title')}: {e}")
            return False

    def close(self):
        pass