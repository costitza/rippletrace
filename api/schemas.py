from pydantic import BaseModel

class RiskQuery(BaseModel):
    source_event: str
    target_company: str