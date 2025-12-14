import React, { useState } from 'react';
import { 
  Trash2, Dices, Settings, Loader2, Zap, 
  Square, RectangleHorizontal, RectangleVertical, Monitor,
  Palette, Camera, PenTool, Box, Layers, Component, Brush
} from 'lucide-react';
import { UIFieldType, AppState } from '../types';
import { getFieldOptions } from '../utils/comfyUtils';
import { translations, Language } from '../utils/i18n';

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
  lang: Language;
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
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'models' | 'advanced'>('create');
  const t = translations[lang];

  const ASPECT_RATIOS = [
    { id: '9:16', label: '9:16', icon: RectangleVertical },
    { id: '16:9', label: '16:9', icon: RectangleHorizontal },
    { id: '1:1', label: '1:1', icon: Square },
    { id: '4:3', label: '4:3', icon: Monitor },
  ];

  // Art Styles with Prompt keywords
  const ART_STYLES = [
    { id: 'Realistic', label: 'Realistic', icon: Camera, prompt: "photorealistic, cinematic lighting, 8k, detailed texture" },
    { id: 'Anime', label: 'Anime', icon: Component, prompt: "anime style, vibrant colors, studio ghibli style, cel shaded" },
    { id: '3D Render', label: '3D Render', icon: Box, prompt: "3d render, blender cycles, clay material, isometric, cute" },
    { id: 'Oil Paint', label: 'Oil', icon: Palette, prompt: "oil painting, impasto, classical art, heavy brushstrokes" },
    { id: 'Sketch', label: 'Sketch', icon: PenTool, prompt: "charcoal sketch, rough lines, graphite texture, monochrome" },
    { id: 'Watercolor', label: 'Watercolor', icon: Brush, prompt: "watercolor painting, wet-on-wet, pastel colors, paper texture" },
  ];

  // Defined Prompt List for Random
  const RANDOM_PROMPTS = [
    "A hyper-realistic portrait of a woman in a rainstorm, cinematic lighting, 8k resolution, detailed skin texture",
    "Studio Ghibli style, lush green magical forest with glowing spirits, serene atmosphere",
    "Isometric 3D render of a cozy gamer room, neon lighting, cute props",
    "A dramatic oil painting of a ship in a stormy sea, heavy brushstrokes, golden age style",
    "Cyberpunk street food vendor, neon signs, rain reflections, futuristic attire",
    "A steampunk clockwork owl, brass gears, intricate mechanism, technical drawing"
  ];

  const handleClearPrompt = () => {
    onValueChange(UIFieldType.POSITIVE_PROMPT, '');
  };

  const handleClearNegativePrompt = () => {
    onValueChange(UIFieldType.NEGATIVE_PROMPT, '');
  };

  const handleRandomPrompt = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    onValueChange(UIFieldType.POSITIVE_PROMPT, random);
  };

  const handleStyleClick = (styleId: string, promptSuffix: string) => {
    onStyleChange(styleId);
    
    // Append logic
    const current = uiValues[UIFieldType.POSITIVE_PROMPT] || "";
    // Avoid double appending if already ends with it (simple check)
    if (!current.includes(promptSuffix)) {
        const separator = current.length > 0 && !current.endsWith(',') ? ', ' : '';
        onValueChange(UIFieldType.POSITIVE_PROMPT, `${current}${separator}${promptSuffix}`);
    }
  };

  const handleCustomDimension = (field: UIFieldType, val: string) => {
    onValueChange(field, val);
  };

  // Shared button style
  const actionButtonStyle = "bg-slate-200/50 dark:bg-neutral-800/80 hover:bg-slate-300 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-slate-300 dark:border-neutral-700 transition-all";

  // Input styles
  const inputStyle = "w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 outline-none transition-colors";
  const textAreaStyle = "w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all";
  
  // Card Container style (used for "Card Rounded Corners" requirement)
  const cardStyle = "bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-800 p-5";

  return (
    <aside className="w-[450px] flex flex-col h-full z-20 overflow-hidden relative transition-colors duration-200 bg-slate-100 dark:bg-neutral-950 px-4 pb-4">
      
      {/* Tabs */}
      <div className="flex px-4 gap-6 pt-2 shrink-0 transition-colors">
        <button 
          onClick={() => setActiveTab('create')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'create' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
        >
          {t.create}
          {activeTab === 'create' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'models' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
        >
          {t.models}
          {activeTab === 'models' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('advanced')}
          className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'advanced' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
        >
          {t.advanced}
          {activeTab === 'advanced' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>}
        </button>
      </div>

      {/* Main Content Area (Card) */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${cardStyle} mb-3`}>
        <div className="space-y-6">
        
        {activeTab === 'create' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
             {/* Positive Prompt */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">{t.positivePrompt}</label>
                <button 
                    onClick={handleClearPrompt}
                    title={t.clearTooltip}
                    className={`${actionButtonStyle} hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/50`}
                >
                    <Trash2 className="w-3 h-3" /> {t.clear}
                </button>
              </div>
              <div className="relative group">
                <textarea
                  value={uiValues[UIFieldType.POSITIVE_PROMPT]}
                  onChange={(e) => onValueChange(UIFieldType.POSITIVE_PROMPT, e.target.value)}
                  className={textAreaStyle + " h-40"}
                  placeholder="Describe what you want to generate..."
                />
                <button 
                    onClick={handleRandomPrompt}
                    title={t.randomTooltip}
                    className={`absolute bottom-3 right-3 ${actionButtonStyle}`}
                >
                    <Dices className="w-3 h-3" /> {t.random}
                </button>
              </div>
            </div>

            {/* Art Styles */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">{t.artStyle}</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {ART_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => handleStyleClick(style.id, style.prompt)}
                            title={`${t.artStyleTooltip}: ${style.prompt}`}
                            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                                activeStyle === style.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                                : 'bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-slate-900 dark:hover:text-slate-200'
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
                    <label className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">{t.dimensions}</label>
                </div>
                
                {/* Manual Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-neutral-500 font-bold">W</span>
                      <input 
                         type="number" 
                         value={uiValues[UIFieldType.WIDTH]}
                         onChange={(e) => handleCustomDimension(UIFieldType.WIDTH, e.target.value)}
                         className={`${inputStyle} pl-8 pr-3`}
                      />
                   </div>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-neutral-500 font-bold">H</span>
                      <input 
                         type="number" 
                         value={uiValues[UIFieldType.HEIGHT]}
                         onChange={(e) => handleCustomDimension(UIFieldType.HEIGHT, e.target.value)}
                         className={`${inputStyle} pl-8 pr-3`}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => onAspectRatioChange(ratio.id)}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                                activeAspectRatio === ratio.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                                : 'bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-slate-900 dark:hover:text-slate-200'
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
                  <label className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                     <Layers className="w-3 h-3" /> {t.modelSettings}
                  </label>
                  <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
                     {/* Checkpoint Name (Manual Override) */}
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{t.checkpoint}</label>
                        <input 
                              type="text"
                              value={uiValues[UIFieldType.MODEL]}
                              onChange={(e) => onValueChange(UIFieldType.MODEL, e.target.value)}
                              placeholder={t.checkpointPlaceholder}
                              className={`${inputStyle} px-3`}
                          />
                          <p className="text-[10px] text-slate-500 dark:text-neutral-600">
                              {t.checkpointHint}
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
                    <label className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">{t.negativePrompt}</label>
                    <button 
                        onClick={handleClearNegativePrompt}
                        title={t.clearTooltip}
                        className={`${actionButtonStyle} hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/50`}
                    >
                        <Trash2 className="w-3 h-3" /> {t.clear}
                    </button>
                </div>
                <textarea 
                      value={uiValues[UIFieldType.NEGATIVE_PROMPT]}
                      onChange={(e) => onValueChange(UIFieldType.NEGATIVE_PROMPT, e.target.value)}
                      className={textAreaStyle + " h-20 p-3"}
                      placeholder={t.negativePlaceholder}
                />
            </div>

            {/* Compact Parameters */}
            <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
              
              {/* Row 1: Seed */}
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{t.seed}</label>
                  <div className="flex gap-2">
                      <input 
                          type="number"
                          value={uiValues[UIFieldType.SEED]}
                          onChange={(e) => onValueChange(UIFieldType.SEED, e.target.value)}
                          className={`${inputStyle} flex-1 px-3`}
                          placeholder={t.seedRandom}
                      />
                      <button 
                          onClick={() => onValueChange(UIFieldType.SEED, -1)}
                          title={t.seedRandomTooltip}
                          className="p-2 bg-slate-200 dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg hover:bg-slate-300 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300"
                      >
                          <Dices className="w-4 h-4" />
                      </button>
                  </div>
              </div>

              {/* Row 2: Steps & CFG */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t.steps}</label>
                    <input 
                        type="number"
                        value={uiValues[UIFieldType.STEPS]}
                        onChange={(e) => onValueChange(UIFieldType.STEPS, e.target.value)}
                        className={`${inputStyle} px-3`}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t.cfgScale}</label>
                    <input 
                        type="number"
                        value={uiValues[UIFieldType.CFG]}
                        onChange={(e) => onValueChange(UIFieldType.CFG, e.target.value)}
                        className={`${inputStyle} px-3`}
                    />
                </div>
              </div>

              {/* Row 3: Sampler & Scheduler */}
              <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.sampler}</label>
                      <select 
                        value={uiValues[UIFieldType.SAMPLER_NAME]}
                        onChange={(e) => onValueChange(UIFieldType.SAMPLER_NAME, e.target.value)}
                        className={`${inputStyle} px-3`}
                      >
                         {getFieldOptions(UIFieldType.SAMPLER_NAME)?.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.scheduler}</label>
                      <select 
                        value={uiValues[UIFieldType.SCHEDULER]}
                        onChange={(e) => onValueChange(UIFieldType.SCHEDULER, e.target.value)}
                        className={`${inputStyle} px-3`}
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

      {/* Footer / Generate Button (Card) */}
      <div className={`${cardStyle} h-28 flex flex-col justify-center shrink-0`}>
        {!hasWorkflow ? (
            <button
                onClick={onOpenSettings}
                className="w-full py-4 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 font-bold border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700 hover:text-slate-800 dark:hover:text-white transition-all flex items-center justify-center gap-2"
            >
                <Settings className="w-5 h-5" /> {t.connectWorkflow}
            </button>
        ) : (
            <div className="flex gap-3 h-14">
              {/* Batch Size Input */}
              <div className="w-16 flex-shrink-0" title={t.batchSize}>
                <input 
                  type="number"
                  min="1"
                  max="32"
                  value={uiValues[UIFieldType.BATCH_SIZE]}
                  onChange={(e) => onValueChange(UIFieldType.BATCH_SIZE, e.target.value)}
                  className="w-full h-full rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 font-bold text-center border border-slate-200 dark:border-neutral-700 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all"
                />
              </div>

              {/* Generate Button */}
              <button
                  onClick={onGenerate}
                  disabled={status === 'generating'}
                  title={t.generate}
                  className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 ${
                      status === 'generating' 
                      ? 'bg-slate-100 dark:bg-neutral-800 text-slate-500 cursor-not-allowed border border-slate-200 dark:border-neutral-700' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
                  }`}
              >
                  {status === 'generating' ? (
                      <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                      </>
                  ) : (
                      <>
                          <Zap className="w-5 h-5 fill-current" /> {t.generate}
                      </>
                  )}
              </button>
            </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;