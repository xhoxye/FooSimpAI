import React from 'react';
import { Wand2, Settings, HelpCircle, Moon, Sun, Languages } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface HeaderProps {
  workflowName: string;
  hasWorkflow: boolean;
  backendStatus: boolean;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  workflowName, hasWorkflow, backendStatus, onOpenSettings, onOpenAbout,
  theme, toggleTheme, language, toggleLanguage
}) => {
  const t = translations[language];

  return (
    <header className="h-16 flex items-center justify-between px-6 shrink-0 z-30 transition-colors duration-200 bg-slate-100 dark:bg-neutral-950">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Wand2 className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t.appName}</h1>
      </div>

      {/* Center: Workflow Name */}
      <div className="hidden md:flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${hasWorkflow ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
            {workflowName}
        </div>
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center gap-4">
        
        {/* Language Toggle */}
        <button 
            onClick={toggleLanguage}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            title={t.switchLang}
        >
            <Languages className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            title={t.toggleTheme}
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={onOpenAbout}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors p-2 hover:bg-white dark:hover:bg-neutral-800 rounded-lg" 
          title={t.openAbout}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        
        {/* Combined Settings & Status Button */}
        <button 
          onClick={onOpenSettings}
          className="group flex items-center gap-3 bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 rounded-lg px-3 py-2 transition-all shadow-sm"
          title={t.openSettings}
        >
          <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
          
          {/* Status Indicator inside the button */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-neutral-700">
              <div className={`relative flex h-3 w-3`}>
                {backendStatus && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${backendStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 uppercase tracking-wider hidden sm:block w-12 text-center">
                  {backendStatus ? t.online : t.offline}
              </span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;