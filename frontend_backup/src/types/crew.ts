import { ModelType } from '@/lib/api';

export type AgentRole = string;

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'pending_review';
export type TaskStatus = 'idle' | 'running' | 'completed' | 'failed' | 'pending_review';
export type CrewStatus = 'draft' | 'running' | 'completed' | 'failed';

export interface ToolConfiguration {
  name: string;
  description?: string;
  configuration: Record<string, any>;
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
  memory?: {
    type: 'short_term' | 'long_term';
    configuration: Record<string, any>;
  };
}

export interface Task {
  id: string;
  description: string;
  agentId: string;
  status: TaskStatus;
  result?: TaskResult;
  expectedOutput?: string;
  context?: Record<string, any>;
  dependencies?: string[]; // IDs of tasks that must complete before this one
  priority?: number;
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

export interface Crew {
  id: string;
  name: string;
  description?: string;
  defaultModel?: ModelType;
  status: CrewStatus;
  agents: Agent[];
  tasks: Task[];
  lastUpdated: string;
  process?: 'sequential' | 'hierarchical' | 'parallel';
  maxConcurrency?: number;
  config?: {
    enableHumanValidation?: boolean;
    maxRetries?: number;
    timeoutSeconds?: number;
    costLimit?: number;
  };
} 