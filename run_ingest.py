
import json
from dotenv import load_dotenv
from src.crawler import fetch_live_news
from src.extractor import GroqExtractor
from src.database import Neo4jManager

load_dotenv()


def main():
    articles = fetch_live_news()

    if not articles:
        return
    
    extractor = GroqExtractor()
    db_manager = Neo4jManager()

    for i, article in enumerate(articles, 1):
        print(f"processing article {i} / {len(articles)} : {article['title']}")

        metadata = {
            "title": article['title'],
            "link": article['link'],
            "published": article['published']
        }

        graph_documents = extractor.extract(article['content'], metadata)

        if graph_documents:
            nodes_count = len(graph_documents[0].nodes)
            edges_count = len(graph_documents[0].relationships)
            print(f"extracted {nodes_count} nodes and {edges_count} edges")

            db_manager.ingest_graph_documents(graph_documents)

        else:
            print("failed to extract data")


if __name__ == "__main__":
    main()