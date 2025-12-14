import React from 'react';
import { X, BookOpen, Github, Zap } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Zap className="w-5 h-5 text-white fill-current" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.aboutTitle}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.aboutDesc}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            
            <section className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t.aboutText}
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> {t.guide}
                </h3>
                <ol className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">1</span>
                        <div>
                            <strong className="text-slate-700 dark:text-slate-200 block mb-1">{t.guide1Title}</strong>
                            {t.guide1Text}
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">2</span>
                        <div>
                            <strong className="text-slate-700 dark:text-slate-200 block mb-1">{t.guide2Title}</strong>
                            {t.guide2Text}
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">3</span>
                        <div>
                            <strong className="text-slate-700 dark:text-slate-200 block mb-1">{t.guide3Title}</strong>
                            {t.guide3Text}
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">4</span>
                        <div>
                            <strong className="text-slate-700 dark:text-slate-200 block mb-1">{t.guide4Title}</strong>
                            {t.guide4Text}
                        </div>
                    </li>
                </ol>
            </section>

            <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Version 1.0.0</span>
                    <a href="https://github.com/xhoxye/FooSimpAI" target="_blank" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
                        <Github className="w-4 h-4" /> {t.sourceCode}
                    </a>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;