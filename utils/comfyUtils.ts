import { ComfyWorkflow, UIMappings, UIFieldType, ComfyNode } from '../types';

/**
 * Heuristic function to automatically map standard UI fields to ComfyUI nodes.
 * It traces connections backwards from KSampler to find Prompts.
 */
export const autoMapWorkflow = (workflow: ComfyWorkflow): UIMappings => {
  const mappings: UIMappings = {};

  // 1. Find KSampler (The heart of the workflow)
  let kSamplerId: string | null = null;
  
  for (const [id, node] of Object.entries(workflow)) {
    if (node.class_type === 'KSampler' || node.class_type === 'KSamplerAdvanced') {
      kSamplerId = id;
      break;
    }
  }

  if (kSamplerId) {
    const kSampler = workflow[kSamplerId];

    // Map KSampler basics
    mappings[UIFieldType.SEED] = { nodeId: kSamplerId, field: 'seed' };
    mappings[UIFieldType.STEPS] = { nodeId: kSamplerId, field: 'steps' };
    mappings[UIFieldType.CFG] = { nodeId: kSamplerId, field: 'cfg' };
    mappings[UIFieldType.SAMPLER_NAME] = { nodeId: kSamplerId, field: 'sampler_name' };
    mappings[UIFieldType.SCHEDULER] = { nodeId: kSamplerId, field: 'scheduler' };

    // Trace Positive Prompt
    // KSampler inputs.positive is typically [LinkId, OutputSlot]
    const positiveLink = kSampler.inputs['positive'];
    if (Array.isArray(positiveLink)) {
      const sourceId = positiveLink[0]; // Logic assumes direct link, simple workflow
      const sourceNode = workflow[sourceId];
      if (sourceNode && (sourceNode.class_type === 'CLIPTextEncode' || sourceNode.class_type === 'CLIPTextEncodeSDXL')) {
         mappings[UIFieldType.POSITIVE_PROMPT] = { nodeId: sourceId, field: 'text' };
      }
    }

    // Trace Negative Prompt
    const negativeLink = kSampler.inputs['negative'];
    if (Array.isArray(negativeLink)) {
      const sourceId = negativeLink[0];
      const sourceNode = workflow[sourceId];
      if (sourceNode && (sourceNode.class_type === 'CLIPTextEncode' || sourceNode.class_type === 'CLIPTextEncodeSDXL')) {
         mappings[UIFieldType.NEGATIVE_PROMPT] = { nodeId: sourceId, field: 'text' };
      }
    }
  }

  // 2. Find Checkpoint Loader
  for (const [id, node] of Object.entries(workflow)) {
    if (node.class_type === 'CheckpointLoaderSimple' || node.class_type === 'CheckpointLoader') {
      mappings[UIFieldType.MODEL] = { nodeId: id, field: 'ckpt_name' };
      break;
    }
  }

  // 3. Find Latent Image (Resolution)
  for (const [id, node] of Object.entries(workflow)) {
    if (node.class_type === 'EmptyLatentImage') {
      mappings[UIFieldType.WIDTH] = { nodeId: id, field: 'width' };
      mappings[UIFieldType.HEIGHT] = { nodeId: id, field: 'height' };
      break;
    }
  }

  return mappings;
};

/**
 * Prepares the final workflow JSON by injecting current UI values into the mapped nodes.
 */
export const prepareWorkflow = (
  originalWorkflow: ComfyWorkflow, 
  mappings: UIMappings, 
  uiValues: Record<UIFieldType, any>
): ComfyWorkflow => {
  // Deep clone
  const newWorkflow = JSON.parse(JSON.stringify(originalWorkflow));

  Object.entries(mappings).forEach(([key, mapping]) => {
    const uiField = key as UIFieldType;
    if (mapping && newWorkflow[mapping.nodeId]) {
      let value = uiValues[uiField];

      // CRITICAL FIX: If MODEL field is empty string, do NOT overwrite the workflow.
      // This allows the default checkpoint inside the workflow to be used.
      if (uiField === UIFieldType.MODEL && (!value || value === '')) {
        return;
      }

      // Special handling for numeric fields to ensure type safety
      if (uiField === UIFieldType.SEED || uiField === UIFieldType.STEPS || uiField === UIFieldType.WIDTH || uiField === UIFieldType.HEIGHT) {
        value = Number(value);
      }
      if (uiField === UIFieldType.CFG) {
        value = Number(value);
      }
      
      newWorkflow[mapping.nodeId].inputs[mapping.field] = value;
    }
  });

  return newWorkflow;
};

/**
 * Extracts default values from the workflow based on provided mappings.
 */
export const extractDefaultValues = (workflow: ComfyWorkflow, mappings: UIMappings): Partial<Record<UIFieldType, any>> => {
  const values: Partial<Record<UIFieldType, any>> = {};
  for (const [key, mapping] of Object.entries(mappings)) {
    const fieldType = key as UIFieldType;
    if (mapping && workflow[mapping.nodeId] && workflow[mapping.nodeId].inputs) {
      const rawValue = workflow[mapping.nodeId].inputs[mapping.field];
      if (rawValue !== undefined) {
          values[fieldType] = rawValue;
      }
    }
  }
  return values;
};

/**
 * Extract available values for a node field if it's a dropdown in ComfyUI logic.
 * Note: This is hard to do without the Object Info API from Comfy. 
 * We will return null implies simple input.
 */
export const getFieldOptions = (fieldType: UIFieldType): string[] | null => {
  if (fieldType === UIFieldType.SAMPLER_NAME) {
    return ["euler", "euler_ancestral", "heun", "dpm_2", "dpm_2_ancestral", "lms", "dpm_fast", "dpm_adaptive", "ddim", "uni_pc"];
  }
  if (fieldType === UIFieldType.SCHEDULER) {
    return ["normal", "karras", "exponential", "sgm_uniform", "simple", "ddim_uniform"];
  }
  return null;
};