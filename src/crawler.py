import feedparser
from .utils import clean_html, load_resource

def fetch_live_news(query=None, limit=100):
    if query is None:
        query = load_resource("news_query.txt", "supply chain disruption")
    
    print(f"Crawling live news for: '{query}'...")
    
    encoded_query = query.replace(" ", "%20")
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
    
    feed = feedparser.parse(rss_url)
    
    if not feed.entries:
        print("No news found.")
        return []
        
    articles = []
    for entry in feed.entries[:limit]:
        clean_summary = clean_html(entry.summary)
        full_text = f"{entry.title}. {clean_summary}"
        
        articles.append({
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "content": full_text
        })
        
    print(f"Fetched {len(articles)} live articles!\n")
    return articles
