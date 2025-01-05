import { create } from 'zustand';
import { Crew } from '@/types/crew';
import { v4 as uuidv4 } from 'uuid';

interface CrewStore {
  crews: Crew[];
  createCrew: (name: string) => Crew;
  startCrewExecution: (id: string, requireHumanValidation: boolean) => void;
  stopCrewExecution: (id: string) => void;
  updateCrewModel: (id: string, model: string) => void;
  updateAgentModel: (crewId: string, agentId: string, model: string) => void;
  deleteAgent: (crewId: string, agentId: string) => void;
  deleteTask: (crewId: string, taskId: string) => void;
  setHumanValidation: (crewId: string, required: boolean) => void;
}

export const useCrewStore = create<CrewStore>((set) => ({
  crews: [],
  createCrew: (name) => {
    const newCrew: Crew = {
      id: uuidv4(),
      name,
      status: 'draft',
      agents: [],
      tasks: [],
      lastUpdated: new Date().toISOString(),
    };
    set((state) => ({ crews: [...state.crews, newCrew] }));
    return newCrew;
  },
  startCrewExecution: (id, requireHumanValidation) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === id
          ? {
              ...crew,
              status: 'running',
              config: { ...crew.config, enableHumanValidation: requireHumanValidation },
            }
          : crew
      ),
    })),
  stopCrewExecution: (id) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === id ? { ...crew, status: 'completed' } : crew
      ),
    })),
  updateCrewModel: (id, model) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === id ? { ...crew, defaultModel: model } : crew
      ),
    })),
  updateAgentModel: (crewId, agentId, model) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === crewId
          ? {
              ...crew,
              agents: crew.agents.map((agent) =>
                agent.id === agentId ? { ...agent, model } : agent
              ),
            }
          : crew
      ),
    })),
  deleteAgent: (crewId, agentId) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === crewId
          ? {
              ...crew,
              agents: crew.agents.filter((agent) => agent.id !== agentId),
            }
          : crew
      ),
    })),
  deleteTask: (crewId, taskId) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === crewId
          ? {
              ...crew,
              tasks: crew.tasks.filter((task) => task.id !== taskId),
            }
          : crew
      ),
    })),
  setHumanValidation: (crewId, required) =>
    set((state) => ({
      crews: state.crews.map((crew) =>
        crew.id === crewId
          ? {
              ...crew,
              config: { ...crew.config, enableHumanValidation: required },
            }
          : crew
      ),
    })),
})); 