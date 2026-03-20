# testing/test_crawler.py

import json
from dotenv import load_dotenv
import sys
import os

# Add the project root to the Python path so we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.crawler import fetch_alpaca_news

# Load environment variables
load_dotenv()

def get_target_tickers(filepath="config/tickers.json"):
    """Loads tickers from the JSON config file."""
    # Build absolute path to config/tickers.json
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(base_dir, filepath)
    
    if not os.path.exists(full_path):
        print(f"Warning: {full_path} not found. Defaulting to a small list.")
        return ["AAPL", "TSM", "NVDA"]

    with open(full_path, "r") as file:
        data = json.load(file)
    
    # Flatten the dictionary lists into one big list of tickers
    all_tickers = []
    for sector, tickers in data.items():
        all_tickers.extend(tickers)
        
    return all_tickers

def test_alpaca_crawler():
    print("Starting Alpaca News Crawler Test...")
    
    # 1. Load the tickers from the JSON file
    all_tickers = get_target_tickers()
    
    # Optional: If 63 tickers is too many for a quick test, slice the list here.
    # For example, test_tickers = all_tickers[:10] to only test the first 10.
    test_tickers = all_tickers 
    limit = 2 # Fetch max 2 articles per ticker to keep the test quick
    
    print(f"Loaded {len(test_tickers)} tickers.")
    print(f"Fetching up to {limit} articles per ticker...")
    
    # 2. Fetch the news
    articles = fetch_alpaca_news(tickers=test_tickers, limit_per_ticker=limit)
    
    if not articles:
        print("\n❌ No articles were returned. Check your API keys and internet connection.")
        return

    print(f"\n✅ Successfully fetched {len(articles)} articles!")
    
    # 3. Save the output to a JSON file
    output_filename = os.path.join(os.path.dirname(__file__), "crawler_output.json")
    
    with open(output_filename, "w", encoding="utf-8") as f:
        # We use default=str just in case datetime objects are in the dictionary
        json.dump(articles, f, indent=4, ensure_ascii=False, default=str)
        
    print(f"💾 Full results saved to: {output_filename}\n")
    
    # 4. Print a quick preview of the first 3 articles to the console
    print("--- PREVIEW OF FIRST 3 ARTICLES ---")
    for i, article in enumerate(articles[:3], 1):
        print(f"[{i}] {article.get('title')} (Tickers: {article.get('tickers')})")
        
if __name__ == "__main__":
    test_alpaca_crawler()