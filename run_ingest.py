import json
from dotenv import load_dotenv
from src.crawler import fetch_live_news
from src.extractor import GroqExtractor
from src.database import Neo4jManager

load_dotenv()

def main():
    articles = fetch_live_news(limit=200)
    if not articles:
        return

    extractor = GroqExtractor()
    db_manager = Neo4jManager()
    json_backup_data = []

    for i, article in enumerate(articles, 1):
        print(f"\n--- Processing Article {i}/{len(articles)}: {article['title']} ---")
        graph_data = extractor.extract(article['content'])
        
        if graph_data:
            print(f"Extracted {len(graph_data.get('entities', []))} entities.")
            graph_data['metadata'] = {
                "title": article['title'],
                "link": article['link'],
                "published": article['published']
            }
            
            if len(json_backup_data) < 15:
                json_backup_data.append(graph_data)

            db_manager.ingest_graph(graph_data)
        else:
            print("Failed to extract data.")

    if json_backup_data:
        with open("live_ingestion_results.json", "w") as f:
            json.dump(json_backup_data, f, indent=2)
        print(f"\nBackup saved. Finished processing {len(articles)} articles.")

    db_manager.close()

if __name__ == "__main__":
    main()
