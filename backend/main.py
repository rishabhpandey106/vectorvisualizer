from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from schema import AnalogyRequest, AnalogyResponse, ExpressionRequest
from service import solve_analogy, parse_expression, visualize_words
from model import word_exists

app = FastAPI(title="VectorVisualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "API is running"}

@app.post("/analogy", response_model=AnalogyResponse)
def analogy(req: AnalogyRequest):
    result = solve_analogy(req.positive, req.negative)
    return 

@app.post("/analogy/text", response_model=AnalogyResponse)
def analogy_text(req: ExpressionRequest):
    positive, negative = parse_expression(req.expression)
    return solve_analogy(positive, negative)

@app.get("/exists")
def check_word(word: str):
    return {
        "word": word,
        "exists": word_exists(word.lower())
    }

@app.post("/visualize")
def visualize(words: List[str] = Body(..., example=["man", "boy"])):
    """
    Visualize word vectors in 2D space.

    - Words are normalized (unit vectors)
    - First 2 dimensions are used for projection
    - Suitable for direction-based visualization
    """
    return visualize_words(words)