import json
import os
from dotenv import load_dotenv
from src.crawler import fetch_live_news

# Make sure this matches the class name you used when you updated src/extractor.py
from src.extractor import GroqExtractor 

def main():
    # 1. Load environment variables (make sure GROQ_API_KEY is in your .env)
    load_dotenv()
    

    # 2. Fetch the articles (requests 200, as you would in production)
    print("Fetching live news articles...")
    articles = fetch_live_news(limit=200)
    
    if not articles:
        print("No articles found.")
        return
        
    print(f"Successfully fetched {len(articles)} articles.")
    
    # 3. Slice the list to test only the first 10
    test_articles = articles[:10]
    print(f"Starting Groq extraction test on {len(test_articles)} articles...\n")
    
    # 4. Initialize the Groq Extractor
    extractor = GroqExtractor()
    
    test_results = []

    # 5. Process the subset
    for i, article in enumerate(test_articles, 1):
        print(f"--- [Article {i}/10] {article['title']} ---")
        
        # Call the Groq API
        graph_data = extractor.extract(article['content'])
        
        if graph_data:
            # Print the formatted JSON to the console
            print("Extracted Graph Data:")
            print(json.dumps(graph_data, indent=2))
            
            # Store it for saving later
            test_results.append({
                "article_title": article['title'],
                "link": article['link'],
                "extracted_data": graph_data
            })
        else:
            print("Failed to extract data (returned None).")
            
        print("\n" + "="*50 + "\n")

    # 6. Save to a file for easy reviewing
    if test_results:
        with open("groq_test_output.json", "w") as f:
            json.dump(test_results, f, indent=2)
        print(f"Test complete! Saved the results of {len(test_results)} successful extractions to 'groq_test_output.json'.")

if __name__ == "__main__":
    main()