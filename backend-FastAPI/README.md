# backend-FastAPI

This FastAPI service lives inside the same repository as the Next.js app, but it is a separate Python project.

## Important: Always use venv during development
To avoid dependency conflicts (especially when Conda/Anaconda is installed), always run FastAPI commands using the venv
inside `backend-FastAPI/.venv`.

If your terminal auto-activates Conda `base`, you may still safely run commands by calling venv Python explicitly:
`./.venv/bin/python ...`

## Setup (venv)

```bash
cd backend-FastAPI

# Create venv using a stable Python (recommended: Python 3.10+)
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows (PowerShell)
# .venv\Scripts\Activate.ps1

python -m pip install -U pip setuptools wheel
python -m pip install -r requirements.txt
```

## Environment variables

```bash
cp .env.example .env
# Set DATABASE_URL, CORS_ORIGINS, MODEL_NAME
```

## Run (development)

### Option A (recommended): venv Python explicitly (prevents Conda conflicts)

```bash
cd backend-FastAPI
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

### Option B: activate venv then run

```bash
cd backend-FastAPI
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
```

## Notes
- `.venv/` should not be committed to git.
- If your IDE supports it, select `backend-FastAPI/.venv` as the Python interpreter.
- Supabase/Postgres must be initialized by running `scripts/supabase_schema.sql` in Supabase SQL Editor.
