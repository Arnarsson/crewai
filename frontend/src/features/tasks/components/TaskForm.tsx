'use client';

import { useState } from 'react';
import { useCrewStore } from '@/lib/store';
import { Agent } from '@/types/crew';

interface TaskFormProps {
  crewId: string;
  agents: Agent[];
  onClose: () => void;
}

const TASK_TEMPLATES: Record<string, string> = {
  'Research Analyst': 'Conduct market research for [project/topic]. Identify target demographics, competitors, and trends, and deliver a report outlining opportunities and threats.',
  'Code Expert': 'Review and optimize the code for [component/feature]. Focus on performance, maintainability, and adherence to best practices.',
  'Task Planner': 'Create a detailed execution plan for [project]. Break down the project into manageable tasks, identify dependencies, and establish timelines.',
  'Senior Python Developer': 'Implement [feature/component] in Python using best practices. Include proper error handling, testing, and documentation.',
  'Financial Analyst': 'Analyze financial data for [project/company] and provide recommendations. Focus on key metrics, risks, and growth opportunities.',
  'Documentation Writer': 'Create comprehensive documentation for [feature/API]. Include clear examples, use cases, and troubleshooting guides.',
  'Data Engineer': 'Design and implement a data pipeline for [data source/project]. Ensure efficient data processing, storage, and retrieval.',
  'DevOps Engineer': 'Set up CI/CD pipeline for [project]. Include automated testing, deployment, and monitoring.',
};

export const TaskForm: React.FC<TaskFormProps> = ({ crewId, agents, onClose }) => {
  const addTask = useCrewStore((state) => state.addTask);
  const [agentId, setAgentId] = useState('');
  const [description, setDescription] = useState('');

  const handleAgentSelect = (id: string) => {
    setAgentId(id);
    const agent = agents.find(a => a.id === id);
    if (agent && TASK_TEMPLATES[agent.role]) {
      setDescription(TASK_TEMPLATES[agent.role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !description) return;
    addTask(crewId, {
      agentId,
      description,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign to Agent
        </label>
        <select
          value={agentId}
          onChange={(e) => handleAgentSelect(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select an agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe the task..."
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}; 