import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

# 1. Load your secure credentials
load_dotenv()
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")

# 2. The Cypher Blueprint (Using MERGE to prevent duplicates)
SEED_QUERY = """
// Create Regions
MERGE (taiwan:Region {name: 'Taiwan'})
MERGE (usa:Region {name: 'USA'})

// Create Companies
MERGE (tsmc:Company {name: 'TSMC'})
SET tsmc.industry = 'Semiconductors'

MERGE (apple:Company {name: 'Apple'})
SET apple.industry = 'Consumer Electronics'

// Link Companies to Regions
MERGE (tsmc)-[:LOCATED_IN]->(taiwan)
MERGE (apple)-[:LOCATED_IN]->(usa)

// Create the Supply Chain Link
MERGE (tsmc)-[:SUPPLIES {product: 'Microchips'}]->(apple)

// Create the Risk Event and its Impact
MERGE (earthquake:Event {name: 'Magnitude 7.4 Earthquake'})
SET earthquake.type = 'Natural Disaster'

MERGE (earthquake)-[:DISRUPTS]->(taiwan)
"""

def seed_db():
    print("Connecting to Neo4j...")
    driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD)) # type: ignore
    
    try:
        # Open a session and run the query
        with driver.session() as session:
            session.run(SEED_QUERY)
            print("Success! The RippleTrace mock data has been injected.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    seed_db()