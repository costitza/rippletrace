import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")

# Create the driver once
if URI is not None and USERNAME is not None and PASSWORD is not None:
    driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

def get_db():
    """
    Dependency function to provide a Neo4j session to endpoints.
    It automatically cleans up the session after the request.
    """
    with driver.session() as session:
        yield session