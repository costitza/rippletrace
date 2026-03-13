import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

# Load environment variables from the .env file
load_dotenv()

# Fetch the credentials safely
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")
AUTH = (USERNAME, PASSWORD)

def verify_connection():
    driver = GraphDatabase.driver(URI, auth=AUTH)
    try:
        driver.verify_connectivity()
        print("Success! Connected securely using .env file.")
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    verify_connection()