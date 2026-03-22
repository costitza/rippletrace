# RippleTrace: Stock Market & Supply Chain Risk Predictor

## Project Overview
RippleTrace is a full-stack AI application designed to predict and visualize how localized geopolitical events, environmental disasters, or supply chain bottlenecks create chain reactions across global stock markets. 

By ingesting live financial news and SEC risk disclosures, the system builds a dynamic Knowledge Graph. This allows users to uncover hidden dependencies between raw materials, manufacturing facilities, companies, and their publicly traded stocks.

---

## Tech Stack & Architecture

### 1. Frontend: User Interface
* **Framework:** Next.js (React) with TypeScript
* **Styling:** Tailwind CSS & Shadcn/ui components
* **Visualization:** Interactive graph rendering for supply chain networks (planned via `react-force-graph`)
* **Communication:** RESTful API integration with the backend

### 2. Backend: API & Orchestration
* **Framework:** FastAPI (Python)
* **API Routing:** Modular endpoints (`/api/chat`, `/api/graph`) for querying risks and fetching graph topology
* **Orchestration:** LangChain for managing LLM graph extraction and Neo4j Cypher generation

### 3. Database: Knowledge Storage
* **Database:** Neo4j (Graph Database)
* **Query Language:** Cypher
* **Function:** Stores complex, multi-hop relationships (`SUPPLIES`, `IMPACTED_BY`, `LOCATED_IN`, `COMPETES_WITH`) between entities like Companies, Tickers, Risk Events, and Regions.

### 4. AI & Extraction Engine (Groq + Llama 3)
RippleTrace utilizes blazing-fast inference via Groq to perform complex Natural Language Processing (NLP) tasks:
* **Fast Extraction (Daily News):** `llama-3.1-8b-instant` rapidly processes breaking news from Alpaca and Yahoo Finance to identify immediate market shocks.
* **Deep Reasoning (SEC Filings):** `llama-3.3-70b-versatile` parses dense, 10,000+ character SEC 10-K filings to map structural, long-term supply chain vulnerabilities.

---

## Data Pipeline & Workflow

The project uses a highly modular data ingestion pipeline to feed the Neo4j database:

### Phase 1: Database Seeding
* **`seeding/seed_companies.py`:** Uses the `yfinance` API to pre-populate the database with "Anchor Nodes" (Official Company Names, Sectors, and Regions) based on a configured list of vulnerable stock tickers (`config/tickers.json`).

### Phase 2: Structural Risk Mapping (Annual/Quarterly)
* **`sec_filings_ingest.py`:** Leverages the `sec-api` to fetch the latest "Item 1A: Risk Factors" from corporate 10-K filings. This maps out the baseline vulnerabilities of a company (e.g., heavy reliance on Taiwanese semiconductor manufacturing).

### Phase 3: Breaking News Ingestion (Daily/Live)
* **`run_ingest.py`:** Runs daily to fetch live market news.
    * **Alpaca API:** Fetches breaking financial news directly tagged with affected stock tickers.
    * **Yahoo Finance:** Gathers broader market context and sentiment.
    * **Extraction:** Full article text is downloaded via `newspaper3k` and passed to LangChain's `LLMGraphTransformer`, which strictly formats the NLP output into nodes and edges to append to the Neo4j graph.

---

## Core Logic: Graph Retrieval-Augmented Generation (GraphRAG)

Instead of relying on a standard vector database, RippleTrace uses **GraphRAG**:
1. **Ingest:** News events and legal filings are processed into structured JSON entities and relationships.
2. **Graph Update:** The Neo4j graph connects a new `Risk_Event` (e.g., "Factory Fire") to a `Facility`, which `SUPPLIES` a `Company`, which `TRADES_AS` a `Ticker`.
3. **Query:** When a user asks about a stock's risk exposure, the backend runs Cypher queries to traverse these relationships.
4. **Answer:** The LLM receives the exact dependency paths and generates a highly accurate, hallucination-free risk assessment.

---

## Key Features & Utility
* **Dependency Discovery:** Reveals non-obvious links (e.g., how a drought in South America affects a European auto manufacturer's stock).
* **Automated Risk Tagging:** Breaking news is automatically linked to your monitored portfolio of tickers.
* **What-If Simulations:** Capable of tracing the secondary and tertiary victims of simulated market disruptions.