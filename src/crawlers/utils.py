import os
from bs4 import BeautifulSoup

def load_resource(filename, default_content=""):
    # Prompts are in the root prompts/ folder
    base_dir = os.path.dirname(os.path.dirname(__file__))
    filepath = os.path.join(base_dir, "prompts", filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return f.read().strip()
    return default_content

def clean_html(raw_html):
    """Removes HTML tags from the news summary to give Gemini clean text."""
    soup = BeautifulSoup(raw_html, "html.parser")
    return soup.get_text(strip=True)
