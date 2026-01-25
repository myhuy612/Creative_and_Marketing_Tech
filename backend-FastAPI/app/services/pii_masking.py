import re

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-()]{7,}\d)")

def mask_pii(text: str) -> str:
    t = EMAIL_RE.sub("***", text)
    t = PHONE_RE.sub("***", t)
    return t
