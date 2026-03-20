# run_sec_ingest.py

import json
import os
from dotenv import load_dotenv
from src.crawlers import fetch_sec_risk_factors
from src.extractor import GroqExtractor
from src.database import Neo4jManager

load_dotenv()

def get_target_tickers(filepath="config/tickers.json"):
    """Loads the ticker list from the JSON config."""
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found.")
        return ["AAPL"]

    with open(filepath, "r") as file:
        data = json.load(file)
    
    all_tickers = []
    for sector, tickers in data.items():
        all_tickers.extend(tickers)
        
    return all_tickers

def main():
    tickers = get_target_tickers()
    print(f"Starting SEC 10-K Risk Factor ingestion for {len(tickers)} tickers...")

    # 1. Fetch SEC Risk Factors
    sec_docs = fetch_sec_risk_factors(tickers)

    if not sec_docs:
        print("No SEC documents found. Check your SEC_API_KEY.")
        return

    # 2. Initialize Modules
    # CRITICAL: We override the default 8B model and use the 70B model here
    # because SEC documents are huge and require better reasoning for the JSON schema.
    print("\nInitializing 70B Model for deep document extraction...")
    extractor = GroqExtractor(model_name="llama-3.3-70b-versatile")
    db_manager = Neo4jManager()

    # 3. Process and Ingest
    for i, doc in enumerate(sec_docs, 1):
        print(f"\n[{i}/{len(sec_docs)}] Processing: {doc['title']}")

        metadata = {
            "title": doc['title'],
            "link": doc['link'],
            "published": doc['published'],
            "source": "SEC EDGAR",
            "tickers": doc.get('tickers', [])
        }

        # Force the LLM to link the risks back to the target ticker
        enriched_content = f"Related Tickers: {', '.join(metadata['tickers'])}\n\n{doc['content']}"

        # Extract the graph
        graph_documents = extractor.extract(enriched_content, metadata)

        if graph_documents:
            nodes_count = len(graph_documents[0].nodes)
            edges_count = len(graph_documents[0].relationships)
            print(f"  -> ✅ Extracted {nodes_count} nodes and {edges_count} edges")
            
            # Save to Neo4j
            db_manager.ingest_graph_documents(graph_documents)
        else:
            print(f"  -> ❌ Failed to extract data for {doc['title']}")

    print("\n🎉 SEC Ingestion Complete!")
    db_manager.close()

if __name__ == "__main__":
    main()