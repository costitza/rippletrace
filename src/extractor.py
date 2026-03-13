import json
from google import genai
from google.genai import types
from .utils import load_resource

class GeminiExtractor:
    def __init__(self, model_name="gemini-3-flash-preview"):
        self.client = genai.Client()
        self.model_name = model_name
        self.prompt_template = load_resource("extraction_prompt.txt")

    def extract(self, text):
        print(f"Sending article to {self.model_name}...")
        prompt = self.prompt_template.replace("{article_content}", text)
        
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
            return None
