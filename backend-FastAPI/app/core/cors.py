from fastapi.middleware.cors import CORSMiddleware

def add_cors(app, origins_csv: str):
    origins = [o.strip() for o in origins_csv.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
