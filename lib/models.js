/**
 * Free AI models available through OpenRouter
 * All model IDs use the :free suffix for zero-cost usage
 */
export const FREE_MODELS = [
  {
    id: 'openrouter/auto',
    name: 'Auto (Best Free)',
    description: 'Automatically selects the best available free model',
    icon: '✨',
    category: 'auto',
  },
  {
    id: 'google/gemma-3-27b-it:free',
    name: 'Gemma 3 27B',
    description: 'Google\'s efficient 27B parameter model with strong reasoning',
    icon: '🔷',
    category: 'general',
  },
  {
    id: 'openai/gpt-4o-mini:free',
    name: 'GPT-4o Mini',
    description: 'OpenAI\'s fast and efficient reasoning model',
    icon: '🟢',
    category: 'reasoning',
  },
  {
    id: 'qwen/qwen3-coder:free',
    name: 'Qwen3 Coder',
    description: 'Specialized for coding tasks and programming',
    icon: '💻',
    category: 'coding',
  },
  {
    id: 'deepseek/deepseek-chat:free',
    name: 'DeepSeek Chat',
    description: 'High-performance model with strong reasoning capabilities',
    icon: '🟩',
    category: 'reasoning',
  },
  {
    id: 'mistralai/mistral-nemo:free',
    name: 'Mistral Nemo',
    description: 'Lightweight and fast general-purpose model',
    icon: '🌊',
    category: 'general',
  },
];

export const DEFAULT_MODEL = 'openrouter/auto';

/**
 * Get display name for a model ID
 */
export function getModelName(modelId) {
  const model = FREE_MODELS.find((m) => m.id === modelId);
  return model ? model.name : modelId;
}

/**
 * Get model info by ID
 */
export function getModelInfo(modelId) {
  return FREE_MODELS.find((m) => m.id === modelId) || null;
}
