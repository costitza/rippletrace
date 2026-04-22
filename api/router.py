from fastapi import APIRouter, Depends, HTTPException
from .schemas import RiskQuery
from .dependencies import get_db
from fastapi import Path

# Create a router specifically for the /api prefix
router = APIRouter(prefix="/api")

@router.get("/companies")
def get_companies(session = Depends(get_db)):
    """Fetches a list of all companies in the database."""
    query = "MATCH (c:Company) RETURN DISTINCT c.id AS id, c.name AS name ORDER BY name"
    try:
        result = session.run(query)
        companies = [{"id": record["id"], "name": record["name"]} for record in result]
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

@router.get("/graph/{entity_id}")
def get_entity_graph(entity_id: str, session = Depends(get_db)):
    """
    Fetches 1-hop graph connections.
    Uses Cypher 'coalesce' and 'startNode()' to guarantee 100% accurate link mapping
    bypassing Python driver relationship reference issues.
    """
    query = """
    MATCH (n)
    WHERE n.id = $entity_id OR n.name = $entity_id
    OPTIONAL MATCH (n)-[r]-(m)
    WITH n, r, m, startNode(r) AS src, endNode(r) AS tgt
    RETURN 
        n, 
        m, 
        type(r) AS rel_type,
        coalesce(src.id, src.name, elementId(src)) AS src_id,
        coalesce(tgt.id, tgt.name, elementId(tgt)) AS tgt_id
    """
    try:
        result = session.run(query, entity_id=entity_id)
        records = list(result)
        
        nodes = {}
        links = []

        def register(node):
            if node is None: return None
            
            # Extract raw ID (fallback to driver-specific IDs if no property exists)
            raw_id = node.get("id") or node.get("name") or str(getattr(node, "element_id", getattr(node, "id", "")))
            
            # NORMALIZE: Strip and Uppercase
            d_id = str(raw_id).strip().upper()
            
            if d_id not in nodes:
                labels = list(node.labels)
                nodes[d_id] = {
                    "id": d_id, 
                    "label": labels[0] if labels else "Entity",
                    "properties": dict(node)
                }
            else:
                nodes[d_id]["properties"].update(dict(node))
                
            return d_id

        for record in records:
            # Register the nodes
            n_id = register(record["n"])
            m_id = register(record["m"])
            
            # Grab the direct strings from our new Cypher query
            rel_type = record["rel_type"]
            src_raw = record["src_id"]
            tgt_raw = record["tgt_id"]
            
            if rel_type and src_raw and tgt_raw:
                # Apply the exact same normalization to the link targets
                src_clean = str(src_raw).strip().upper()
                tgt_clean = str(tgt_raw).strip().upper()
                
                links.append({
                    "source": src_clean, 
                    "target": tgt_clean, 
                    "type": rel_type
                })
            
        # Deduplicate links
        unique_links = []
        seen = set()
        for l in links:
            key = (l["source"], l["target"], l["type"])
            if key not in seen:
                unique_links.append(l)
                seen.add(key)

        return {"nodes": list(nodes.values()), "links": unique_links}
        
    except Exception as e:
        print(f"Graph Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
