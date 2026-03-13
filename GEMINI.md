# RippleTrace: Project Context & Guidelines

## 1. Project Overview
RippleTrace is a full-stack AI application designed to predict how localized geopolitical or environmental events create chain reactions across global supply chains and stock markets.
**Core Mechanism:** It uses Graph Retrieval-Augmented Generation (GraphRAG). It ingests news, updates a Neo4j knowledge graph, and queries that graph to explain complex risks.

## 2. Tech Stack
- **Frontend:** Next.js (React), using `react-force-graph` for 2D/3D visual web rendering.
- **Backend:** FastAPI (Python), LangChain/LlamaIndex for orchestration.
- **Database:** Neo4j AuraDB.
- **AI SDK:** Strictly use the modern `google-genai` Python SDK (Do NOT use the legacy `google-generativeai` library).

## 3. AI Dual-Model Strategy
We use a specific two-model architecture via the Google AI Studio API:
- **The Data Worker (`gemini-3-flash-preview`):** Runs in the background. Responsible for reading raw text (news, SEC filings) and outputting strictly formatted JSON (Entities and Relationships).
- **The Risk Advisor (`gemini-3.1-pro`):** User-facing intelligence. Takes the extracted GraphRAG paths from Neo4j and writes human-readable advisory reports.

## 4. Neo4j Graph Schema
When writing Cypher queries or extraction prompts, strictly adhere to this schema:

**Nodes (Entities):**
- `Company` (e.g., TSMC, Apple)
- `Region` (e.g., Taiwan, California)
- `Event` (e.g., Earthquake, Labor Strike)
- `Facility` (e.g., Port of Los Angeles)

**Edges (Relationships):**
- `SUPPLIES` (Source: Company -> Target: Company)
- `LOCATED_IN` (Source: Company/Facility -> Target: Region)
- `DISRUPTS` (Source: Event -> Target: Region/Facility/Company)
- `DEPENDS_ON` (Source: Company -> Target: Facility/Company)

## 5. Coding Standards & Rules
- **Environment Variables:** All secrets (`NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `GEMINI_API_KEY`) must be loaded via `python-dotenv`. Never hardcode credentials.
- **Neo4j Cypher:** Use `MERGE` instead of `CREATE` when writing to the database to prevent duplicate nodes/edges.
- **Safety Checks:** When calling the Gemini API, always verify `if response.text:` exists before passing it to `json.loads()` to satisfy strict type-checking (Pylance).