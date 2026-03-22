from model import compute_analogy, word_exists, normalize_vector, get_vector, compute_similarity, project_to_2d
import re
import numpy as np
from sklearn.decomposition import PCA
from cache import get_cache, set_cache

def normalize(words):
    return [w.lower().strip() for w in words if w.strip()]

def validate_words(words):
    return [w for w in words if not word_exists(w)]

def solve_analogy(positive, negative, top_k=5):
    positive = normalize(positive)
    negative = normalize(negative)

    if not positive:
        return {"error": "Positive words cannot be empty"}

    unknown = validate_words(positive + negative)
    if unknown:
        return {"error": f"Unknown words: {unknown}"}

    try:
        results = compute_analogy(positive, negative, top_k)

        return {
            "results": [
                {"word": word, "score": float(score)}
                for word, score in results
            ]
        }

    except Exception as e:
        return {"error": str(e)}

def parse_expression(expression: str):
    tokens = re.findall(r"[+-]|[a-zA-Z]+", expression)

    positive = []
    negative = []
    mode = "positive"

    for token in tokens:
        if token == "+":
            mode = "positive"
        elif token == "-":
            mode = "negative"
        else:
            if mode == "positive":
                positive.append(token)
            else:
                negative.append(token)

    return positive, negative

def visualize_words(words):
    words = [w.lower().strip() for w in words if w.strip()]

    if len(words) < 2:
        return {"error": "At least 2 words required"}

    unknown = [w for w in words if not word_exists(w)]
    if unknown:
        return {"error": f"Unknown words: {unknown}"}
    
    cache_key = make_cache_key("visualize", words)
    cached = get_cache(cache_key)
    if cached:
        print("Retrieved Cached Result")
        return cached

    try:
        vectors = []

        for w in words:
            vec = get_vector(w)
            vec = normalize_vector(vec)  # 🔥 key step
            vectors.append(vec)

        vectors = np.array(vectors)

        vectors_2d = project_to_2d(vectors)
        # similarity between first 2 words
        similarity = float(compute_similarity(words[0], words[1]))

        # Use first 2 dimensions directly (stable + direction-preserving)
        # vectors_2d = vectors[:, :2]
        # pca = PCA(n_components=2)
        # vectors_2d = pca.fit_transform(vectors)

        result = {
            "words": words,
            "similarity": similarity,
            "vectors_2d": [
                {
                    "word": words[i],
                    "x": float(vectors_2d[i][0]),
                    "y": float(vectors_2d[i][1])
                }
                for i in range(len(words))
            ],
            "note": "2D projection is approximate. Similarity score is more accurate."
        }

        set_cache(cache_key, result)

        return result
    except Exception as e:
        return {"error": str(e)}
    
def make_cache_key(prefix: str, words):
    words = sorted([w.lower().strip() for w in words])
    return f"{prefix}:{'_'.join(words)}"