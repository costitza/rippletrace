import os
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq

class NewsTriage(BaseModel):
    is_actionable: bool = Field(description="True if the article reports a concrete physical or corporate event (e.g., strike, factory closure, merger, lawsuit). False if it is opinion, analyst ratings, stock-picking (e.g., 'Top 3 stocks to buy'), or generic market commentary.")
    reason: str = Field(description="A short 1-sentence explanation of why it was approved or rejected.")



def is_high_quality_news(title: str, content: str) -> bool:
    """
    uses llm to evaluate if article is waste of tokens or not
    """

    try:
        
        llm = ChatGroq(
            model = "llama-3.1-8b-instant",
            temperature=0,
            api_key=os.environ.get("GROQ_API_KEY"), # type: ignore
            max_retries=2
        )

        triage_agent = llm.with_structured_output(NewsTriage)

        prompt = f"""
        Evaluate this financial news article.
        Title: {title}
        Snippet: {content[:800]}
        """

        result = triage_agent.invoke(prompt)

        if isinstance(result, dict):
            is_actionable = result.get("is_actionable", True)
            reason = result.get("reason", "No reason provided.")
        else:
            is_actionable = getattr(result, "is_actionable", True)
            reason = getattr(result, "reason", "No reason provided.")
        
        status = " KEEP" if is_actionable else " DISCARD"
        print(f"  -> {status} | Reason: {reason}")
        
        return bool(is_actionable)
    
    except Exception as e:
        print(f"  ->  Triage failed, defaulting to True. Error: {e}")
        return True



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
