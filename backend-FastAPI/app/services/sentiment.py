from transformers import pipeline
from app.core.config import settings

_sentiment_pipe = None

def get_sentiment_pipe():
    global _sentiment_pipe
    if _sentiment_pipe is None:
        _sentiment_pipe = pipeline(
            "sentiment-analysis",
            model=settings.model_name,
            tokenizer=settings.model_name,
        )
    return _sentiment_pipe

def normalize_label(label: str) -> str:
    l = label.lower()
    if "pos" in l or "positive" in l:
        return "pos"
    if "neu" in l or "neutral" in l:
        return "neu"
    if "neg" in l or "negative" in l:
        return "neg"
    return "neu"
