from typing import List, Optional, Dict, Any
from pydantic.v1 import BaseModel
from crewai import Agent as CrewAIAgent
from langchain_openai import ChatOpenAI
from .memory import AgentMemory
from .tools import get_tool_by_config
from ..config import get_fixed_time

class AgentConfig(BaseModel):
    role: str
    goal: str
    backstory: str
    allow_delegation: bool = False
    verbose: bool = False
    memory_config: Optional[Dict[str, Any]] = None
    llm: str = "gpt-4"
    tools: List[Dict[str, Any]] = []

class Agent:
    def __init__(self, config: AgentConfig):
        self.config = config
        self.memory = AgentMemory(config.memory_config) if config.memory_config else None
        self.tools = [get_tool_by_config(tool) for tool in config.tools]
        self._agent = None

    @property
    def agent(self) -> CrewAIAgent:
        if self._agent is None:
            self._agent = CrewAIAgent(
                role=self.config.role,
                goal=self.config.goal,
                backstory=self.config.backstory,
                memory=self.memory,
                allow_delegation=self.config.allow_delegation,
                verbose=self.config.verbose,
                llm=ChatOpenAI(
                    model=self.config.llm,
                    temperature=0.7,
                ),
                tools=self.tools
            )
        return self._agent

    def execute_task(self, task: str) -> str:
        # Add fixed time to the task context
        task_with_time = f"{task}\nCurrent time: {get_fixed_time()}"
        return self.agent.execute_task(task_with_time)

    def get_memory(self) -> Optional[Dict[str, Any]]:
        return self.memory.get_state() if self.memory else None

    def update_memory(self, data: Dict[str, Any]) -> None:
        if self.memory:
            self.memory.update(data)
