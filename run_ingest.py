
import json
from dotenv import load_dotenv
from yfinance import Ticker
from src.extractor import GroqExtractor
from src.database import Neo4jManager

from src.crawlers import fetch_alpaca_news, fetch_sec_risk_factors, fetch_yahoo_news

load_dotenv()

def get_target_tickers():
    # Load your ~60 tickers from config/tickers.json
    with open("config/tickers.json", "r") as f:
        data = json.load(f)
        all_tickers = []
        for sector, tickers in data.items():
            all_tickers.extend(tickers)
        return all_tickers


def main():
    print("Getting tickers...")
    tickers = get_target_tickers()
    limit = 2

    print("Fetching Alpaca News...")
    alpaca_articles = fetch_alpaca_news(tickers, limit_per_ticker=limit)

    print("Fetching Yahoo Finance News...")
    yahoofin_articles = fetch_yahoo_news(tickers, limit_per_ticker=limit)

    # print("Fetching SEC Risk Factors...")
    # secfilings_articles = fetch_sec_risk_factors(tickers)

    articles = alpaca_articles + yahoofin_articles #+ secfilings_articles

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