from typing import Dict, Any, Optional
from crewai.tools import (
    BaseTool,
    SerperDevTool,
    CalculatorTool,
    SearchTool,
    WebsiteSearchTool
)

TOOL_REGISTRY = {
    "search": SearchTool,
    "calculator": CalculatorTool,
    "serper": SerperDevTool,
    "website": WebsiteSearchTool
}

def get_tool_by_config(config: Dict[str, Any]) -> Optional[BaseTool]:
    """Create a tool instance based on configuration"""
    tool_type = config.get("tool_type", "custom")
    tool_class = TOOL_REGISTRY.get(tool_type)
    
    if not tool_class:
        return None
        
    tool_config = config.get("configuration", {})
    return tool_class(**tool_config)

def register_tool(name: str, tool_class: type) -> None:
    """Register a new tool type"""
    TOOL_REGISTRY[name] = tool_class
