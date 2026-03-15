import feedparser
import urllib.parse
from .utils import clean_html, load_resource

def fetch_live_news(query=None, limit_per_prompt=40):
    # 1. Use your specific target queries if none are provided
    if query is None:
        query = [
            "port strike",
            "semiconductor shortage",
            "factory fire",
            "logistics delay",
            "shipping crisis"
        ]
    elif isinstance(query, str):
        query = [query]
        
    all_articles = []
    seen_links = set() # Keeps track of duplicates across different prompts
    
    # spoof the User-Agent so Google doesn't block the RSS request
    feedparser.USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    for q in query:
        print(f"Crawling: '{q}'...")
        encoded_query = urllib.parse.quote_plus(q)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        feed = feedparser.parse(rss_url)
        
        if not feed.entries:
            print(f"  -> No results found for '{q}'.")
            continue
            
        # Counter specifically for the current prompt
        articles_for_this_prompt = 0
        
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
                
                articles_for_this_prompt += 1
            
            # Stop adding articles once we hit 40 for THIS specific prompt
            if articles_for_this_prompt >= limit_per_prompt:
                break
                
        print(f"  -> Fetched {articles_for_this_prompt} unique articles for '{q}'.")
                
    print(f"\nFetched a total of {len(all_articles)} live articles!\n")
    return all_articles