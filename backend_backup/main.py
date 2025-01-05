from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool, SerperDevTool, CalculatorTool, SearchTool
from crewai.agents.cache import AgentCache
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

class AgentCreate(BaseModel):
    role: str
    goal: str
    backstory: str
    allow_delegation: bool = False
    verbose: bool = False
    memory: Optional[bool] = False
    llm: Optional[str] = "gpt-4"
    tools: List[ToolConfig] = []
    human_input: bool = False

class TaskCreate(BaseModel):
    description: str
    agent_role: str
    expected_output: Optional[str] = None
    tools: List[ToolConfig] = []
    async_execution: bool = False
    output_file: Optional[str] = None
    context: Optional[str] = None
    human_validation: bool = False

class CrewCreate(BaseModel):
    agents: List[AgentCreate]
    tasks: List[TaskCreate]
    process: Process = Process.sequential
    verbose: bool = False
    max_rpm: Optional[int] = None
    temperature: float = 0.7
    cache: bool = False

def get_tool(tool_config: ToolConfig) -> BaseTool:
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

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/crews")
async def create_crew(crew_data: CrewCreate):
    try:
        # Configure cache if enabled
        if crew_data.cache:
            AgentCache.enable()
        
        # Create agents with specified LLMs and tools
        agents = []
        for agent_data in crew_data.agents:
            # Configure tools for the agent
            agent_tools = [get_tool(tool) for tool in agent_data.tools if get_tool(tool)]
            
            agent = Agent(
                role=agent_data.role,
                goal=agent_data.goal,
                backstory=agent_data.backstory,
                allow_delegation=agent_data.allow_delegation,
                verbose=agent_data.verbose,
                memory=agent_data.memory,
                llm=ChatOpenAI(
                    model=agent_data.llm,
                    temperature=crew_data.temperature
                ),
                tools=agent_tools if agent_tools else None,
                human_input=agent_data.human_input
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
            
            task = Task(
                description=task_data.description,
                agent=agent,
                expected_output=task_data.expected_output,
                tools=task_tools if task_tools else None,
                async_execution=task_data.async_execution,
                output_file=task_data.output_file,
                context=task_data.context,
                human_validation=task_data.human_validation
            )
            tasks.append(task)

        # Create and run crew with configuration
        crew = Crew(
            agents=agents,
            tasks=tasks,
            process=crew_data.process,
            verbose=crew_data.verbose,
            max_rpm=crew_data.max_rpm
        )

        result = crew.kickoff()
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
