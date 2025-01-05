from fastapi import APIRouter
from .endpoints import crews, agents

api_router = APIRouter()
api_router.include_router(crews.router, prefix="/crews", tags=["crews"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
