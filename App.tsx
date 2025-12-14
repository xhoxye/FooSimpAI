import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, DEFAULT_UI_VALUES, UIFieldType, RecentImage, ComfyWorkflow } from './types';
import Sidebar from './components/Sidebar';
import ImageViewer from './components/ImageViewer';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import AboutModal from './components/AboutModal';
import { prepareWorkflow } from './utils/comfyUtils';
import { translations, Language } from './utils/i18n';

// Helper to generate a UUID for Client ID
const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const CLIENT_ID = uuidv4();

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    backendUrl: 'http://127.0.0.1:8188',
    backendStatus: false,
    workflow: null,
    workflowName: 'No Workflow Loaded',
    mappings: {},
    uiValues: { ...DEFAULT_UI_VALUES, [UIFieldType.WIDTH]: 544, [UIFieldType.HEIGHT]: 960 }, // Default 544x960
    isSettingsOpen: false,
    generationStatus: 'idle',
    generatedImage: null,
    errorMessage: null,
    recentImages: [],
    activeAspectRatio: '9:16', // Default Portrait
    activeStyle: 'Realistic',
    theme: 'dark',
    language: 'en'
  });
  
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [lastGenerationDuration, setLastGenerationDuration] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize state from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('foosimpai_history');
    const savedTheme = localStorage.getItem('foosimpai_theme') as 'dark' | 'light' | null;
    const savedLang = localStorage.getItem('foosimpai_lang') as 'en' | 'zh' | null;

    setState(prev => ({
        ...prev,
        recentImages: savedHistory ? JSON.parse(savedHistory) : [],
        theme: savedTheme || 'dark',
        language: savedLang || 'en'
    }));
  }, []);

  // Persist state & Apply Theme
  useEffect(() => {
      if (state.recentImages.length > 0) {
        localStorage.setItem('foosimpai_history', JSON.stringify(state.recentImages));
      }
      localStorage.setItem('foosimpai_theme', state.theme);
      localStorage.setItem('foosimpai_lang', state.language);

      // Apply theme to html element
      if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [state.recentImages, state.theme, state.language]);

  // Timer Effect
  useEffect(() => {
    if (state.generationStatus === 'generating') {
        startTimeRef.current = Date.now();
        setElapsedTime(0);
        timerRef.current = window.setInterval(() => {
            setElapsedTime(Number(((Date.now() - startTimeRef.current) / 1000).toFixed(1)));
        }, 100);
    } else {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.generationStatus]);

  // Heartbeat to check backend status & WebSocket Connection
  useEffect(() => {
    // Clean URL for fetch requests
    const cleanUrl = state.backendUrl.replace(/\/$/, '');

    // 1. HTTP Heartbeat
    const checkConnection = async () => {
        try {
            const res = await fetch(`${cleanUrl}/system_stats`);
            if (res.ok) {
                setState(prev => ({ ...prev, backendStatus: true }));
            } else {
                setState(prev => ({ ...prev, backendStatus: false }));
            }
        } catch (e) {
            setState(prev => ({ ...prev, backendStatus: false }));
        }
    };

    checkConnection(); // Initial check
    const interval = setInterval(checkConnection, 5000); // Check every 5s

    // 2. WebSocket Connection (Required for ComfyUI to accept prompt with client_id)
    let ws: WebSocket | null = null;
    try {
        const urlObj = new URL(cleanUrl);
        const protocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${urlObj.host}/ws?clientId=${CLIENT_ID}`;
        
        ws = new WebSocket(wsUrl);
        ws.onopen = () => {
             // console.log("ComfyUI WS Connected");
        };
        ws.onerror = (err) => {
             // console.error("ComfyUI WS Error", err);
        };
    } catch (e) {
        console.error("Invalid URL for WebSocket:", e);
    }

    return () => {
        clearInterval(interval);
        if (ws) {
            ws.close();
        }
    };
  }, [state.backendUrl]);

  const handleValueChange = (field: UIFieldType, value: any) => {
    setState(prev => {
      let nextState = {
        ...prev,
        uiValues: {
          ...prev.uiValues,
          [field]: value
        }
      };

      // Check if manually changed width/height matches a preset
      if (field === UIFieldType.WIDTH || field === UIFieldType.HEIGHT) {
         const w = Number(field === UIFieldType.WIDTH ? value : prev.uiValues[UIFieldType.WIDTH]);
         const h = Number(field === UIFieldType.HEIGHT ? value : prev.uiValues[UIFieldType.HEIGHT]);
         
         let matchingRatio = 'custom';
         if (w === 1216 && h === 832) matchingRatio = '16:9';
         else if (w === 544 && h === 960) matchingRatio = '9:16';
         else if (w === 1152 && h === 864) matchingRatio = '4:3';
         else if (w === 1024 && h === 1024) matchingRatio = '1:1';

         nextState.activeAspectRatio = matchingRatio;
      }

      return nextState;
    });
  };

  const handleAspectRatioChange = (ratio: string) => {
    let width = 544;
    let height = 960;

    switch(ratio) {
        case '16:9': width = 1216; height = 832; break;
        case '9:16': width = 544; height = 960; break;
        case '4:3': width = 1152; height = 864; break;
        case '1:1': width = 1024; height = 1024; break;
        default: width = 1024; height = 1024; break;
    }

    setState(prev => ({
        ...prev,
        activeAspectRatio: ratio,
        uiValues: {
            ...prev.uiValues,
            [UIFieldType.WIDTH]: width,
            [UIFieldType.HEIGHT]: height
        }
    }));
  };

  const handleClearHistory = () => {
      setState(prev => ({ ...prev, recentImages: [] }));
      localStorage.removeItem('foosimpai_history');
  };

  const generateImage = useCallback(async () => {
    if (!state.workflow) return;

    setState(prev => ({ ...prev, generationStatus: 'generating', errorMessage: null }));
    const startTime = Date.now();
    const cleanUrl = state.backendUrl.replace(/\/$/, '');

    try {
      // 1. Prepare Payload
      // If seed is -1, generate a random one for the actual API call
      // We do NOT update state.uiValues so the UI still shows -1 (Random)
      const submissionValues = { ...state.uiValues };
      if (submissionValues[UIFieldType.SEED] === -1) {
          submissionValues[UIFieldType.SEED] = Math.floor(Math.random() * 10000000000000);
      }

      const promptWorkflow = prepareWorkflow(state.workflow, state.mappings, submissionValues);
      
      const payload = {
        client_id: CLIENT_ID,
        prompt: promptWorkflow
      };

      // 2. Send Prompt Request
      const response = await fetch(`${cleanUrl}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to queue prompt: ${response.statusText} - ${errText}`);
      }

      const data = await response.json();
      const promptId = data.prompt_id;

      // 3. Poll for completion
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 300; // 5 minutes

      while (!isDone && attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000));
        attempts++;

        const historyRes = await fetch(`${cleanUrl}/history/${promptId}`);
        if (historyRes.ok) {
           const historyData = await historyRes.json();
           if (historyData[promptId] && historyData[promptId].outputs) {
             const outputs = historyData[promptId].outputs;
             for (const nodeId in outputs) {
               if (outputs[nodeId].images && outputs[nodeId].images.length > 0) {
                 
                 // Process ALL images in the batch
                 const newImages: RecentImage[] = [];
                 let lastImageUrl = "";

                 // Loop backwards so the last image generated becomes the "main" one visible,
                 // but preserve order in history
                 for (let i = 0; i < outputs[nodeId].images.length; i++) {
                     const imgData = outputs[nodeId].images[i];
                     const imageUrl = `${cleanUrl}/view?filename=${imgData.filename}&subfolder=${imgData.subfolder}&type=${imgData.type}`;
                     lastImageUrl = imageUrl;
                     
                     newImages.push({
                         id: `${promptId}_${i}`, // Unique ID for batch items
                         url: imageUrl,
                         timestamp: Date.now(),
                         prompt: state.uiValues[UIFieldType.POSITIVE_PROMPT]
                     });
                 }
                 
                 // Calculate duration
                 const endTime = Date.now();
                 const duration = Number(((endTime - startTime) / 1000).toFixed(1));
                 setLastGenerationDuration(duration);

                 setState(prev => ({
                   ...prev,
                   generationStatus: 'success',
                   generatedImage: lastImageUrl,
                   // Limit history to 15
                   recentImages: [...newImages.reverse(), ...prev.recentImages].slice(0, 15) 
                 }));
                 isDone = true;
                 break;
               }
             }
           }
        }
      }

      if (!isDone) {
        throw new Error("Timeout waiting for image generation. The process took longer than 5 minutes.");
      }

    } catch (error: any) {
      console.error(error);
      setState(prev => ({
        ...prev,
        generationStatus: 'error',
        errorMessage: error.message || "Failed to connect to ComfyUI. Check CORS settings."
      }));
    }

  }, [state.workflow, state.mappings, state.uiValues, state.backendUrl]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-slate-900 bg-slate-100 dark:text-slate-100 dark:bg-neutral-950">
      
      <Header 
        workflowName={state.workflowName}
        hasWorkflow={!!state.workflow}
        backendStatus={state.backendStatus}
        onOpenSettings={() => setState(s => ({ ...s, isSettingsOpen: true }))}
        onOpenAbout={() => setIsAboutOpen(true)}
        theme={state.theme}
        toggleTheme={() => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}
        language={state.language}
        toggleLanguage={() => setState(s => ({ ...s, language: s.language === 'en' ? 'zh' : 'en' }))}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            uiValues={state.uiValues}
            onValueChange={handleValueChange}
            onGenerate={generateImage}
            onOpenSettings={() => setState(s => ({ ...s, isSettingsOpen: true }))}
            status={state.generationStatus}
            hasWorkflow={!!state.workflow}
            activeAspectRatio={state.activeAspectRatio}
            onAspectRatioChange={handleAspectRatioChange}
            activeStyle={state.activeStyle}
            onStyleChange={(style) => setState(s => ({ ...s, activeStyle: style }))}
            lang={state.language}
        />

        <ImageViewer 
            imageSrc={state.generatedImage}
            status={state.generationStatus}
            error={state.errorMessage}
            recentImages={state.recentImages}
            onOpenSettings={() => setState(s => ({ ...s, isSettingsOpen: true }))}
            onSelectRecent={(url) => setState(s => ({ ...s, generatedImage: url, generationStatus: 'success' }))}
            onClearHistory={handleClearHistory}
            lang={state.language}
            elapsedTime={elapsedTime}
            lastDuration={lastGenerationDuration}
        />
      </div>

      <SettingsModal 
        isOpen={state.isSettingsOpen}
        onClose={() => setState(s => ({ ...s, isSettingsOpen: false }))}
        backendUrl={state.backendUrl}
        setBackendUrl={(url) => setState(s => ({ ...s, backendUrl: url }))}
        workflow={state.workflow}
        setWorkflow={(wf) => setState(s => ({ ...s, workflow: wf }))}
        mappings={state.mappings}
        setMappings={(m) => setState(s => ({ ...s, mappings: m }))}
        setWorkflowName={(name) => setState(s => ({ ...s, workflowName: name }))}
        onUpdateUiValues={(values) => setState(s => ({ ...s, uiValues: { ...s.uiValues, ...values } }))}
        lang={state.language}
      />

      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        lang={state.language}
      />
    </div>
  );
};

export default App;