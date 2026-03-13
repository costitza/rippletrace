import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from neo4j import GraphDatabase

load_dotenv()


DUMMY_ARTICLE = """
Breaking: A massive labor strike has paralyzed the Port of Los Angeles today. 
The shutdown is expected to cause immediate delays for major electronics 
importers. Apple, which relies heavily on this port to receive microchips 
from TSMC in Taiwan, has warned of potential Q3 shortages.
"""

# 3. The Extraction Prompt
EXTRACTION_PROMPT = f"""
You are an expert supply chain data extractor. Your job is to read the following news article 
and extract a structured knowledge graph containing Entities (Nodes) and Relationships (Edges).

News Article:
{DUMMY_ARTICLE}

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


def save_to_json(graph_data, filename="extracted_data.json"):
    print(f"Saving data to {filename}...")
    try:
        with open(filename, 'w') as f:
            json.dump(graph_data, f, indent=2)
        print("JSON saved successfully.")
    except Exception as e:
        print(f"An error occurred while saving JSON: {e}")


def send_to_neo4j(graph_data):
    print("Connecting to Neo4j...")
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USERNAME")
    password = os.getenv("NEO4J_PASSWORD")
    
    driver = GraphDatabase.driver(uri, auth=(user, password)) # type: ignore
    
    try:
        with driver.session() as session:
            # 1. Create Entities
            for entity in graph_data.get("entities", []):
                # Sanitize type by replacing spaces with underscores and using backticks
                label = entity['type'].replace(" ", "_")
                # We use both the specific type AND a general 'Entity' label for easier searching
                # We use 'name' as the primary identifier to align with seed_database.py
                query = (
                    f"MERGE (e:`{label}` {{name: $name}}) "
                    "SET e:Entity "
                    "RETURN e"
                )
                session.run(query, name=entity['id'])
            
            # 2. Create Relationships
            for rel in graph_data.get("relationships", []):
                # Sanitize relationship type
                rel_type = rel['type'].replace(" ", "_").upper()
                # Match nodes by name (the 'id' from extracted data)
                query = (
                    "MATCH (a:Entity {name: $source}), (b:Entity {name: $target}) "
                    f"MERGE (a)-[r:`{rel_type}`]->(b)"
                )
                session.run(query, source=rel['source'], target=rel['target'])
            
            print("Data successfully sent to Neo4j.")
    except Exception as e:
        print(f"An error occurred with Neo4j: {e}")
    finally:
        driver.close()


def extract_graph_data():
    print("sending article to model")

    client = genai.Client()


    response = client.models.generate_content(
        model = "gemini-3-flash-preview",
        contents=EXTRACTION_PROMPT,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    try:
        # SAFETY CHECK
        if not response.text:
            print("Error: Gemini returned an empty response (might be a safety block).")
            return None
            
        # Parse the JSON string into a Python dictionary
        graph_data = json.loads(response.text)
        
        print("\n--- Extracted Data ---")
        print(json.dumps(graph_data, indent=2))
        return graph_data
        
    except json.JSONDecodeError:
        print("Error: Gemini did not return valid JSON.")
        print("Raw output:", response.text)

if __name__ == "__main__":
    data = extract_graph_data()
    if data:
        save_to_json(data)
        send_to_neo4j(data)






