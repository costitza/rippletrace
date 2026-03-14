import feedparser
import urllib.parse
from .utils import clean_html, load_resource

def fetch_live_news(query=None, limit=200):
    # 1. Normalize query into a list
    if query is None:
        raw_query = load_resource("news_query.txt", "supply chain disruption")
        query = [q.strip() for q in raw_query.split('\n') if q.strip()]
    elif isinstance(query, str):
        query = [query]
        
    all_articles = []
    seen_links = set()
    
    # spoof the User-Agent so Google doesn't block the RSS request
    feedparser.USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    for q in query:
        print(f"Crawling: '{q}'...")
        # quote_plus is better for standard Google search URLs (uses '+' for spaces)
        encoded_query = urllib.parse.quote_plus(q)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        feed = feedparser.parse(rss_url)
        
        if not feed.entries:
            print(f"  -> No results found for '{q}'.")
            continue
            
        for entry in feed.entries:
            if entry.link not in seen_links:
                seen_links.add(entry.link)
                clean_summary = clean_html(entry.summary)
                full_text = f"{entry.title}. {clean_summary}"
                
                all_articles.append({
                    "title": entry.title,
                    "link": entry.link,
                    "published": entry.published,
                    "content": full_text
                })
            
            if len(all_articles) >= limit:
                break
                
        if len(all_articles) >= limit:
            break
            
    print(f"\nFetched a total of {len(all_articles)} live articles!\n")
    return all_articles[:limit]