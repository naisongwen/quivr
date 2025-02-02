from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://quivr.app",
    "https://zhishi.zeabur.app",
    "https://quivr.zeabur.app",
    "https://www.quivr.app",
    "http://quivr.app",
    "http://www.quivr.app"
]


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
