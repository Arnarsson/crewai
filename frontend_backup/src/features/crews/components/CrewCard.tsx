'use client';

import { Crew } from '@/types/crew';
import { getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CrewCardProps {
  crew: Crew;
}

export const CrewCard: React.FC<CrewCardProps> = ({ crew }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/crews/${crew.id}`)}
      className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{crew.name}</h3>
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            getStatusColor(crew.status)
          )}
        >
          {crew.status}
        </span>
      </div>
      {crew.description && (
        <p className="text-sm text-gray-600 mb-4">{crew.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{crew.agents.length} agents</span>
        <span>{crew.tasks.length} tasks</span>
        <span>
          {new Date(crew.updated).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}; 