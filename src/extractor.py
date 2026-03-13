import json
import time
import random
from google import genai
from google.genai import types, errors
from .utils import load_resource

class GeminiExtractor:
    def __init__(self, model_name="gemini-3-flash-preview"):
        self.client = genai.Client()
        self.model_name = model_name
        self.prompt_template = load_resource("extraction_prompt.txt")

    def extract(self, text, max_retries=5):
        print(f"Sending article to {self.model_name}...")
        prompt = self.prompt_template.replace("{article_content}", text)
        
        retry_count = 0
        while retry_count <= max_retries:
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )

                if not response.text:
                    return None

                try:
                    return json.loads(response.text)
                except json.JSONDecodeError:
                    print("Error: Invalid JSON from Gemini.")
                    return None
                    
            except Exception as e:
                # Handle Rate Limits (429) specifically if possible, or general errors
                if "429" in str(e) or "quota" in str(e).lower():
                    wait_time = (2 ** retry_count) + random.random()
                    print(f"Rate limit hit. Retrying in {wait_time:.2f} seconds... (Attempt {retry_count + 1}/{max_retries})")
                    time.sleep(wait_time)
                    retry_count += 1
                else:
                    print(f"An unexpected error occurred: {e}")
                    return None
        
        print("Max retries exceeded. Skipping article.")
        return None
