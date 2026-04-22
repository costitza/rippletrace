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
    Fetches up to 2-hop graph connections.
    Uses the Python driver's native Path parsing to prevent Cypher null-pointer crashes.
    """
    # Simply return the anchor and the path. No complex Cypher unwinding.
    query = """
    MATCH (anchor)
    WHERE anchor.id = $entity_id OR anchor.name = $entity_id
    OPTIONAL MATCH path = (anchor)-[*1..2]-(m)

    WHERE NONE(n IN nodes(path) WHERE "Region" IN labels(n))
    RETURN anchor, path
    LIMIT 1000
    """
    try:
        result = session.run(query, entity_id=entity_id)
        
        nodes = {}
        links = []

        def register(node):
            if node is None: return None
            
            raw_id = node.get("id") or node.get("name") or str(getattr(node, "element_id", getattr(node, "id", "")))
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

        for record in result:
            # 1. ALWAYS register the anchor (prevents blank screens if 0 links exist)
            register(record["anchor"])
            
            # 2. Extract path safely
            path = record["path"]
            if path is not None:
                # Register all intermediate nodes
                for node in path.nodes:
                    register(node)
                    
                # Register all relationships in the path natively via Python
                for rel in path.relationships:
                    src_id = register(rel.start_node)
                    tgt_id = register(rel.end_node)
                    
                    if src_id and tgt_id:
                        links.append({
                            "source": src_id,
                            "target": tgt_id,
                            "type": rel.type
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