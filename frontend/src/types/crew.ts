import { ModelType } from '@/lib/api';

export type AgentRole = string;

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'pending_review';
export type TaskStatus = 'idle' | 'running' | 'completed' | 'failed' | 'pending_review';
export type CrewStatus = 'draft' | 'running' | 'completed' | 'failed';
export type ProcessType = 'sequential' | 'hierarchical' | 'parallel';

export interface ToolConfiguration {
  name: string;
  description?: string;
  tool_type: string;
  configuration?: Record<string, any>;
}

export interface AgentMemoryConfig {
  type: 'short_term' | 'long_term';
  configuration: {
    max_messages?: number;
    storage_type?: string;
  };
}

export interface Tool {
  name: string;
  tool_type: string;
  description?: string;
}

export interface Agent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools: ToolConfiguration[];
  allowDelegation: boolean;
  verbose: boolean;
  status: AgentStatus;
  model?: ModelType;
  memory?: AgentMemoryConfig;
  maxIterations?: number;
  maxRpm?: number;
  temperature?: number;
  isHierarchical?: boolean;
  humanInput?: boolean;
}

export interface TaskResult {
  prompt: string;
  analysis: string[];
  tools: string[];
  delegationEnabled: boolean;
  verboseMode: boolean;
  tokenCount: number;
  cost: number;
  artifacts?: Record<string, any>;
  metrics?: {
    startTime: string;
    endTime: string;
    duration: number;
    retryCount?: number;
  };
}

export interface SubTask {
  description: string;
  expected_output: string;
  priority?: number;
}

export interface Task {
  id: string;
  description: string;
  agentId: string;
  status: TaskStatus;
  result?: TaskResult;
  expectedOutput?: string;
  context?: Record<string, any>;
  dependencies?: string[];
  priority?: number;
  isHierarchical?: boolean;
  subtasks?: SubTask[];
  tools?: ToolConfiguration[];
  asyncExecution?: boolean;
  outputFile?: string;
  humanValidation?: boolean;
}

export interface CrewConfig {
  enableHumanValidation: boolean;
  maxRetries: number;
  timeoutSeconds: number;
  costLimit?: number;
}

export interface Crew {
  id: string;
  name: string;
  description?: string;
  defaultModel?: ModelType;
  status: CrewStatus;
  agents: Agent[];
  tasks: Task[];
  lastUpdated: string;
  process?: ProcessType;
  maxConcurrency?: number;
  config: CrewConfig;
  maxRpm?: number;
  temperature?: number;
  cache?: boolean;
}

export interface CrewResult {
  tasks_output?: Array<{
    raw?: string;
    output?: string;
  }>;
  raw?: string;
  output?: string;
}

export interface CrewResponse {
  result: CrewResult;
} 