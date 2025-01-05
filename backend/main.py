from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic.v1 import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool, SerperDevTool, CalculatorTool, SearchTool
from crewai.agents.cache import AgentCache
from crewai.agents import HierarchicalAgent
from crewai.tasks import HierarchicalTask
from crewai.process import HierarchicalProcess
from dotenv import load_dotenv
import os
import uvicorn
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# Configure OpenAI
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable is not set")

app = FastAPI(title="CrewAI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ToolConfig(BaseModel):
    name: str
    description: Optional[str] = None
    tool_type: str = "custom"  # custom, search, calculator, etc.
    configuration: Optional[Dict[str, Any]] = None

class AgentMemoryConfig(BaseModel):
    type: str = "short_term"  # short_term, long_term
    configuration: Optional[Dict[str, Any]] = None

class AgentCreate(BaseModel):
    role: str
    goal: str
    backstory: str
    allow_delegation: bool = False
    verbose: bool = False
    memory: Optional[AgentMemoryConfig] = None
    llm: Optional[str] = "gpt-4"
    tools: List[ToolConfig] = []
    human_input: bool = False
    max_iterations: Optional[int] = None
    max_rpm: Optional[int] = None
    temperature: Optional[float] = None
    is_hierarchical: bool = False

class TaskCreate(BaseModel):
    description: str
    agent_role: str
    expected_output: Optional[str] = None
    tools: List[ToolConfig] = []
    async_execution: bool = False
    output_file: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    human_validation: bool = False
    dependencies: List[str] = []
    priority: Optional[int] = None
    is_hierarchical: bool = False
    subtasks: List[Any] = []

TaskCreate.update_forward_refs(locals())

class CrewCreate(BaseModel):
    agents: List[AgentCreate]
    tasks: List[TaskCreate]
    process: Process = Process.sequential
    verbose: bool = False
    max_rpm: Optional[int] = None
    temperature: float = 0.7
    cache: bool = False
    config: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "enable_human_validation": True,
            "max_retries": 3,
            "timeout_seconds": 600,
            "cost_limit": None
        }
    )

def get_tool(tool_config: ToolConfig) -> Optional[BaseTool]:
    if tool_config.tool_type == "search":
        return SearchTool()
    elif tool_config.tool_type == "calculator":
        return CalculatorTool()
    elif tool_config.tool_type == "serper":
        if not os.getenv("SERPER_API_KEY"):
            raise ValueError("SERPER_API_KEY environment variable is not set")
        return SerperDevTool()
    else:
        # Custom tool implementation can be added here
        return None

# Add fixed time function
def get_fixed_time():
    """Return a fixed time for consistency across the application."""
    return "2025-01-05T17:00:02+01:00"

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/crews")
async def create_crew(crew_data: CrewCreate):
    try:
        # Get the fixed time
        fixed_time = get_fixed_time()
        
        # Configure cache if enabled
        if crew_data.cache:
            AgentCache.enable()
        
        # Create agents with specified LLMs and tools
        agents = []
        for agent_data in crew_data.agents:
            # Configure tools for the agent
            agent_tools = [get_tool(tool) for tool in agent_data.tools if get_tool(tool)]
            
            # Configure memory if specified
            memory_config = None
            if agent_data.memory:
                memory_config = {
                    "type": agent_data.memory.type,
                    **(agent_data.memory.configuration or {})
                }
            
            # Create agent class based on type
            agent_class = HierarchicalAgent if agent_data.is_hierarchical else Agent
            
            agent = agent_class(
                role=agent_data.role,
                goal=agent_data.goal,
                backstory=agent_data.backstory,
                allow_delegation=agent_data.allow_delegation,
                verbose=agent_data.verbose,
                memory=memory_config,
                llm=ChatOpenAI(
                    model=agent_data.llm,
                    temperature=agent_data.temperature or crew_data.temperature
                ),
                tools=agent_tools if agent_tools else None,
                human_input=agent_data.human_input,
                max_iterations=agent_data.max_iterations,
                max_rpm=agent_data.max_rpm or crew_data.max_rpm
            )
            agents.append(agent)

        # Create tasks with tools and human validation
        tasks = []
        for task_data in crew_data.tasks:
            # Get the assigned agent
            agent = next(
                (agent for agent in agents if agent.role == task_data.agent_role),
                None
            )
            if not agent:
                raise ValueError(f"No agent found with role: {task_data.agent_role}")

            # Configure tools for the task
            task_tools = [get_tool(tool) for tool in task_data.tools if get_tool(tool)]
            
            # Create task class based on type
            task_class = HierarchicalTask if task_data.is_hierarchical else Task
            
            task = task_class(
                description=task_data.description,
                agent=agent,
                expected_output=task_data.expected_output,
                tools=task_tools if task_tools else None,
                async_execution=task_data.async_execution,
                output_file=task_data.output_file,
                context=task_data.context,
                human_validation=task_data.human_validation,
                dependencies=task_data.dependencies,
                priority=task_data.priority
            )
            tasks.append(task)

        # Create and run crew with configuration
        crew = Crew(
            agents=agents,
            tasks=tasks,
            process=crew_data.process,
            verbose=crew_data.verbose,
            max_rpm=crew_data.max_rpm,
            temperature=crew_data.temperature,
            config={
                **crew_data.config,
                "start_time": fixed_time  # Add fixed start time
            } if crew_data.config else {"start_time": fixed_time}
        )

        result = crew.kickoff()
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
