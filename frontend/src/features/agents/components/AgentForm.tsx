'use client';

import { useState } from 'react';
import { useCrewStore } from '@/lib/store';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const agent = {
      role,
      goal,
      backstory,
      tools,
      allowDelegation,
      verbose,
    };
    addAgent(crewId, agent);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <input
          type="text"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          Goal
        </label>
        <input
          type="text"
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="backstory" className="block text-sm font-medium text-gray-700">
          Backstory
        </label>
        <textarea
          id="backstory"
          value={backstory}
          onChange={(e) => setBackstory(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="allowDelegation"
          checked={allowDelegation}
          onChange={(e) => setAllowDelegation(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="allowDelegation" className="ml-2 block text-sm text-gray-900">
          Allow Delegation
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="verbose"
          checked={verbose}
          onChange={(e) => setVerbose(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="verbose" className="ml-2 block text-sm text-gray-900">
          Verbose
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