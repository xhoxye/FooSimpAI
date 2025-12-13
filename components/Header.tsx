import React from 'react';
import { Wand2, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  workflowName: string;
  hasWorkflow: boolean;
  backendStatus: boolean;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ workflowName, hasWorkflow, backendStatus, onOpenSettings, onOpenAbout }) => {
  return (
    <header className="h-16 bg-[#0c0e12] flex items-center justify-between px-6 shrink-0 z-30">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.5)]">
          <Wand2 className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">FooSimpAI</h1>
      </div>

      {/* Center: Workflow Name */}
      <div className="hidden md:flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${hasWorkflow ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
            {workflowName}
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenAbout}
          className="text-slate-400 hover:text-white transition-colors" 
          title="About"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <button 
          onClick={onOpenSettings}
          className="text-slate-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800" title={backendStatus ? "Backend Connected" : "Backend Disconnected"}>
            <div className={`relative flex h-3 w-3`}>
              {backendStatus && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${backendStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
                {backendStatus ? 'Online' : 'Offline'}
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;