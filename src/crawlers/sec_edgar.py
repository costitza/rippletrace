# src/crawlers/sec_edgar.py

import os
from sec_api import ExtractorApi, QueryApi

def fetch_sec_risk_factors(tickers):
    """
    Finds the latest 10-K filing for each ticker and extracts Item 1A (Risk Factors).
    """
    print("Fetching SEC 10-K Risk Factors...")
    api_key = os.environ.get("SEC_API_KEY")
    
    if not api_key:
        print("SEC_API_KEY not found. Skipping SEC crawling.")
        return []

    queryApi = QueryApi(api_key=api_key)
    extractorApi = ExtractorApi(api_key=api_key)
    all_risk_docs = []

    for ticker in tickers:
        print(f"  -> Locating latest 10-K for {ticker}...")
        
        # 1. Find the URL of the most recent 10-K filing
        query = {
          "query": { "query_string": { "query": f"ticker:{ticker} AND formType:\"10-K\"" } },
          "from": "0", "size": "1", "sort": [{ "filedAt": { "order": "desc" } }]
        }
        
        try:
            response = queryApi.get_filings(query)
            filings = response.get('filings', [])
            
            if not filings:
                continue
                
            filing_url = filings[0]['linkToFilingDetails']
            published_date = filings[0]['filedAt']
            
            # 2. Extract specifically "Item 1A: Risk Factors"
            item_1a_text = extractorApi.get_section(filing_url, "1A", "text")
            
            # SEC filings are huge, let's clip it to the first 10,000 characters 
            # so we don't blow up the Groq LLM token limit.
            clipped_text = item_1a_text[:10000] if item_1a_text else ""
            
            if clipped_text:
                all_risk_docs.append({
                    "title": f"{ticker} SEC 10-K Risk Factors",
                    "link": filing_url,
                    "published": published_date,
                    "content": clipped_text,
                    "tickers": [ticker],
                    "source": "SEC EDGAR"
                })
        except Exception as e:
            print(f"  -> Failed to extract SEC data for {ticker}: {e}")

    print(f"Fetched {len(all_risk_docs)} SEC Risk Factor documents.")
    return all_risk_docs