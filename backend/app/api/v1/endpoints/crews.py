from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ....core.crew import Crew, CrewConfig

router = APIRouter()

@router.post("/", response_model=Dict[str, Any])
async def create_crew(crew_config: CrewConfig) -> Dict[str, Any]:
    """Create and start a new crew"""
    try:
        crew = Crew(crew_config)
        return crew.kick_off()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{crew_id}/status", response_model=Dict[str, Any])
async def get_crew_status(crew_id: str) -> Dict[str, Any]:
    """Get the status of a crew"""
    try:
        # TODO: Implement crew persistence and retrieval
        raise HTTPException(status_code=501, detail="Not implemented yet")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
