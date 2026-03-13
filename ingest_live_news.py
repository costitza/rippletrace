import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from neo4j import GraphDatabase

# Import the crawler from fetch_news.py
from fetch_news import fetch_live_news

# Load credentials
load_dotenv()

# --- Configuration ---
EXTRACTION_PROMPT_TEMPLATE = """
You are an expert supply chain data extractor. Your job is to read the following news article 
and extract a structured knowledge graph containing Entities (Nodes) and Relationships (Edges).

News Article:
{article_content}

Extract the data strictly in the following JSON format:
{{
  "entities": [
    {{"id": "entity_name", "type": "Company | Region | Event | Facility"}}
  ],
  "relationships": [
    {{"source": "entity_name", "target": "entity_name", "type": "SUPPLIES | LOCATED_IN | DISRUPTS | DEPENDS_ON"}}
  ]
}}

Return ONLY valid JSON. Do not include markdown formatting or explanations.
"""

class GeminiExtractor:
    def __init__(self, model_name="gemini-3-flash-preview"):
        self.client = genai.Client()
        self.model_name = model_name

    def extract(self, text):
        print(f"Sending article to {self.model_name}...")
        prompt = EXTRACTION_PROMPT_TEMPLATE.format(article_content=text)
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        if not response.text:
            print("Error: Empty response from Gemini.")
            return None

        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            print("Error: Invalid JSON from Gemini.")
            return None

class Neo4jManager:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI")
        self.user = os.getenv("NEO4J_USERNAME")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password)) # type: ignore

    def close(self):
        self.driver.close()

    def ingest_graph(self, graph_data):
        if not graph_data:
            return

        with self.driver.session() as session:
            # 1. Create Entities
            for entity in graph_data.get("entities", []):
                label = entity['type'].replace(" ", "_")
                query = (
                    f"MERGE (e:`{label}` {{name: $name}}) "
                    "SET e:Entity "
                    "RETURN e"
                )
                session.run(query, name=entity['id'])
            
            # 2. Create Relationships
            for rel in graph_data.get("relationships", []):
                rel_type = rel['type'].replace(" ", "_").upper()
                query = (
                    "MATCH (a:Entity {name: $source}), (b:Entity {name: $target}) "
                    f"MERGE (a)-[r:`{rel_type}`]->(b)"
                )
                session.run(query, source=rel['source'], target=rel['target'])

def main():
    # 1. Fetch News
    articles = fetch_live_news(limit=2)
    if not articles:
        print("No articles to process.")
        return

    # 2. Initialize Modules
    extractor = GeminiExtractor()
    db_manager = Neo4jManager()

    all_extracted_data = []

    # 3. Process each article
    for i, article in enumerate(articles, 1):
        print(f"\n--- Processing Article {i}: {article['title']} ---")
        
        graph_data = extractor.extract(article['content'])
        if graph_data:
            print(f"Extracted {len(graph_data.get('entities', []))} entities and {len(graph_data.get('relationships', []))} relationships.")
            
            # Add metadata for reference
            graph_data['metadata'] = {
                "title": article['title'],
                "link": article['link'],
                "published": article['published']
            }
            all_extracted_data.append(graph_data)

            # 4. Ingest into Neo4j
            print("Ingesting into Neo4j...")
            db_manager.ingest_graph(graph_data)
        else:
            print("Failed to extract data for this article.")

    # 5. Save all results to a master JSON for backup
    if all_extracted_data:
        with open("live_ingestion_results.json", "w") as f:
            json.dump(all_extracted_data, f, indent=2)
        print("\n✅ All data saved to live_ingestion_results.json")

    db_manager.close()

if __name__ == "__main__":
    main()
