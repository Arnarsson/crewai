from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ....core.agent import Agent, AgentConfig

router = APIRouter()

@router.post("/", response_model=Dict[str, Any])
async def create_agent(agent_config: AgentConfig) -> Dict[str, Any]:
    """Create a new agent"""
    try:
        agent = Agent(agent_config)
        return {
            "role": agent.config.role,
            "goal": agent.config.goal,
            "backstory": agent.config.backstory,
            "tools": [str(tool) for tool in agent.tools]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{agent_id}/execute", response_model=Dict[str, Any])
async def execute_task(agent_id: str, task: str) -> Dict[str, Any]:
    """Execute a task with an agent"""
    try:
        # TODO: Implement agent persistence and retrieval
        raise HTTPException(status_code=501, detail="Not implemented yet")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
