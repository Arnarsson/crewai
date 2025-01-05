export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo-preview';

export interface Agent {
  role: string;
  goal: string;
  backstory: string;
  allow_delegation?: boolean;
  verbose?: boolean;
  memory?: boolean;
}

export interface Task {
  description: string;
  agent_role: string;
  expected_output?: string;
  tools?: any[];
  async_execution?: boolean;
  output_json?: boolean;
  output_file?: string;
}

export type ProcessType = 'sequential' | 'parallel';

export interface CrewRequest {
  agents: Agent[];
  tasks: Task[];
  process: ProcessType;
  verbose?: boolean;
}

export interface CrewResponse {
  result: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createCrew(data: CrewRequest): Promise<CrewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/crews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create crew');
  }

  return response.json();
} 