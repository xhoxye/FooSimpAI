import React, { useState } from 'react';
import { 
  Trash2, Dices, Settings, Loader2, Zap, 
  Square, RectangleHorizontal, RectangleVertical, Monitor,
  Palette, Camera, PenTool, Box, Layers, Component, X
} from 'lucide-react';
import { UIFieldType, AppState, FIELD_LABELS } from '../types';
import { getFieldOptions } from '../utils/comfyUtils';

interface SidebarProps {
  uiValues: Record<UIFieldType, any>;
  onValueChange: (field: UIFieldType, value: any) => void;
  onGenerate: () => void;
  onOpenSettings: () => void;
  status: AppState['generationStatus'];
  hasWorkflow: boolean;
  activeAspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  activeStyle: string;
  onStyleChange: (style: string) => void;
  lastGenerationDuration: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  uiValues, 
  onValueChange, 
  onGenerate, 
  onOpenSettings, 
  status, 
  hasWorkflow,
  activeAspectRatio,
  onAspectRatioChange,
  activeStyle,
  onStyleChange,
  lastGenerationDuration
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'models' | 'advanced'>('create');

  const ASPECT_RATIOS = [
    { id: '9:16', label: '9:16', icon: RectangleVertical },
    { id: '16:9', label: '16:9', icon: RectangleHorizontal },
    { id: '1:1', label: '1:1', icon: Square },
    { id: '4:3', label: '4:3', icon: Monitor },
  ];

  const ART_STYLES = [
    { id: 'Realistic', label: 'Realistic', icon: Camera },
    { id: 'Anime', label: 'Anime', icon: Component },
    { id: '3D Render', label: '3D Render', icon: Box },
    { id: 'Oil Paint', label: 'Oil Paint', icon: Palette },
    { id: 'Sketch', label: 'Sketch', icon: PenTool },
  ];

  const handleClearPrompt = () => {
    onValueChange(UIFieldType.POSITIVE_PROMPT, '');
  };

  const handleClearNegativePrompt = () => {
    onValueChange(UIFieldType.NEGATIVE_PROMPT, '');
  };

  const handleRandomPrompt = () => {
    const prompts = [
      "A futuristic city with flying cars in a cyberpunk style, neon lights",
      "A serene zen garden with cherry blossoms, 8k resolution, cinematic lighting",
      "Portrait of a warrior princess, intricate armor, fantasy art style",
      "A cute robot watering plants in a greenhouse, isometric view, 3d render"
    ];
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    onValueChange(UIFieldType.POSITIVE_PROMPT, random);
  };

  const handleCustomDimension = (field: UIFieldType, val: string) => {
    // onValueChange will trigger parent state update. 
    // Parent logic in App.tsx needs to set activeAspectRatio to 'custom' if it doesn't match presets.
    // For now we just pass value. The highlight logic in sidebar depends on activeAspectRatio prop passed down.
    onValueChange(field, val);
  };

