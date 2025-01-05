from typing import Dict, Any, Optional
from pydantic import BaseModel
import json
from datetime import datetime
from ..config import get_fixed_time

class MemoryState(BaseModel):
    type: str
    data: Dict[str, Any]
    last_updated: str

class AgentMemory:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {"type": "short_term"}
        self.state = MemoryState(
            type=self.config["type"],
            data={},
            last_updated=get_fixed_time()
        )

    def update(self, data: Dict[str, Any]) -> None:
        self.state.data.update(data)
        self.state.last_updated = get_fixed_time()

    def get_state(self) -> Dict[str, Any]:
        return self.state.dict()

    def clear(self) -> None:
        self.state.data = {}
        self.state.last_updated = get_fixed_time()

    def get_context(self) -> str:
        """Returns a formatted string of the memory context"""
        if not self.state.data:
            return ""
        
        context_parts = []
        for key, value in self.state.data.items():
            if isinstance(value, (dict, list)):
                value = json.dumps(value, indent=2)
            context_parts.append(f"{key}: {value}")
        
        return "\n".join(context_parts)
