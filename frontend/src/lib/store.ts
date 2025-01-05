import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Agent, Task, Crew, CrewResult } from '../types/crew';

interface CrewStore {
  crews: Record<string, Crew>;
  results: Record<string, CrewResult>;
  loading: boolean;
  error: string | null;
  createCrew: (crew: Omit<Crew, 'id'>) => Promise<string>;
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
        [crewId]: crew,
      },
    }));
    return crewId;
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set((state) => ({
        results: {
          ...state.results,
          [crewId]: data.result,
        },
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  stopCrewExecution: async (crewId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crews/${crewId}/stop`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateAgentModel: (crewId, agentRole, model) => {
    set((state) => {
      const crew = state.crews[crewId];
      if (!crew) return state;

      const updatedAgents = crew.agents.map((agent) =>
        agent.role === agentRole ? { ...agent, llm: model } : agent
      );

      return {
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            agents: updatedAgents,
          },
        },
      };
    });
  },

  updateTaskModel: (crewId, taskIndex, model) => {
    set((state) => {
      const crew = state.crews[crewId];
      if (!crew) return state;

      const updatedTasks = crew.tasks.map((task, index) =>
        index === taskIndex ? { ...task, llm: model } : task
      );

      return {
        crews: {
          ...state.crews,
          [crewId]: {
            ...crew,
            tasks: updatedTasks,
          },
        },
      };
    });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 