  return (
    <aside className="w-[400px] bg-[#0c0e12] flex flex-col h-full z-20 shadow-2xl overflow-hidden relative">
      
      {/* Tabs */}
      <div className="flex px-6 gap-6 bg-[#0c0e12] pt-4 shrink-0">
        <button 
          onClick={() => setActiveTab('create')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'create' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Create
          {activeTab === 'create' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'models' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Models
          {activeTab === 'models' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('advanced')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'advanced' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Advanced
          {activeTab === 'advanced' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
      </div>

      {/* Main Content Area - Enclosed in a visual "Card" */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar bg-[#0c0e12]">
        <div className="bg-[#13151a] rounded-2xl p-5 min-h-full space-y-6 shadow-inner border border-slate-800/50">
        
        {activeTab === 'create' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
             {/* Positive Prompt */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Positive Prompt</label>
                <button 
                    onClick={handleClearPrompt}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="relative group">
                <textarea
                  value={uiValues[UIFieldType.POSITIVE_PROMPT]}
                  onChange={(e) => onValueChange(UIFieldType.POSITIVE_PROMPT, e.target.value)}
                  className="w-full h-40 bg-[#09090b] border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                  placeholder="Describe what you want to generate..."
                />
                <button 
                    onClick={handleRandomPrompt}
                    className="absolute bottom-3 right-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm border border-slate-700 transition-all"
                >
                    <Dices className="w-3 h-3" /> Random
                </button>
              </div>
            </div>

            {/* Art Styles */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Art Style</label>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ART_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => onStyleChange(style.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                                activeStyle === style.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                                : 'bg-[#09090b] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                            }`}
                        >
                            <style.icon className="w-3.5 h-3.5" />
                            {style.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Aspect Ratio & Resolution */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dimensions</label>
                </div>
                
                {/* Manual Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">W</span>
                      <input 
                         type="number" 
                         value={uiValues[UIFieldType.WIDTH]}
                         onChange={(e) => handleCustomDimension(UIFieldType.WIDTH, e.target.value)}
                         className="w-full bg-[#09090b] border border-slate-800 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                   </div>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">H</span>
                      <input 
                         type="number" 
                         value={uiValues[UIFieldType.HEIGHT]}
                         onChange={(e) => handleCustomDimension(UIFieldType.HEIGHT, e.target.value)}
                         className="w-full bg-[#09090b] border border-slate-800 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                   </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => onAspectRatioChange(ratio.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                                activeAspectRatio === ratio.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                                : 'bg-[#09090b] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                            }`}
                        >
                            <ratio.icon className="w-3.5 h-3.5" />
                            {ratio.label}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Layers className="w-3 h-3" /> Model Settings
                  </label>
                  <div className="bg-[#09090b] border border-slate-800 rounded-xl p-4 space-y-4">
                     {/* Checkpoint Name (Manual Override) */}
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Checkpoint (Exact Filename)</label>
                        <input 
                              type="text"
                              value={uiValues[UIFieldType.MODEL]}
                              onChange={(e) => onValueChange(UIFieldType.MODEL, e.target.value)}
                              placeholder="Leave empty to use workflow default"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500"
                          />
                          <p className="text-[10px] text-slate-600">
                              Enter the exact filename (e.g., v1-5-pruned.ckpt). If blank, the model defined in the JSON workflow is used.
                          </p>
                     </div>
                  </div>
              </div>
           </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* Negative Prompt */}
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Negative Prompt</label>
                    <button 
                        onClick={handleClearNegativePrompt}
                        className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" /> Clear
                    </button>
                </div>
                <textarea 
                      value={uiValues[UIFieldType.NEGATIVE_PROMPT]}
                      onChange={(e) => onValueChange(UIFieldType.NEGATIVE_PROMPT, e.target.value)}
                      className="w-full h-20 bg-[#09090b] border border-slate-700/50 rounded-lg p-3 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                      placeholder="What to avoid..."
                />
            </div>

            {/* Compact Parameters */}
            <div className="bg-[#09090b] border border-slate-800 rounded-xl p-4 space-y-4">
              
              {/* Row 1: Seed */}
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Seed</label>
                  <div className="flex gap-2">
                      <input 
                          type="number"
                          value={uiValues[UIFieldType.SEED]}
                          onChange={(e) => onValueChange(UIFieldType.SEED, e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                      />
                      <button 
                          onClick={() => onValueChange(UIFieldType.SEED, Math.floor(Math.random() * 1000000000))}
                          className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300"
                          title="Randomize Seed"
                      >
                          <Dices className="w-4 h-4" />
                      </button>
                  </div>
              </div>

              {/* Row 2: Steps & CFG */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Steps</label>
                    <input 
                        type="number"
                        value={uiValues[UIFieldType.STEPS]}
                        onChange={(e) => onValueChange(UIFieldType.STEPS, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">CFG Scale</label>
                    <input 
                        type="number"
                        value={uiValues[UIFieldType.CFG]}
                        onChange={(e) => onValueChange(UIFieldType.CFG, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                </div>
              </div>

              {/* Row 3: Sampler & Scheduler */}
              <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Sampler</label>
                      <select 
                        value={uiValues[UIFieldType.SAMPLER_NAME]}
                        onChange={(e) => onValueChange(UIFieldType.SAMPLER_NAME, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                      >
                         {getFieldOptions(UIFieldType.SAMPLER_NAME)?.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Scheduler</label>
                      <select 
                        value={uiValues[UIFieldType.SCHEDULER]}
                        onChange={(e) => onValueChange(UIFieldType.SCHEDULER, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                      >
                         {getFieldOptions(UIFieldType.SCHEDULER)?.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer / Generate Button */}
      <div className="p-6 bg-[#0c0e12] shrink-0">
        {!hasWorkflow ? (
            <button
                onClick={onOpenSettings}
                className="w-full py-4 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
            >
                <Settings className="w-5 h-5" /> Connect Workflow
            </button>
        ) : (
            <button
                onClick={onGenerate}
                disabled={status === 'generating'}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 ${
                    status === 'generating' 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
                }`}
            >
                {status === 'generating' ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5 fill-current" /> Generate Image
                    </>
                )}
            </button>
        )}
        <div className="text-center mt-3">
             <p className="text-[10px] text-yellow-500/80 font-medium flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> 
                {status === 'generating' ? 'Calculating...' : (
                    lastGenerationDuration 
                    ? `Last generation: ${lastGenerationDuration}s` 
                    : 'Estimated time: ~4.5s'
                )}
             </p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;