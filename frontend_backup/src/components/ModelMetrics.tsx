'use client';

import { Task } from '@/types/crew';

interface ModelMetricsProps {
  tasks?: Task[];
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ tasks = [] }) => {
  const totalTokens = tasks.reduce((sum, task) => sum + (task.result?.tokenCount || 0), 0);
  const totalCost = tasks.reduce((sum, task) => sum + (task.result?.cost || 0), 0);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Model Usage</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Tokens</div>
          <div className="text-2xl font-semibold text-gray-900">
            {totalTokens.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Estimated Cost</div>
          <div className="text-2xl font-semibold text-gray-900">
            ${totalCost.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}; 