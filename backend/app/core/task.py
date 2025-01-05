from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from crewai import Task as CrewAITask
from .tools import get_tool_by_config

class TaskConfig(BaseModel):
    description: str
    agent_role: str
    expected_output: Optional[str] = None
    tools: List[Dict[str, Any]] = []
    async_execution: bool = False
    output_file: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    human_validation: bool = False
    dependencies: List[str] = []
    priority: Optional[int] = None

class Task:
    def __init__(self, config: TaskConfig):
        self.config = config
        self.tools = [get_tool_by_config(tool) for tool in config.tools]
        self._task = None

    @property
    def task(self) -> CrewAITask:
        if self._task is None:
            self._task = CrewAITask(
                description=self.config.description,
                agent_role=self.config.agent_role,
                expected_output=self.config.expected_output,
                tools=self.tools,
                async_execution=self.config.async_execution,
                output_file=self.config.output_file,
                context=self.config.context,
                human_validation=self.config.human_validation,
                dependencies=self.config.dependencies,
                priority=self.config.priority
            )
        return self._task

    def to_dict(self) -> Dict[str, Any]:
        return {
            "description": self.config.description,
            "agent_role": self.config.agent_role,
            "expected_output": self.config.expected_output,
            "tools": [str(tool) for tool in self.tools],
            "async_execution": self.config.async_execution,
            "output_file": self.config.output_file,
            "context": self.config.context,
            "human_validation": self.config.human_validation,
            "dependencies": self.config.dependencies,
            "priority": self.config.priority
        }
