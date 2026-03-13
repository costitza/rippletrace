import json
import os
import time
from dotenv import load_dotenv
from src.crawler import fetch_live_news
from src.extractor import GeminiExtractor
from src.database import Neo4jManager
from src.utils import load_resource

# Load environment variables
load_dotenv()

def main():
    # 1. Load the base query and append 'when:1m' for the last month
    base_query = load_resource("news_query.txt", "supply chain disruption")
    backfill_query = f"{base_query} when:1m"
    
    print(f"Starting Backfill Process for the last month...")
    print(f"Query: {backfill_query}")

    # 2. Fetch up to 200 articles
    articles = fetch_live_news(query=backfill_query, limit=200)
    
    if not articles:
        print("No articles found for the specified period.")
        return

    # 3. Initialize Modules
    extractor = GeminiExtractor()
    db_manager = Neo4jManager()
    
    total = len(articles)
    print(f"Found {total} articles. Starting extraction and ingestion...")

    # 4. Process articles progressively
    for i, article in enumerate(articles, 1):
        print(f"[{i}/{total}] Processing: {article['title']}")
        
        # Extractor now has built-in retry logic
        graph_data = extractor.extract(article['content'])
        
        if graph_data:
            # Add metadata
            graph_data['metadata'] = {
                "title": article['title'],
                "link": article['link'],
                "published": article['published'],
                "ingested_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            # Progressive Ingestion
            db_manager.ingest_graph(graph_data)
            print(f"Successfully ingested data from: {article['title']}")
        else:
            print(f"Failed to extract data for: {article['title']}")
            
        # Small delay to be polite to the API rate limits even with retries
        time.sleep(1)

    print(f"\nBackfill complete! Processed {total} articles.")
    db_manager.close()

if __name__ == "__main__":
    main()
