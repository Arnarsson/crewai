import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Agent, Task, Crew, CrewResult } from '../types/crew';

interface CrewStore {
  crews: Record<string, Crew>;
  results: Record<string, CrewResult>;
  loading: boolean;
  error: string | null;
  createCrew: (crew: Omit<Crew, 'id'>) => Promise<string>;
  addAgent: (crewId: string, agent: Omit<Agent, 'id' | 'status'>) => void;
  startCrewExecution: (crewId: string, config?: any) => Promise<void>;
  stopCrewExecution: (crewId: string) => Promise<void>;
  updateAgentModel: (crewId: string, agentRole: string, model: string) => void;
  updateTaskModel: (crewId: string, taskIndex: number, model: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCrewStore = create<CrewStore>((set, get) => ({
  crews: {},
  results: {},
  loading: false,
  error: null,

  createCrew: async (crew) => {
    const crewId = uuidv4();
    set((state) => ({
      crews: {
        ...state.crews,
        [crewId]: {
          ...crew,
          id: crewId,
          status: 'draft',
          agents: [],
          tasks: [],
          lastUpdated: new Date().toISOString(),
          config: {
            enableHumanValidation: false,
            maxRetries: 3,
            timeoutSeconds: 600,
          },
        },
      },
    }));
    return crewId;
  },

  addAgent: (crewId, agent) => {
    set((state) => {
      const crew = state.crews[crewId];
      if (!crew) return state;

      const newAgent: Agent = {
        ...agent,
        id: uuidv4(),
        status: 'idle',
        tools: [],
      };

      return {
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            agents: [...crew.agents, newAgent],
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  },

  startCrewExecution: async (crewId, config) => {
    const { crews } = get();
    const crew = crews[crewId];
    if (!crew) throw new Error('Crew not found');

    set({ loading: true, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...crew, config }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start crew execution');
      }

      const result = await response.json();
      set((state) => ({
        results: {
          ...state.results,
          [crewId]: result,
        },
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            status: 'running',
            lastUpdated: new Date().toISOString(),
          },
        },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to start crew execution',
        loading: false,
      });
    }
  },

  stopCrewExecution: async (crewId) => {
    const { crews } = get();
    const crew = crews[crewId];
    if (!crew) throw new Error('Crew not found');

    set({ loading: true, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crews/${crewId}/stop`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to stop crew execution');
      }

      set((state) => ({
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            status: 'completed',
            lastUpdated: new Date().toISOString(),
          },
        },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to stop crew execution',
        loading: false,
      });
    }
  },

  updateAgentModel: (crewId, agentRole, model) => {
    set((state) => {
      const crew = state.crews[crewId];
      if (!crew) return state;

      const updatedAgents = crew.agents.map((agent) =>
        agent.role === agentRole ? { ...agent, model } : agent
      );

      return {
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            agents: updatedAgents,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  },

  updateTaskModel: (crewId, taskIndex, model) => {
    set((state) => {
      const crew = state.crews[crewId];
      if (!crew) return state;

      const updatedTasks = [...crew.tasks];
      if (taskIndex >= 0 && taskIndex < updatedTasks.length) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          model,
        };
      }

      return {
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));