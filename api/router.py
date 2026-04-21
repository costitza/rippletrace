from fastapi import APIRouter, Depends, HTTPException
from .schemas import RiskQuery
from .dependencies import get_db
from fastapi import Path

# Create a router specifically for the /api prefix
router = APIRouter(prefix="/api")

@router.get("/companies")
def get_companies(session = Depends(get_db)):
    """Fetches a list of all companies in the database."""
    query = "MATCH (c:Company) RETURN c.name AS name ORDER BY name"
    try:
        result = session.run(query)
        companies = [record["name"] for record in result]
        return {"companies": companies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/articles")
def get_articles(session = Depends(get_db)):
    """Fetches all articles and their associated company/ticker names."""
    query = """
    MATCH (a:Article)
    OPTIONAL MATCH (a)-[:REPORTS_ON]->(e)
    WHERE e:Company OR e:Ticker
    WITH a, collect(DISTINCT e.id) AS tickers
    RETURN a.title AS title, a.url AS url, a.published AS published, tickers
    ORDER BY a.published DESC
    """
    try:
        result = session.run(query)
        articles = [
            {
                "title": record["title"],
                "url": record["url"],
                "published": record["published"],
                "tickers": record["tickers"]
            }
            for record in result
        ]
        return {"articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/risk-assessment")
def assess_risk(query: RiskQuery, session = Depends(get_db)):
    """
    The core GraphRAG endpoint. 
    1. Searches Neo4j for a path between the event and the company.
    2. Passes that path to Gemini 3.1 Pro.
    """
    return {
        "message": f"Received query. Analyzing impact of '{query.source_event}' on '{query.target_company}'...",
        "raw_path": [],
        "ai_analysis": "AI generation coming soon."
    }

@router.get("/tickers")
def get_tickers(session = Depends(get_db)):
    """Fetches a list of all tickers available in the database."""
    query = "MATCH (t:Ticker) RETURN t.id AS ticker ORDER BY ticker"
    try:
        result = session.run(query)
        tickers = [record["ticker"] for record in result]
        return {"tickers": tickers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/company/details/{ticker}")
def get_company_details(ticker: str, session = Depends(get_db)):
    """Fetches details of the company associated with a specific ticker."""
    query = """
    MATCH (t {id: $ticker})<-[:TRADES_AS]-(c:Company)
    RETURN c
    """
    try:
        result = session.run(query, ticker=ticker.upper())
        record = result.single()
        if record:
            return dict(record["c"])
        else:
            query_fb = "MATCH (c:Company {id: $ticker}) RETURN c"
            result_fb = session.run(query_fb, ticker=ticker.upper())
            record_fb = result_fb.single()
            if record_fb:
                return dict(record_fb["c"])
            return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph/{ticker}")
def get_ticker_graph(ticker: str = Path(..., description="The ticker ID to search for"), session = Depends(get_db)):
    """
    Fetches EVERYTHING in a 2-hop radius of the ticker.
    Standardizes ID mapping to ensure relationships (links) are correctly identified.
    """
    query = """
    MATCH (n {id: $ticker})
    OPTIONAL MATCH (n)-[r1]-(m)
    OPTIONAL MATCH (m)-[r2]-(o)
    WHERE o IS NULL OR o <> n
    RETURN n, r1, m, r2, o
    LIMIT 1000
    """
    try:
        result = session.run(query, ticker=ticker.upper())
        records = list(result)
        
        nodes = {}
        links = []
        # Identity Map: element_id -> frontend display_id
        # Standardizing on string element_ids for maximum reliability
        internal_to_display = {}

        def register(node):
            if node is None: return None
            # Unique ID for graph display (id property > name property > element_id)
            d_id = node.get("id") or node.get("name") or str(node.element_id)
            if d_id not in nodes:
                labels = list(node.labels)
                nodes[d_id] = {
                    "id": d_id,
                    "label": labels[0] if labels else "Entity",
                    "properties": dict(node)
                }
            internal_to_display[node.element_id] = d_id
            return d_id

        # Pass 1: Extract all unique nodes
        for record in records:
            register(record["n"])
            register(record["m"])
            register(record["o"])

        # Pass 2: Map relationships using the identity map
        for record in records:
            # Relationship 1 (Ticker <-> Neighbor)
            r1 = record["r1"]
            if r1:
                src = internal_to_display.get(r1.start_node)
                tgt = internal_to_display.get(r1.end_node)
                if src and tgt:
                    links.append({"source": src, "target": tgt, "type": r1.type})
            
            # Relationship 2 (Neighbor <-> Next Neighbor)
            r2 = record["r2"]
            if r2:
                src2 = internal_to_display.get(r2.start_node)
                tgt2 = internal_to_display.get(r2.end_node)
                if src2 and tgt2:
                    links.append({"source": src2, "target": tgt2, "type": r2.type})
            
        # Semantic deduplication to avoid cluttered graph
        unique_links = []
        seen = set()
        for l in links:
            # Sort source/target so direction doesn't double-link but preserved for display
            key = tuple(sorted([l["source"], l["target"]])) + (l["type"],)
            if key not in seen:
                unique_links.append(l)
                seen.add(key)

        return {"nodes": list(nodes.values()), "links": unique_links}
    except Exception as e:
        print(f"Graph Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
