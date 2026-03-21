# RippleTrace: Geopolitical and Supply Chain Risk Analysis

RippleTrace is a professional-grade full-stack application designed to model and predict the ripple effects of localized geopolitical, environmental, or economic events on global supply chains and financial markets. By utilizing Graph Retrieval-Augmented Generation (GraphRAG), the system identifies non-obvious dependencies and secondary risks that traditional flat-data analysis often misses.

## Core Concepts

### Graph Retrieval-Augmented Generation (GraphRAG)
Unlike standard RAG, which relies on vector similarity of text chunks, RippleTrace utilizes a Knowledge Graph (Neo4j) to represent the interconnected nature of the global economy. This allows the system to perform multi-hop reasoning, such as identifying how a labor strike in a specific port affects a semiconductor manufacturer, which in turn impacts a consumer electronics company. The graph structure enables the model to "traverse" relationships that are often buried in thousands of pages of text, providing a structural context that vector databases cannot easily replicate.

### Dual-Model AI Strategy
The system employs a tiered model architecture using the Google AI Studio API to optimize for both speed and reasoning depth:

1. **The Data Worker (gemini-3-flash-preview):** This model is optimized for high-throughput extraction. Its primary role is to act as a "structural parser," scanning massive volumes of unstructured news and regulatory data to identify specific nodes and edges. It is specifically prompted to ignore noise and focus on entities that fit our defined economic schema.
2. **The Risk Advisor (gemini-3.1-pro):** This is the high-intelligence "reasoning" layer. It does not see the raw news data; instead, it is provided with the specific sub-graph relevant to a user's query. Its job is to synthesize these paths—often 3 or 4 hops deep—into a coherent narrative that explains how a remote event translates into a financial risk for a specific portfolio.

## Technical Stack

### Frontend
- **Framework:** Next.js (React) with TypeScript.
- **Visualization:** react-force-graph for rendering interactive 2D and 3D knowledge webs, allowing users to navigate complex relationship clusters.
- **Styling:** Vanilla CSS for precise architectural control and performance.

### Backend
- **Framework:** FastAPI (Python) for high-performance asynchronous API endpoints.
- **Orchestration:** LangChain and LlamaIndex for managing the flow between the LLMs and the data sources.
- **Data Ingestion:** Custom crawlers for Yahoo Finance, SEC EDGAR, and Google News.

### Database
- **Graph Store:** Neo4j (AuraDB).
- **Query Language:** Cypher.
- **Schema:** Strict adherence to a predefined schema including Company, Region, Event, and Facility nodes to ensure data integrity and query efficiency.

## System Architecture

1. **Ingestion Phase:** The system periodically crawls financial news and regulatory filings.
2. **Extraction Phase:** The Data Worker identifies entities and their relationships based on a specialized extraction prompt.
3. **Graph Construction:** Relationships are merged into the Neo4j database using Cypher's `MERGE` operations to prevent duplication.
4. **Query & Analysis Phase:** When a risk query is initiated, the system traverses the graph to find all paths connecting the event to market entities.
5. **Advisory Generation:** The Risk Advisor interprets these paths to explain the "why" and "how" of the predicted market impact.

