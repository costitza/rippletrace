import feedparser
import urllib.parse
from .utils import clean_html, load_resource
import os 
import requests
from newspaper import Article


def fetch_alpaca_news(tickers=None, limit_per_ticker=5):
    """
    Fetches news tagged by ticker using Alpaca API
    """

    if tickers is None:
        tickers = ["AAPL", "TSM", "NVDA", "ASML"]

    api_key = os.environ.get("ALPACA_API_KEY")
    api_secret = os.environ.get("ALPACA_SECRET_KEY")
    
    headers = {
        "Apca-Api-Key-Id": api_key,
        "Apca-Api-Secret-Key": api_secret
    }

    all_articles = []
    seen_links = set()
    
    for ticker in tickers:
        print(f"Fetching news for {ticker}...")
        url = f"https://data.alpaca.markets/v1beta1/news?symbols={ticker}&limit={limit_per_ticker}"
        
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"  -> Error: {response.status_code}")
            continue
            
        news_items = response.json().get('news', [])

        for item in news_items:
            article_url = item.get('url')
            if article_url in seen_links:
                continue
            seen_links.add(article_url)
            
            # Extract FULL text using newspaper3k
            try:
                article = Article(article_url)
                article.download()
                article.parse()
                full_text = article.text
            except Exception:
                full_text = item.get('summary', '')

            if full_text:
                all_articles.append({
                    "title": item.get('headline'),
                    "link": article_url,
                    "published": item.get('created_at'),
                    "content": full_text,
                    "tickers": item.get('symbols', []) # The API gives us the exact stocks!
                })
                
    print(f"\nFetched {len(all_articles)} financial articles.")
    return all_articles