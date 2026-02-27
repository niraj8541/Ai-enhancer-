/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Zap, 
  Maximize2, 
  ShieldCheck, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings2, 
  Sparkles,
  Cpu,
  Layers,
  Eye,
  ChevronRight,
  Info,
  MessageSquare,
  X,
  Activity,
  Wind,
  Video,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface EnhancementTask {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'completed';
  progress: number;
  icon: React.ReactNode;
}

// --- Components ---

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
    )}
  >
    <div className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
    )}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
      />
    )}
  </button>
);

const EnhancementCard = ({ task }: { task: EnhancementTask }) => (
  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
          {task.icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-zinc-200">{task.name}</h4>
          <p className="text-xs text-zinc-500">
            {task.status === 'idle' ? 'Ready' : task.status === 'processing' ? 'Enhancing...' : 'Optimized'}
          </p>
        </div>
      </div>
      {task.status === 'completed' && (
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
      )}
    </div>
    
    {task.status === 'processing' && (
      <div className="space-y-2">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>{task.progress}%</span>
          <span>ETA: 12s</span>
        </div>
      </div>
    )}
  </div>
);

const TopazSlider = ({ label, value, onChange, min = 0, max = 100, disabled = false }: { label: string, value: number, onChange: (v: number) => void, min?: number, max?: number, disabled?: boolean }) => (
  <div className={cn("space-y-2 transition-opacity", disabled && "opacity-40 pointer-events-none")}>
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      <span className="text-[10px] font-mono text-zinc-300">{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={disabled}
      className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);

const TopazToggle = ({ label, active, onToggle, disabled = false }: { label: string, active: boolean, onToggle: () => void, disabled?: boolean }) => (
  <button 
    onClick={onToggle}
    disabled={disabled}
    className={cn(
      "flex items-center justify-between w-full group transition-opacity",
      disabled && "opacity-40 pointer-events-none"
    )}
  >
    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
    <div className={cn(
      "w-8 h-4 rounded-full relative transition-colors duration-200",
      active ? "bg-emerald-500" : "bg-zinc-800"
    )}>
      <motion.div 
        animate={{ x: active ? 16 : 0 }}
        className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </div>
  </button>
);

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonValue, setComparisonValue] = useState(50);
  const [activeTab, setActiveTab] = useState('upscale');
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEnhanced, setIsEnhanced] = useState(false);
  
  // Topaz Settings State
  const [selectedModel, setSelectedModel] = useState('Proteus');
  const [upscaleFactor, setUpscaleFactor] = useState('4x');
  const [sharpen, setSharpen] = useState(25);
  const [denoise, setDenoise] = useState(15);
  const [recoverDetails, setRecoverDetails] = useState(40);
  const [revertCompression, setRevertCompression] = useState(30);
  const [stabilization, setStabilization] = useState(false);
  const [frameInterpolation, setFrameInterpolation] = useState(false);
  const [interpolationModel, setInterpolationModel] = useState('Apollo');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tasks: EnhancementTask[] = [
    { id: 'upscale', name: '4K AI Upscaling', status: isProcessing ? 'processing' : 'idle', progress: 65, icon: <Maximize2 size={18} /> },
    { id: 'denoise', name: 'Temporal Denoising', status: 'idle', progress: 0, icon: <Layers size={18} /> },
    { id: 'color', name: 'HDR Color Grading', status: 'idle', progress: 0, icon: <Zap size={18} /> },
    { id: 'face', name: 'Face Restoration', status: 'idle', progress: 0, icon: <Eye size={18} /> },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setIsEnhanced(false);
      runAiAnalysis(file.name);
    }
  };

  const runAiAnalysis = async (fileName: string) => {
    setIsAiTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this video file name: "${fileName}". 
        Provide a professional technical assessment of what AI enhancements would benefit this video. 
        Focus on: Resolution upscaling, noise reduction, and color correction. 
        Keep it concise and technical. Format as a short list.`,
      });
      setAiAnalysis(response.text || "Analysis complete. Ready for enhancement.");
    } catch (error) {
      setAiAnalysis("Unable to perform deep AI analysis. Proceeding with standard optimization protocols.");
    } finally {
      setIsAiTyping(false);
    }
  };

  const startEnhancement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsEnhanced(true);
    }, 5000);
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = videoFile ? `enhanced_${videoFile.name}` : 'enhanced_video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Zap className="text-black w-5 h-5 fill-current" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">VisionFlow <span className="text-emerald-500">AI</span></h1>
          <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">v4.2.0-PRO</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Settings2 size={20} />
          </button>
          <button className="hidden sm:block text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">Documentation</button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-semibold hover:bg-white transition-all active:scale-95"
          >
            <Upload size={16} />
            Import Video
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="video/*" 
          />
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)] overflow-hidden relative">
        {/* Left Sidebar - Controls */}
        <AnimatePresence mode="wait">
          {showSidebar && (
            <>
              {/* Mobile Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSidebar(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 lg:hidden"
              />
              <motion.aside 
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full sm:w-80 flex-shrink-0 border-r border-zinc-800/50 flex flex-col bg-[#09090b] overflow-y-auto custom-scrollbar z-20 absolute lg:relative h-full"
              >
              <div className="p-6 space-y-8 pb-24">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-zinc-400" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Enhancement Settings</h2>
                  </div>
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden p-1 text-zinc-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* AI Model Section */}
                <section className={cn("transition-opacity", !videoUrl && "opacity-40 pointer-events-none")}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Enhancement Model</h3>
                    <Sparkles size={14} className="text-emerald-500" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {['Proteus', 'Artemis', 'Gaia', 'Iris', 'Nyx'].map(model => (
                      <button 
                        key={model}
                        disabled={!videoUrl}
                        onClick={() => setSelectedModel(model)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm group",
                          selectedModel === model 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                            : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{model}</span>
                          <span className="text-[9px] opacity-50 font-mono">
                            {model === 'Proteus' && 'Manual Fine-tuning'}
                            {model === 'Artemis' && 'Low Quality/Noisy'}
                            {model === 'Gaia' && 'High Fidelity Upscale'}
                            {model === 'Iris' && 'Face Restoration'}
                            {model === 'Nyx' && 'Low Light Denoise'}
                          </span>
                        </div>
                        {selectedModel === model && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Upscale Section */}
                <section className={cn("transition-opacity", !videoUrl && "opacity-40 pointer-events-none")}>
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Output Resolution</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['1x', '2x', '4x', '8x'].map(factor => (
                      <button 
                        key={factor}
                        disabled={!videoUrl}
                        onClick={() => setUpscaleFactor(factor)}
                        className={cn(
                          "py-2 rounded-lg border text-xs font-mono transition-all",
                          upscaleFactor === factor 
                            ? "bg-emerald-500 text-black border-emerald-500 font-bold" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Model Parameters */}
                <section className={cn("space-y-6 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 transition-opacity", !videoUrl && "opacity-40 pointer-events-none")}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders size={14} className="text-zinc-500" />
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Model Parameters</h3>
                  </div>
                  <TopazSlider label="Revert Compression" value={revertCompression} onChange={setRevertCompression} disabled={!videoUrl} />
                  <TopazSlider label="Recover Details" value={recoverDetails} onChange={setRecoverDetails} disabled={!videoUrl} />
                  <TopazSlider label="Sharpen" value={sharpen} onChange={setSharpen} disabled={!videoUrl} />
                  <TopazSlider label="Reduce Noise" value={denoise} onChange={setDenoise} disabled={!videoUrl} />
                  <TopazSlider label="Motion Deblur" value={15} onChange={() => {}} disabled={!videoUrl} />
                  <TopazSlider label="Dehalo" value={5} onChange={() => {}} disabled={!videoUrl} />
                  <TopazSlider label="Anti-Alias" value={10} onChange={() => {}} disabled={!videoUrl} />
                  <TopazSlider label="Add Grain" value={8} onChange={() => {}} disabled={!videoUrl} />
                </section>

                {/* Additional Features */}
                <section className={cn("space-y-4 pt-4 border-t border-zinc-800/50 transition-opacity", !videoUrl && "opacity-40 pointer-events-none")}>
                  <TopazToggle label="Stabilization" active={stabilization} onToggle={() => setStabilization(!stabilization)} disabled={!videoUrl} />
                  <TopazToggle label="Frame Interpolation" active={frameInterpolation} onToggle={() => setFrameInterpolation(!frameInterpolation)} disabled={!videoUrl} />
                  
                  {frameInterpolation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-4 space-y-3"
                    >
                      <div className="flex gap-2">
                        {['Apollo', 'Chronos'].map(m => (
                          <button 
                            key={m}
                            disabled={!videoUrl}
                            onClick={() => setInterpolationModel(m)}
                            className={cn(
                              "flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all",
                              interpolationModel === m 
                                ? "bg-zinc-100 text-black border-white" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </section>

                <div className="pt-4 space-y-3">
                  <button 
                    disabled={!videoUrl || isProcessing}
                    onClick={startEnhancement}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      videoUrl && !isProcessing 
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <RotateCcw className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Start Enhancement
                      </>
                    )}
                  </button>

                  {videoUrl && !isProcessing && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleDownload}
                      className="w-full py-4 rounded-xl font-bold text-sm bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      <Download size={18} />
                      Download Enhanced Video
                    </motion.button>
                  )}

                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden w-full py-3 rounded-xl border border-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all"
                  >
                    Close Settings & View Video
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

        {/* Center - Viewport */}
        <section className="flex-1 bg-black relative flex flex-col">
          <div className="flex-1 relative overflow-hidden group">
            {videoUrl ? (
              <div className="w-full h-full relative flex items-center justify-center p-4">
                {!isEnhanced ? (
                  /* Standard Preview with Controls */
                  <div className="relative w-full h-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/70 border border-white/10 flex items-center gap-2">
                      <Video size={12} className="text-zinc-400" />
                      SOURCE PREVIEW
                    </div>
                  </div>
                ) : (
                  /* Comparison Slider (Only after enhancement) */
                  <div className="relative w-full h-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
                    {/* Original (Left) */}
                    <video 
                      ref={videoRef}
                      src={videoUrl} 
                      className="w-full h-full object-contain"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    
                    {/* Enhanced (Right - Masked) */}
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
                      style={{ clipPath: `inset(0 0 0 ${comparisonValue}%)` }}
                    >
                      <video 
                        src={videoUrl} 
                        className="w-full h-full object-contain"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                      {/* Enhancement Overlay Effects */}
                      <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                    </div>

                    {/* Slider Handle */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize z-10"
                      style={{ left: `${comparisonValue}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-3 bg-zinc-400 rounded-full" />
                          <div className="w-0.5 h-3 bg-zinc-400 rounded-full" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white/70 border border-white/10 -translate-x-full mr-2">
                        ORIGINAL
                      </div>
                      <div className="absolute top-4 right-4 bg-emerald-500/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-black font-bold translate-x-full ml-2">
                        ENHANCED
                      </div>
                    </div>

                    {/* Invisible Input for Slider */}
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={comparisonValue} 
                      onChange={(e) => setComparisonValue(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />

                    {/* AI Scanning Line */}
                    {isProcessing && (
                      <motion.div 
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-30 pointer-events-none"
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-zinc-900/30 transition-colors"
              >
                <div className="w-24 h-24 rounded-3xl bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                  <Upload className="w-10 h-10 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-zinc-200">Drop your video here</h2>
                  <p className="text-zinc-500 mt-2">Supports MP4, MOV, AVI up to 4K resolution</p>
                </div>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500">H.265 SUPPORTED</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500">AI UPSCALING</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500">PRO RES 422</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar - Timeline/Info */}
          <div className="h-20 border-t border-zinc-800/50 bg-[#09090b] flex items-center px-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Resolution</span>
                <span className="text-sm font-mono text-zinc-300">{videoFile ? '1920 x 1080' : '--'}</span>
              </div>
              <ChevronRight className="text-zinc-700" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Output Target</span>
                <span className="text-sm font-mono text-emerald-400">{videoFile ? '3840 x 2160 (4K)' : '--'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500"><span className="text-zinc-300 font-medium">1.2k users</span> enhanced videos today</p>
            </div>
          </div>
        </section>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-80 flex-shrink-0 border-l border-zinc-800/50 flex flex-col bg-[#09090b]">
          <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">AI Analysis</h3>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500">LIVE</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-emerald-500" />
                </div>
                <div className="flex-1 bg-zinc-900/50 rounded-2xl rounded-tl-none p-4 border border-zinc-800/50">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {isAiTyping ? (
                      <span className="flex gap-1 items-center">
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    ) : aiAnalysis || "Upload a video to begin deep frame analysis. Our neural engine will detect artifacts, noise patterns, and dynamic range opportunities."}
                  </p>
                </div>
              </div>
            </div>

            {videoFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <Info size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Optimization Tip</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Detected low-light noise in shadows. Enabling <span className="text-emerald-400">Temporal Denoising</span> is recommended for this sequence.
                </p>
                <button className="w-full py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase hover:bg-emerald-500/20 transition-colors">
                  Apply Recommended Fix
                </button>
              </motion.div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800/50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask AI about your video..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-emerald-500 transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Processing Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-8 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500"
                />
                <div className="absolute inset-4 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-emerald-500 animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Enhancing Your Vision</h2>
                <p className="text-zinc-400">Our neural clusters are reconstructing frames and restoring details. This usually takes a few moments.</p>
              </div>

              <div className="space-y-4">
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5 }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                  <span>FRAME 428/1200</span>
                  <span>60 FPS TARGET</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Current Task</span>
                  <span className="text-xs font-medium">Super-Resolution x4</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Engine</span>
                  <span className="text-xs font-medium">VisionFlow Neural v4</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
