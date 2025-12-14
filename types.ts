// Standard UI Fields we support controlling
export enum UIFieldType {
  POSITIVE_PROMPT = 'positive_prompt',
  NEGATIVE_PROMPT = 'negative_prompt',
  SEED = 'seed',
  STEPS = 'steps',
  CFG = 'cfg',
  SAMPLER_NAME = 'sampler_name',
  SCHEDULER = 'scheduler',
  WIDTH = 'width',
  HEIGHT = 'height',
  BATCH_SIZE = 'batch_size', // Added Batch Size
  MODEL = 'ckpt_name'
}

// ComfyUI API Types
export interface ComfyNode {
  class_type: string;
  inputs: Record<string, any>;
  _meta?: {
    title?: string;
  };
}

export interface ComfyWorkflow {
  [nodeId: string]: ComfyNode;
}

// Internal Application Types
export interface NodeMapping {
  nodeId: string;
  field: string;
}

export type UIMappings = Partial<Record<UIFieldType, NodeMapping>>;

export interface RecentImage {
  id: string;
  url: string;
  timestamp: number;
  prompt: string;
}

export interface AppState {
  backendUrl: string;
  backendStatus: boolean; // True if connected
  workflow: ComfyWorkflow | null;
  workflowName: string;
  mappings: UIMappings;
  uiValues: Record<UIFieldType, any>;
  isSettingsOpen: boolean;
  generationStatus: 'idle' | 'generating' | 'success' | 'error';
  generatedImage: string | null;
  errorMessage: string | null;
  recentImages: RecentImage[];
  activeAspectRatio: string; // e.g., "9:16"
  activeStyle: string; // e.g., "Realistic"
  theme: 'dark' | 'light';
  language: 'en' | 'zh';
}

export const DEFAULT_UI_VALUES: Record<UIFieldType, any> = {
  [UIFieldType.POSITIVE_PROMPT]: "A futuristic city with flying cars in a cyberpunk style, neon lights, rain reflections, cinematic lighting...",
  [UIFieldType.NEGATIVE_PROMPT]: "blur, low quality, watermark, text, deformed",
  [UIFieldType.SEED]: -1, 
  [UIFieldType.STEPS]: 25,
  [UIFieldType.CFG]: 7.0,
  [UIFieldType.SAMPLER_NAME]: "euler",
  [UIFieldType.SCHEDULER]: "normal",
  [UIFieldType.WIDTH]: 544,
  [UIFieldType.HEIGHT]: 960,
  [UIFieldType.BATCH_SIZE]: 1, // Default Batch Size
  [UIFieldType.MODEL]: ""
};

export const FIELD_LABELS: Record<UIFieldType, string> = {
  [UIFieldType.POSITIVE_PROMPT]: "Positive Prompt",
  [UIFieldType.NEGATIVE_PROMPT]: "Negative Prompt",
  [UIFieldType.SEED]: "Seed",
  [UIFieldType.STEPS]: "Steps",
  [UIFieldType.CFG]: "CFG Scale",
  [UIFieldType.SAMPLER_NAME]: "Sampler",
  [UIFieldType.SCHEDULER]: "Scheduler",
  [UIFieldType.WIDTH]: "Width",
  [UIFieldType.HEIGHT]: "Height",
  [UIFieldType.BATCH_SIZE]: "Batch Size",
  [UIFieldType.MODEL]: "Checkpoint Model"
};