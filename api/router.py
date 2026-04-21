from fastapi import APIRouter, Depends, HTTPException
from .schemas import RiskQuery
from .dependencies import get_db
from fastapi import Path

# Create a router specifically for the /api prefix
router = APIRouter(prefix="/api")

@router.get("/companies")
def get_companies(session = Depends(get_db)):
    """Fetches a list of all companies in the database."""
    query = "MATCH (c:Company) RETURN c.id AS id, c.name AS name ORDER BY name"
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
    Fetches only nodes DIRECTLY connected to the entity (1-hop).
    Ensures robust ID mapping to remove duplicates and fix rendering lines.
    """
    query = """
    MATCH (n {id: $entity_id})
    OPTIONAL MATCH (n)-[r]-(m)
    RETURN n, r, m
    """
    try:
        result = session.run(query, entity_id=entity_id)
        records = list(result)
        
        nodes = {}
        links = []
        id_map = {}

        def register(node):
            if node is None: return None
            # Standardize ID: property 'id' is our primary key
            d_id = node.get("id") or node.get("name") or str(node.element_id)
            if d_id not in nodes:
                labels = list(node.labels)
                nodes[d_id] = {
                    "id": d_id,
                    "label": labels[0] if labels else "Entity",
                    "properties": dict(node)
                }
            # Map both element_id and numeric id to d_id
            id_map[node.element_id] = d_id
            try:
                id_map[node.id] = d_id
            except:
                pass
            return d_id

        for record in records:
            n_id = register(record["n"])
            m_id = register(record["m"])
            
            r = record["r"]
            if r and n_id and m_id:
                # Get mapped IDs for the link
                src = id_map.get(r.start_node)
                tgt = id_map.get(r.end_node)
                if src and tgt:
                    links.append({"source": src, "target": tgt, "type": r.type})
            
        # Deduplicate links
        unique_links = []
        seen = set()
        for l in links:
            # Directional key to preserve semantics but remove exact duplicates
            key = (l["source"], l["target"], l["type"])
            if key not in seen:
                unique_links.append(l)
                seen.add(key)

        return {"nodes": list(nodes.values()), "links": unique_links}
    except Exception as e:
        print(f"Graph Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
