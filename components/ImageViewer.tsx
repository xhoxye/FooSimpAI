import React, { useState } from 'react';
import { Download, ExternalLink, Image as ImageIcon, AlertTriangle, Trash2, X, Maximize2, Loader2 } from 'lucide-react';
import { AppState, RecentImage } from '../types';
import { translations, Language } from '../utils/i18n';

interface ImageViewerProps {
  imageSrc: string | null;
  status: AppState['generationStatus'];
  error: string | null;
  recentImages: RecentImage[];
  onOpenSettings: () => void;
  onSelectRecent: (url: string) => void;
  onClearHistory?: () => void;
  lang: Language;
  elapsedTime: number;
  lastDuration: number | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
    imageSrc, status, error, recentImages, onSelectRecent, onClearHistory, lang, elapsedTime, lastDuration
}) => {
  const t = translations[lang];
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Card style same as Sidebar
  const cardStyle = "bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-800";

  return (
    <main className="flex-1 flex flex-col bg-slate-100 dark:bg-neutral-950 relative overflow-hidden transition-colors p-4 pl-0">
        
        {/* Lightbox Modal */}
        {isLightboxOpen && imageSrc && (
            <div 
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
                onClick={() => setIsLightboxOpen(false)}
            >
                 <div className="relative w-full h-full flex items-center justify-center p-4">
                     <img 
                        src={imageSrc} 
                        alt="Full Screen" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                     />
                 </div>
                 {/* Fixed Close Button Top Right of Viewport */}
                 <button 
                    className="fixed top-6 right-6 p-3 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-full transition-colors z-[101] backdrop-blur-md border border-white/10"
                    title={t.close}
                    onClick={() => setIsLightboxOpen(false)}
                 >
                    <X className="w-6 h-6" />
                 </button>
            </div>
        )}

        {/* Main Canvas Area (Card) */}
        <div className={`flex-1 flex flex-col items-center justify-center overflow-hidden mb-3 ${cardStyle} relative`}>
            
            {/* Inner Content */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>

                {status === 'generating' && (
                  <div className="flex flex-col items-center justify-center z-10">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 dark:border-neutral-800 border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-400 dark:text-neutral-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-6 text-slate-500 dark:text-neutral-400 font-medium tracking-wide animate-pulse">{t.creating}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400 max-w-md text-center p-8 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30 z-10">
                    <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">{t.genFailed}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{error || "An unknown error occurred."}</p>
                  </div>
                )}

                {status === 'success' && imageSrc && (
                  <div className="relative group w-full h-full flex items-center justify-center p-4 cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
                    <img 
                      src={imageSrc} 
                      alt="Generated Result" 
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    />
                    
                    {/* Floating Actions inside image area */}
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" onClick={(e) => e.stopPropagation()}>
                       <a 
                         href={imageSrc} 
                         download={`gen-${Date.now()}.png`}
                         className="p-3 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-slate-900 dark:text-white rounded-xl backdrop-blur-md border border-slate-200 dark:border-white/10 transition-colors shadow-lg"
                         title={t.download}
                       >
                         <Download className="w-5 h-5" />
                       </a>
                       <button 
                         className="p-3 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-slate-900 dark:text-white rounded-xl backdrop-blur-md border border-slate-200 dark:border-white/10 transition-colors shadow-lg"
                         title={t.openInNewTab}
                         onClick={() => window.open(imageSrc, '_blank')}
                       >
                         <ExternalLink className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                )}

                {(status === 'idle' && !imageSrc) && (
                  <div className="text-center z-10">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-slate-50 dark:bg-neutral-800/50 border-2 border-dashed border-slate-200 dark:border-neutral-800 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-slate-300 dark:text-neutral-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 dark:text-neutral-300 mb-2">{t.ready}</h3>
                    <p className="text-slate-500 dark:text-neutral-500">{t.readyHint}</p>
                  </div>
                )}
            </div>

            {/* Time / Status Overlay - Bottom Left */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                 {(status === 'generating' || (status === 'success' && lastDuration)) && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                        {status === 'generating' && (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                                    {t.timeElapsed}{elapsedTime}s
                                </p>
                            </>
                        )}
                        {status === 'success' && lastDuration && (
                             <p className="text-xs font-medium text-slate-500 dark:text-neutral-300">
                                {t.timeLast}{lastDuration}s
                            </p>
                        )}
                    </div>
                 )}
            </div>
        </div>

        {/* Footer / Recent Creations (Card) */}
        <div className={`${cardStyle} h-28 flex items-center pl-6 pr-4 py-4`}>
            <div className="flex-1 flex gap-3 overflow-x-auto items-center custom-scrollbar pr-4">
                {recentImages.length === 0 ? (
                    <div className="w-full h-20 flex items-center justify-center text-slate-400 dark:text-neutral-600 text-sm italic border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-800/30">
                        {t.noHistory}
                    </div>
                ) : (
                    recentImages.map((img) => (
                        <button 
                            key={img.id}
                            onClick={() => onSelectRecent(img.url)}
                            title={t.fullscreen}
                            className={`flex-shrink-0 relative group w-20 h-20 rounded-xl overflow-hidden border transition-all ${imageSrc === img.url ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-neutral-800 hover:border-blue-500'}`}
                        >
                            <img src={img.url} alt="Recent" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    ))
                )}
            </div>
            {recentImages.length > 0 && onClearHistory && (
                <div className="pl-4 border-l border-slate-200 dark:border-neutral-800 ml-2">
                    <button 
                        onClick={onClearHistory}
                        title={t.clearHistory}
                        className="p-3 text-slate-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    </main>
  );
};

export default ImageViewer;