import json
import os
import time
from dotenv import load_dotenv
from src.crawler import fetch_live_news
from src.extractor import GroqExtractor
from src.database import Neo4jManager
from src.utils import load_resource

load_dotenv()

def main():
    # 1. Load the base queries as a list of lines
    raw_queries = load_resource("news_query.txt", "supply chain disruption")
    # This reads the file and splits it by line, ignoring empty lines
    query_list = [q.strip() for q in raw_queries.strip().split('\n') if q.strip()]
    
    print(f"Starting Backfill Process across {len(query_list)} distinct topics...")

    # 2. Fetch up to 200 articles combined (no 'when:1m' filter this time)
    articles = fetch_live_news(query=query_list, limit=200)
    
    if not articles:
        print("No articles found.")
        return

    # 3. Initialize Modules
    extractor = GroqExtractor(model_name="llama-3.1-8b-instant")
    db_manager = Neo4jManager()
    
    total = len(articles)
    print(f"Found {total} articles. Starting extraction and ingestion...")

    # 4. Process articles progressively
    for i, article in enumerate(articles, 1):
        print(f"[{i}/{total}] Processing: {article['title']}")
        
        graph_data = extractor.extract(article['content'])
        
        if graph_data:
            graph_data['metadata'] = {
                "title": article['title'],
                "link": article['link'],
                "published": article['published'],
                "ingested_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            db_manager.ingest_graph(graph_data)
            print(f"Successfully ingested data from: {article['title']}")
        else:
            print(f"Failed to extract data for: {article['title']}")
            
        time.sleep(1)

    print(f"\nBackfill complete! Processed {total} articles.")
    db_manager.close()

if __name__ == "__main__":
    main()