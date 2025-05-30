### server/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from config import MODEL_NAME

app = FastAPI()
model = SentenceTransformer(MODEL_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    query: str
    corpus: list[str]

@app.post("/match")
def match(req: MatchRequest):
    query_embedding = model.encode(req.query, convert_to_tensor=True)
    corpus_embeddings = model.encode(req.corpus, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(query_embedding, corpus_embeddings)[0]
    best_idx = similarities.argmax().item()
    best_score = similarities[best_idx].item()
    return {
        "matched": req.corpus[best_idx],
        "score": round(best_score, 3)
    }