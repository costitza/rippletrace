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
    

@router.get("/graph/{ticker}")
def get_ticker_graph(ticker: str = Path(..., description="The ticker ID to search for"), session = Depends(get_db)):
    """Fetches the immediate subgraph (nodes and links) for a specific ticker."""
    query = """
    MATCH (n {id: $ticker})-[r]-(m)
    RETURN n, r, m
    LIMIT 100
    """
    try:
        result = session.run(query, ticker=ticker.upper())
        
        nodes = {}
        links = []
        
        for record in result:
            n = record["n"]
            m = record["m"]
            r = record["r"]
            
            # Helper to extract a usable ID and label
            def parse_node(node):
                node_id = node.get("id") or node.get("name") or str(node.element_id)
                labels = list(node.labels)
                return {"id": node_id, "label": labels[0] if labels else "Unknown", "properties": dict(node)}
            
            n_data = parse_node(n)
            m_data = parse_node(m)
            
            nodes[n_data["id"]] = n_data
            nodes[m_data["id"]] = m_data
            
            links.append({
                "source": n_data["id"] if r.start_node == n else m_data["id"],
                "target": m_data["id"] if r.start_node == n else n_data["id"],
                "type": r.type
            })
            
        return {
            "nodes": list(nodes.values()),
            "links": links
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))