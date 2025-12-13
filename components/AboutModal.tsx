import React from 'react';
import { X, BookOpen, Github, Zap } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Zap className="w-5 h-5 text-white fill-current" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">About FooSimpAI</h2>
                <p className="text-xs text-slate-400">Next-Gen ComfyUI Frontend</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            
            <section className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                    FooSimpAI is a streamlined, user-friendly interface designed for <strong>ComfyUI</strong>. 
                    It bridges the gap between complex node-based workflows and simple, accessible artistic creation.
                    By mapping complex node inputs to a clean UI, it allows you to focus on prompting and style rather than connecting wires.
                </p>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Quick Start Guide
                </h3>
                <ol className="space-y-4 text-sm text-slate-400">
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-700">1</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">Connect Backend</strong>
                            Ensure your ComfyUI instance is running with <code>--listen</code> and CORS enabled. Click the gear icon to configure the URL.
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-700">2</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">Load Workflow</strong>
                            Upload a workflow exported in <strong>API Format (JSON)</strong> from ComfyUI. Standard JSON workflows won't work directly.
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-700">3</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">Map Parameters</strong>
                            Use the settings dialog to map UI controls (Prompt, Seed, etc.) to specific nodes in your workflow. We try to auto-detect them!
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs border border-slate-700">4</span>
                        <div>
                            <strong className="text-slate-200 block mb-1">Generate</strong>
                            Close settings, type your prompt, and hit Generate!
                        </div>
                    </li>
                </ol>
            </section>

            <section className="pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Version 1.0.0</span>
                    <a href="#" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                        <Github className="w-4 h-4" /> Source Code
                    </a>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;