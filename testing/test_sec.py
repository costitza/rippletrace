import json
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Add the project root to sys.path to allow importing from src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.crawlers.sec_edgar import fetch_sec_risk_factors

def main():
    # 1. Load tickers from config/tickers.json
    tickers_path = os.path.join('config', 'tickers.json')
    with open(tickers_path, 'r') as f:
        tickers_data = json.load(f)
    
    test_tickers = tickers_data['semiconductors_and_tech'][:10]
    print(f"Testing SEC crawler with tickers: {test_tickers}")

    # Fetch SEC risk factors for them
    try:
        results = fetch_sec_risk_factors(test_tickers)
        
        # Save into a json so we can see it works
        output_path = os.path.join('testing', 'sec_output.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        if results:
            print(f"Successfully saved {len(results)} SEC filings to {output_path}")
        else:
            print("No filings were fetched.")
            
    except Exception as e:
        print(f"An error occurred during testing: {e}")

if __name__ == "__main__":
    main()
