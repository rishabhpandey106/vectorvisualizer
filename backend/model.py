from gensim.downloader import load
import numpy as np
from sklearn.decomposition import PCA

model = None
pca = None
sample_vectors = None

def get_model():
    global model, pca, sample_vectors
    if model is None:
        print("Loading model... please wait")
        model = load("glove-wiki-gigaword-100")
    
    if pca is None:
        print("🔄 Building global PCA projection...")
        # took subset 
        sample_words = list(model.key_to_index.keys())[:10000]

        sample_vectors = np.array([
            normalize_vector(model[w]) for w in sample_words
        ])

        # Fit PCA ONCE
        pca = PCA(n_components=2)
        pca.fit(sample_vectors)

        print("✅ PCA ready")

    return model


def compute_analogy(positive, negative, top_k=5):
    m = get_model()

    result = m.most_similar(
        positive=positive,
        negative=negative,
        topn=top_k
    )

    return result  # (word, score)


def word_exists(word: str) -> bool:
    m = get_model()

    return word in m.key_to_index

def get_vector(word: str):
    m = get_model()
    return m[word]


def normalize_vector(vec):
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec
    return vec / norm

def compute_similarity(word1: str, word2: str):
    m = get_model()
    return m.similarity(word1, word2)

def project_to_2d(vectors):
    m = get_model()
    return pca.transform(vectors)