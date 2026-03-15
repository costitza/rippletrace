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
            allowed_nodes=["Company", "Region", "Event", "Facility", "Product"],
            allowed_relationships=[ "LOCATED_IN", "SUPPLIES", "OWNS", "IMPACTS", "PRODUCES", "REQUIRES"
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
