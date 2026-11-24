from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import context, health, meta, naming
from app.services.llm import NamingLLMService


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Stanamer", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.llm_service = NamingLLMService(settings)

    app.include_router(health.router, prefix="/api")
    app.include_router(meta.router, prefix="/api")
    app.include_router(naming.router, prefix="/api")
    app.include_router(context.router, prefix="/api")

    return app


app = create_app()
