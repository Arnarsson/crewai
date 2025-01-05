'use client';

import { Task } from '@/types/crew';
import { cn } from '@/lib/utils';

interface TaskDisplayProps {
  task: Task;
  agentRole?: string;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, agentRole }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{agentRole}</span>
          <span className={cn(
            'px-2 py-0.5 text-xs rounded-full',
            task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          )}>
            {task.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          • Prompt: "{task.description}"
        </div>

        {task.output && (
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {task.output}
          </div>
        )}

        {task.usage && (
          <div className="flex justify-end items-center gap-3 text-xs text-gray-500">
            <span>{task.usage.totalTokens.toLocaleString()} tokens</span>
            <span>${task.usage.estimatedCost.toFixed(4)}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 