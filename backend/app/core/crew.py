from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from crewai import Crew as CrewAICrew, Process
from .agent import Agent, AgentConfig
from .task import Task, TaskConfig
from ..config import get_fixed_time

class CrewConfig(BaseModel):
    agents: List[AgentConfig]
    tasks: List[TaskConfig]
    process: Process = Process.sequential
    verbose: bool = False
    max_rpm: Optional[int] = None
    temperature: float = 0.7
    config: Optional[Dict[str, Any]] = None

class Crew:
    def __init__(self, config: CrewConfig):
        self.config = config
        self.agents = [Agent(agent_config) for agent_config in config.agents]
        self.tasks = [Task(task_config) for task_config in config.tasks]
        self._crew = None

    @property
    def crew(self) -> CrewAICrew:
        if self._crew is None:
            self._crew = CrewAICrew(
                agents=[agent.agent for agent in self.agents],
                tasks=[task.task for task in self.tasks],
                process=self.config.process,
                verbose=self.config.verbose,
                max_rpm=self.config.max_rpm,
                config=self.config.config or {
                    "enable_human_validation": True,
                    "max_retries": 3,
                    "timeout_seconds": 600,
                    "cost_limit": None,
                    "start_time": get_fixed_time()
                }
            )
        return self._crew

    def kick_off(self) -> Dict[str, Any]:
        """Start the crew's work and return results"""
        results = self.crew.kick_off()
        return {
            "results": results,
            "start_time": get_fixed_time(),
            "agents": [
                {
                    "role": agent.config.role,
                    "memory": agent.get_memory()
                }
                for agent in self.agents
            ]
        }

    def get_status(self) -> Dict[str, Any]:
        """Get the current status of the crew"""
        return {
            "process": str(self.config.process),
            "agents_count": len(self.agents),
            "tasks_count": len(self.tasks),
            "config": self.config.config,
            "last_update": get_fixed_time()
        }
