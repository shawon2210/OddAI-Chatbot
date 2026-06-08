/**
 * Free AI models available through OpenRouter
 * All model IDs use the :free suffix for zero-cost usage
 */
export const FREE_MODELS = [
  {
    id: 'openrouter/free',
    name: 'Auto (Best Free)',
    description: 'Automatically selects the best available free model',
    icon: '✨',
    category: 'auto',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Gemma 4 31B',
    description: 'Google\'s efficient 31B parameter model',
    icon: '🔷',
    category: 'general',
  },
  {
    id: 'openai/gpt-oss-120b:free',
    name: 'GPT-OSS 120B',
    description: 'OpenAI\'s open-source 120B reasoning model',
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
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'Nemotron 3 Super',
    description: 'NVIDIA\'s high-performance 120B model',
    icon: '🟩',
    category: 'general',
  },
  {
    id: 'z-ai/glm-4.5-air:free',
    name: 'GLM 4.5 Air',
    description: 'Lightweight and fast general-purpose model',
    icon: '🌊',
    category: 'general',
  },
];

export const DEFAULT_MODEL = 'openrouter/free';

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
