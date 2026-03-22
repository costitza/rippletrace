from fastapi import APIRouter, Depends, HTTPException
from .schemas import RiskQuery
from .dependencies import get_db

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
    """Fetches 10 recent articles and their associated company/ticker names."""
    query = """
    MATCH (a:Article)
    OPTIONAL MATCH (a)-[:REPORTS_ON]->(e)
    WHERE e:Company OR e:Ticker
    WITH a, collect(DISTINCT e.id) AS tickers
    RETURN a.title AS title, a.url AS url, a.published AS published, tickers
    ORDER BY a.published DESC
    LIMIT 10
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