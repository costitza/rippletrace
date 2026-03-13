import feedparser
from bs4 import BeautifulSoup

def clean_html(raw_html):
    """Removes HTML tags from the news summary to give Gemini clean text."""
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text(strip=True)

def fetch_live_news(query="supply chain disruption OR port strike OR semiconductor shortage", limit=3):
    print(f"📡 Crawling live news for: '{query}'...")
    
    # Google News RSS URL formatted for specific search queries
    # URL encoding: spaces become %20
    encoded_query = query.replace(" ", "%20")
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
    
    feed = feedparser.parse(rss_url)
    
    if not feed.entries:
        print("No news found.")
        return []
        
    articles = []
    # Grab the top X articles
    for entry in feed.entries[:limit]:
        clean_summary = clean_html(entry.summary)
        # Sometimes the summary is empty, so we combine title and summary
        full_text = f"{entry.title}. {clean_summary}"
        
        articles.append({
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "content": full_text
        })
        
    print(f"✅ Fetched {len(articles)} live articles!\n")
    return articles

if __name__ == "__main__":
    # Test the crawler directly
    live_articles = fetch_live_news()
    for i, article in enumerate(live_articles, 1):
        print(f"--- Article {i} ---")
        print(f"Title: {article['title']}")
        print(f"Content: {article['content'][:200]}...\n")