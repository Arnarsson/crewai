'use client';

import { Task } from '@/types/crew';
import { ModelMetrics } from './ModelMetrics';

interface UsageStatsProps {
  tasks: Task[];
}

export const UsageStats: React.FC<UsageStatsProps> = ({ tasks }) => {
  return <ModelMetrics tasks={tasks} />;
}; 