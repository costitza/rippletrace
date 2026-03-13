import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


DUMMY_ARTICLE = """
Breaking: A massive labor strike has paralyzed the Port of Los Angeles today. 
The shutdown is expected to cause immediate delays for major electronics 
importers. Apple, which relies heavily on this port to receive microchips 
from TSMC in Taiwan, has warned of potential Q3 shortages.
"""

# 3. The Extraction Prompt
EXTRACTION_PROMPT = f"""
You are an expert supply chain data extractor. Your job is to read the following news article 
and extract a structured knowledge graph containing Entities (Nodes) and Relationships (Edges).

News Article:
{DUMMY_ARTICLE}

Extract the data strictly in the following JSON format:
{{
  "entities": [
    {{"id": "entity_name", "type": "Company | Region | Event | Facility"}}
  ],
  "relationships": [
    {{"source": "entity_name", "target": "entity_name", "type": "SUPPLIES | LOCATED_IN | DISRUPTS | DEPENDS_ON"}}
  ]
}}

Return ONLY valid JSON. Do not include markdown formatting or explanations.
"""


def extract_graph_data():
    print("sending article to model")

    client = genai.Client()


    response = client.models.generate_content(
        model = "gemini-3-flash-preview",
        contents=EXTRACTION_PROMPT,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    try:
        # SAFETY CHECK
        if not response.text:
            print("Error: Gemini returned an empty response (might be a safety block).")
            return None
            
        # Parse the JSON string into a Python dictionary
        graph_data = json.loads(response.text)
        
        print("\n--- Extracted Data ---")
        print(json.dumps(graph_data, indent=2))
        return graph_data
        
    except json.JSONDecodeError:
        print("Error: Gemini did not return valid JSON.")
        print("Raw output:", response.text)

if __name__ == "__main__":
    extract_graph_data()





