'use client';

import { ModelType } from '@/lib/api';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
}

const models: ModelType[] = ['gpt-4', 'gpt-3.5-turbo', 'claude-2'];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelSelect,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="model-select" className="text-sm font-medium text-gray-700">
        Select AI Model
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelSelect(e.target.value as ModelType)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
}; 