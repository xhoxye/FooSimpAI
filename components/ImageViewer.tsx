import React from 'react';
import { Download, Maximize2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { AppState, RecentImage } from '../types';

interface ImageViewerProps {
  imageSrc: string | null;
  status: AppState['generationStatus'];
  error: string | null;
  recentImages: RecentImage[];
  onOpenSettings: () => void;
  onSelectRecent: (url: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
    imageSrc, status, error, recentImages, onSelectRecent 
}) => {
  return (
    <main className="flex-1 flex flex-col bg-[#09090b] relative overflow-hidden">
        
        {/* Main Canvas */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full bg-[#0c0e12] rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>

                {status === 'generating' && (
                  <div className="flex flex-col items-center justify-center z-10">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-6 text-slate-400 font-medium tracking-wide animate-pulse">Creating masterpiece...</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex flex-col items-center justify-center text-red-400 max-w-md text-center p-8 bg-red-950/20 rounded-2xl border border-red-900/30 z-10">
                    <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{error || "An unknown error occurred."}</p>
                  </div>
                )}

                {status === 'success' && imageSrc && (
                  <div className="relative group w-full h-full flex items-center justify-center p-2">
                    <img 
                      src={imageSrc} 
                      alt="Generated Result" 
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    />
                    {/* Top Right Actions */}
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                       <a 
                         href={imageSrc} 
                         download={`gen-${Date.now()}.png`}
                         className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors"
                         title="Download"
                       >
                         <Download className="w-5 h-5" />
                       </a>
                       <button 
                         className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors"
                         title="Fullscreen"
                         onClick={() => window.open(imageSrc, '_blank')}
                       >
                         <Maximize2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                )}

                {(status === 'idle' && !imageSrc) && (
                  <div className="text-center z-10">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-slate-900/50 border-2 border-dashed border-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">Ready to Create</h3>
                    <p className="text-slate-500">Enter a prompt and choose a style to begin</p>
                  </div>
                )}
            </div>
        </div>

        {/* Footer / Recent Creations */}
        <div className="h-28 bg-[#09090b] px-8 py-4 flex flex-col justify-center">
            <div className="flex-1 flex gap-3 overflow-x-auto items-center custom-scrollbar">
                {recentImages.length === 0 ? (
                    <div className="w-full h-20 flex items-center justify-center text-slate-600 text-sm italic border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                        No recent history
                    </div>
                ) : (
                    recentImages.map((img) => (
                        <button 
                            key={img.id}
                            onClick={() => onSelectRecent(img.url)}
                            className="flex-shrink-0 relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition-all"
                        >
                            <img src={img.url} alt="Recent" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    </main>
  );
};

export default ImageViewer;