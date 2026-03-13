# Project Blueprint: Stock Market Risk Review (Ripple Effect Predictor)

## Architecture Overview
A full-stack AI application designed to predict how localized geopolitical or environmental events create chain reactions across global supply chains and stock markets.

---

## Tech Stack

### 1. Frontend: User Interface
* **Framework:** Next.js (React)
* **Visualization:** react-force-graph (for rendering the interactive 2D/3D knowledge web)
* **Communication:** RESTful API calls to the FastAPI backend

### 2. Backend: Logic and Orchestration
* **Framework:** FastAPI (Python)
* **Orchestration:** LangChain or LlamaIndex to manage the GraphRAG logic and Neo4j drivers

### 3. Database: Knowledge Storage
* **Database:** Neo4j (Graph Database)
* **Query Language:** Cypher
* **Function:** Stores relationships between companies, suppliers, and regions to allow for rapid multi-hop pathfinding

---

## AI and Model Strategy (Dual-Model Cloud Approach)

The system utilizes the Google AI Studio (Gemini API) to separate background data processing from user-facing reasoning:

| Task | Model | Purpose |
| :--- | :--- | :--- |
| **The Data Worker** | Gemini 3 Flash | Background automation. Scans news and SEC filings to extract structured JSON (Entities and Relationships) for the graph. |
| **The Risk Advisor** | Gemini 3.1 Pro | User-facing intelligence. Queries the graph to explain complex risks and generate final advisory reports. |

---

## Core Logic: GraphRAG
Instead of retraining the model, this project uses Graph Retrieval-Augmented Generation (GraphRAG):
1.  **Ingest:** New news events are processed by Gemini 3 Flash.
2.  **Update:** The Neo4j graph is updated with new nodes and edges (e.g., a "Shutdown" event connected to a "Factory" node).
3.  **Query:** When a user asks a question, the backend searches Neo4j for relevant paths and dependencies.
4.  **Answer:** Gemini 3.1 Pro receives the specific graph paths and generates a logical risk assessment.

---

## Impact and Utility
* **Automated Alerts:** Triggers notifications when a news event impacts a node in a specific portfolio.
* **What-If Simulations:** Users can simulate events (e.g., "Suez Canal Blockage") to identify secondary or tertiary victims in the market.
* **Dependency Discovery:** Reveals non-obvious links between companies that are hidden in traditional flat financial data.
