import json
import os
import sys

# Add the project root to sys.path to allow importing from src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.crawlers.yfinance import fetch_yahoo_news

def main():
    # 1. Load tickers from config/tickers.json
    tickers_path = os.path.join('config', 'tickers.json')
    with open(tickers_path, 'r') as f:
        tickers_data = json.load(f)
    
    # Flatten the list of tickers and take only the first 10
    all_tickers = []
    for category in tickers_data.values():
        all_tickers.extend(category)
    
    test_tickers = all_tickers[:10]
    print(f"Testing yfinance crawler with tickers: {test_tickers}")

    # 2. Fetch market context for 10 of them
    try:
        results = fetch_yahoo_news(test_tickers, limit_per_ticker=2)
        
        # 3. Save into a json so we can see it works
        output_path = os.path.join('testing', 'yfinance_output.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully saved {len(results)} articles to {output_path}")
    except Exception as e:
        print(f"An error occurred during testing: {e}")

if __name__ == "__main__":
    main()
