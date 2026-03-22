from pydantic import BaseModel
from typing import List, Optional

class WordScore(BaseModel):
    word: str
    score: float

class ExpressionRequest(BaseModel):
    expression: str

class AnalogyRequest(BaseModel):
    positive: List[str]
    negative: List[str] = []

class AnalogyResponse(BaseModel):
    results: Optional[List[WordScore]] = None
    error: Optional[str] = None