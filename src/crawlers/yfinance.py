import yfinance as yf

def fetch_yahoo_news(tickers, limit_per_ticker=3):
    print(f"Fetching market context from Yahoo Finance for {len(tickers)} tickers...")
    all_articles = []
    
    for ticker in tickers:
        try:
            # Use yfinance directly
            t = yf.Ticker(ticker)
            news = t.news
            
            if not news:
                continue

            # Slice the list to respect our limit
            for item in news[:limit_per_ticker]:
                # yfinance news items have a nested 'content' structure or direct fields depending on version
                # In 1.2.0 it seems to be in ['content']
                content_data = item.get('content', item)
                
                all_articles.append({
                    "title": content_data.get("title", "Yahoo Finance News"),
                    "link": content_data.get("canonicalUrl", {}).get("url") or item.get("link", ""),
                    "published": content_data.get("pubDate") or item.get("publisher", ""),
                    "content": content_data.get("summary") or content_data.get("description") or "",
                    "tickers": [ticker],
                    "source": "Yahoo Finance"
                })
        except Exception as e:
            print(f"  -> Could not fetch Yahoo news for {ticker}: {e}")
            continue

    print(f"Fetched {len(all_articles)} articles from Yahoo Finance.")
    return all_articles