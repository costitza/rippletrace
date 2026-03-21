import yfinance as yf

def fetch_yahoo_news(tickers, limit_per_ticker=3):
    print(f"Fetching market context from Yahoo Finance for {len(tickers)} tickers...")
    seen_articles = {} # Using a dictionary to handle duplicates by link
    
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
                link = content_data.get("canonicalUrl", {}).get("url") or item.get("link", "")

                if not link:
                    continue

                if link in seen_articles:
                    # If we've seen this article, just add the current ticker if not already present
                    if ticker not in seen_articles[link]["tickers"]:
                        seen_articles[link]["tickers"].append(ticker)
                else:
                    # New article found
                    seen_articles[link] = {
                        "title": content_data.get("title", "Yahoo Finance News"),
                        "link": link,
                        "published": content_data.get("pubDate") or item.get("publisher", ""),
                        "content": content_data.get("summary") or content_data.get("description") or "",
                        "tickers": [ticker],
                        "source": "Yahoo Finance"
                    }
        except Exception as e:
            print(f"  -> Could not fetch Yahoo news for {ticker}: {e}")
            continue

    all_articles = list(seen_articles.values())
    print(f"Fetched {len(all_articles)} unique articles from Yahoo Finance.")
    return all_articles