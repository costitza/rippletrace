import os
import json
import yfinance as yf
from dotenv import load_dotenv
from src.database import Neo4jManager

# Load environment variables
load_dotenv()

def load_tickers():
    """
    Loads ticker list from config/tickers.json.
    """
    filepath = os.path.join(os.path.dirname(__file__), "config", "tickers.json")
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            data = json.load(f)
            return data.get("tickers", [])
    return []

def fetch_company_info(ticker_symbol):
    """
    Fetches company information using yfinance.
    """
    print(f"Fetching data for {ticker_symbol}...")
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        
        # Extract required fields with fallback
        company_data = {
            "name": info.get("longName") or info.get("shortName") or ticker_symbol,
            "short_name": info.get("shortName") or ticker_symbol,
            "country": info.get("country") or "Unknown",
            "sector": info.get("sector") or "Unknown"
        }
        return company_data
    except Exception as e:
        print(f"Error fetching data for {ticker_symbol}: {e}")
        return None

def main():
    tickers = load_tickers()
    if not tickers:
        print("No tickers found in config/tickers.json.")
        return

    db_manager = Neo4jManager()
    
    success_count = 0
    total_tickers = len(tickers)
    
    for symbol in tickers:
        data = fetch_company_info(symbol)
        if data:
            if db_manager.seed_company(data):
                print(f"Successfully seeded {data['name']} ({symbol})")
                success_count += 1
            else:
                print(f"Failed to seed {symbol} into Neo4j.")
        else:
            print(f"Skipping {symbol} due to fetch error.")
            
    print(f"\n✅ Seeding complete. {success_count}/{total_tickers} companies processed.")
    db_manager.close()

if __name__ == "__main__":
    main()
