import json
import time
import os
from groq import Groq
from .utils import load_resource

class GroqExtractor:
    def __init__(self, model_name="llama-3.1-8b-instant"):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        self.model_name = model_name
        self.prompt_template = load_resource("extraction_prompt.txt")

    def extract(self, text, max_retries=3):
        print(f"Sending article to Groq {self.model_name}...")
        prompt = self.prompt_template.replace("{article_content}", text)
        
        retry_count = 0
        while retry_count <= max_retries:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a JSON extractor. Only output valid JSON."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    model=self.model_name,
                    response_format={"type": "json_object"}
                )

                response_text = chat_completion.choices[0].message.content

                if not response_text:
                    return None

                try:
                    return json.loads(response_text)
                except json.JSONDecodeError:
                    print("Error: Invalid JSON from Groq.")
                    retry_count += 1
                    
            except Exception as e:
                if "429" in str(e):
                    wait_time = 2 ** retry_count
                    print(f"Rate limit hit. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    retry_count += 1
                else:
                    print(f"An unexpected error occurred: {e}")
                    return None
        
        return None