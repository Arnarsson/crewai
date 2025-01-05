'use client';

import { useState } from 'react';
import { useCrewStore } from '@/lib/store';
import { TEST_AGENTS } from '@/lib/test-agents';

interface AgentFormProps {
  crewId: string;
  onClose: () => void;
}

export const AgentForm: React.FC<AgentFormProps> = ({ crewId, onClose }) => {
  const addAgent = useCrewStore((state) => state.addAgent);
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [backstory, setBackstory] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [allowDelegation, setAllowDelegation] = useState(true);
  const [verbose, setVerbose] = useState(true);

  const handlePredefinedAgentSelect = (index: number) => {
    const agent = TEST_AGENTS[index];
    setRole(agent.role || '');
    setGoal(agent.goal || '');
    setBackstory(agent.backstory || '');
    setTools(agent.tools || []);
    setAllowDelegation(agent.allowDelegation || true);
    setVerbose(agent.verbose || true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgent(crewId, {
      role,
      goal,
      backstory,
      tools,
      allowDelegation,
      verbose,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Predefined Agents
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => handlePredefinedAgentSelect(Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>Select a predefined agent</option>
          {TEST_AGENTS.map((agent, index) => (
            <option key={agent.role} value={index}>
              {agent.role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Goal
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Backstory
        </label>
        <textarea
          value={backstory}
          onChange={(e) => setBackstory(e.target.value)}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tools (comma-separated)
        </label>
        <input
          type="text"
          value={tools.join(', ')}
          onChange={(e) => setTools(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={allowDelegation}
            onChange={(e) => setAllowDelegation(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Allow Delegation</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={verbose}
            onChange={(e) => setVerbose(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Verbose Mode</span>
        </label>
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
          Add Agent
        </button>
      </div>
    </form>
  );
}; 