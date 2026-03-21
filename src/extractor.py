import os
from langchain_groq import ChatGroq
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_core.documents import Document



class GroqExtractor:
    def __init__(self, model_name="llama-3.1-8b-instant"):
        self.llm = ChatGroq(
            model=model_name,
            temperature=0,
            api_key=os.environ.get("GROQ_API_KEY"), # type: ignore
            max_retries=3
        )

        self.graph_transformer = LLMGraphTransformer(
            llm=self.llm,
            # Expanded list of allowed entities
            allowed_nodes=[
                "Company", "Ticker", "Sector", "Region", "Risk_Event", 
                "Product", "Raw_Material", "Financial_Metric", 
                "Person", "Organization", "Government_Body", "Market_Index"
            ],
            # Expanded list of allowed connections
            allowed_relationships=[ 
                # Supply Chain & Core Operations
                "LOCATED_IN", "SUPPLIES", "OWNS", "PRODUCES", "REQUIRES", 
                "DEPENDS_ON", "MANUFACTURED", "MANUFACTURED_BY", "DEVELOPED", "DEVELOPED_BY",
                
                # Risk & Disruptions
                "IMPACTS", "IMPACTED_BY", "EXPOSED_TO", "VULNERABLE_TO", 
                
                # Financial & Corporate Actions
                "TRADES_AS", "AFFECTS_STOCK", "OPERATES_IN", "IMPACTS_METRIC",
                "LISTED_ON", "COMPETES_WITH", "PARTNERED_WITH", "ACQUIRED_BY",
                
                # People, Analysts, and Media
                "EMPLOYED_BY", "LEADS", "ANALYZED", "REPORTS", "INVESTS_IN"
            ]
        )
        

    def extract(self, text : str, metadata : dict):
        print(f"sending article to groq {self.llm.model_name} via langchain..")

        doc = Document(page_content=text, metadata=metadata)

        try:
            graph_docs = self.graph_transformer.convert_to_graph_documents([doc])
            return graph_docs
        except Exception as e:
            print(f"Extraction failed: {e}")
            return None
