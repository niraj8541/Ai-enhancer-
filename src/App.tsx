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
  RotateCcw, 
  Settings2, 
  Sparkles,
  Cpu,
  Layers,
  Eye,
  ChevronRight,
  X,
  Video,
  Sliders,
  Image as ImageIcon,
  Film,
  Move,
  Home,
  CreditCard,
  HelpCircle,
  Mail,
  Menu,
  Sun,
  Moon,
  Clock,
  Key,
  MousePointer2,
  Type,
  Check,
  Star,
  Lock,
  ArrowRight,
  History,
  Palette,
  Activity,
  Wind,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Page = 'home' | 'studio' | 'pricing' | 'help' | 'contact';
type StudioMode = 'photo' | 'video' | 'motion';
type Engine = 'built-in' | 'topaz';

interface EnhancementTask {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'completed';
  progress: number;
  icon: React.ReactNode;
}

// --- Shared Components ---

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'premium' | 'success' }) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
    variant === 'default' && "bg-zinc-800 text-zinc-400 border border-zinc-700",
    variant === 'premium' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    variant === 'success' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
  )}>
    {children}
  </span>
);

const TopazBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Powered by Topaz AI by Topaz Labs</span>
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
      className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500"
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
      active ? "bg-amber-500" : "bg-zinc-800"
    )}>
      <motion.div 
        animate={{ x: active ? 16 : 0 }}
        className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </div>
  </button>
);

// --- Page Components ---

const HomePage = ({ onStart }: { onStart: (mode: StudioMode) => void }) => (
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Hero Section */}
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8"
        >
          <Sparkles size={16} className="text-emerald-500" />
          <span className="text-xs font-medium text-zinc-400">Next-Gen AI Enhancement Engine</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
        >
          VisionFlow AI Studio
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Professional AI-powered photo and video enhancement with Alight Motion-style creative tools. Powered by Topaz Labs.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button 
            onClick={() => onStart('video')}
            className="px-8 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Film size={20} />
            Video Enhancer
          </button>
          <button 
            onClick={() => onStart('photo')}
            className="px-8 py-4 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all flex items-center gap-2"
          >
            <ImageIcon size={20} />
            Photo Enhancer
          </button>
          <button 
            onClick={() => onStart('motion')}
            className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Move size={20} />
            Motion Studio
          </button>
        </motion.div>
      </div>
    </section>

    {/* Features Grid */}
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Topaz AI Engine</h3>
            <p className="text-zinc-400 leading-relaxed">Ultra-quality enhancement using industry-leading Topaz Labs technology for professional results.</p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Move className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Motion Studio</h3>
            <p className="text-zinc-400 leading-relaxed">Timeline-based keyframe animation and velocity controls inspired by Alight Motion.</p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Maximize2 className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">4K Upscaling</h3>
            <p className="text-zinc-400 leading-relaxed">Transform low-resolution content into stunning 4K masterpieces with neural reconstruction.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const PricingPage = () => (
  <div className="flex-1 overflow-y-auto custom-scrollbar py-24 px-6">
    <div className="max-w-5xl mx-auto text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Choose Your Power</h2>
      <p className="text-zinc-400">Unlock professional tools for every creator level.</p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Free Tier */}
      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col">
        <h3 className="text-xl font-bold mb-2">Free</h3>
        <div className="text-3xl font-bold mb-6">$0 <span className="text-sm text-zinc-500 font-normal">/ month</span></div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-2 text-sm text-zinc-400"><Check size={16} className="text-emerald-500" /> Built-in AI Engine</li>
          <li className="flex items-center gap-2 text-sm text-zinc-400"><Check size={16} className="text-emerald-500" /> Basic Motion Presets</li>
          <li className="flex items-center gap-2 text-sm text-zinc-400"><Check size={16} className="text-emerald-500" /> Watermark on Export</li>
        </ul>
        <button className="w-full py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all">Get Started</button>
      </div>
      {/* Pro Tier */}
      <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Popular</div>
        <h3 className="text-xl font-bold mb-2">Pro</h3>
        <div className="text-3xl font-bold mb-6">$19 <span className="text-sm text-zinc-500 font-normal">/ month</span></div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-emerald-500" /> Built-in AI + Motion Studio</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-emerald-500" /> No Watermark</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-emerald-500" /> 1080p Export</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-emerald-500" /> Priority Support</li>
        </ul>
        <button className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all">Go Pro</button>
      </div>
      {/* Ultra Tier */}
      <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col">
        <h3 className="text-xl font-bold mb-2">Ultra</h3>
        <div className="text-3xl font-bold mb-6">$49 <span className="text-sm text-zinc-500 font-normal">/ month</span></div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-amber-500" /> Topaz AI Engine</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-amber-500" /> 4K Ultra Export</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-amber-500" /> Advanced Motion Tools</li>
          <li className="flex items-center gap-2 text-sm text-zinc-200"><Check size={16} className="text-amber-500" /> Fastest Render Engine</li>
        </ul>
        <button className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all">Go Ultra</button>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [studioMode, setStudioMode] = useState<StudioMode>('video');
  const [engine, setEngine] = useState<Engine>('built-in');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [comparisonValue, setComparisonValue] = useState(50);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Enhancement States
  const [upscaleFactor, setUpscaleFactor] = useState('4x');
  const [sharpen, setSharpen] = useState(25);
  const [denoise, setDenoise] = useState(15);
  const [faceRecovery, setFaceRecovery] = useState(false);
  const [stabilization, setStabilization] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (studioMode === 'video') {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    } else if (studioMode === 'photo') {
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
    setIsEnhanced(false);
  };

  const startEnhancement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsEnhanced(true);
    }, 4000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = studioMode === 'video' ? (videoUrl || '') : (photoUrl || '');
    link.download = `enhanced_${studioMode === 'video' ? 'video' : 'photo'}.mp4`;
    link.click();
  };

  const renderStudioSidebar = () => (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-[#09090b] border-r border-zinc-800/50 flex flex-col transition-transform duration-300",
      showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
    )}>
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Zap size={18} className="text-black" />
          </div>
          <h2 className="font-bold tracking-tight text-lg">AI Studio</h2>
        </div>
        <button onClick={() => setShowSidebar(false)} className="sm:hidden p-2 text-zinc-500">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Engine Selector */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Enhancement Engine</h3>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setEngine('built-in')}
              className={cn(
                "py-2 rounded-lg text-xs font-bold transition-all",
                engine === 'built-in' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Built-in
            </button>
            <button 
              onClick={() => setEngine('topaz')}
              className={cn(
                "py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                engine === 'topaz' ? "bg-amber-500 text-black shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Star size={12} fill={engine === 'topaz' ? "currentColor" : "none"} />
              Topaz AI
            </button>
          </div>
          {engine === 'topaz' && <TopazBadge />}
        </section>

        {/* Mode Selector */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Studio Mode</h3>
          <div className="space-y-2">
            {[
              { id: 'video', label: 'Video Enhancer', icon: <Film size={16} /> },
              { id: 'photo', label: 'Photo Enhancer', icon: <ImageIcon size={16} /> },
              { id: 'motion', label: 'Motion Studio', icon: <Move size={16} /> },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setStudioMode(mode.id as StudioMode)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                  studioMode === mode.id 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700"
                )}
              >
                {mode.icon}
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Controls based on mode */}
        {studioMode === 'motion' ? (
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Motion Controls</h3>
            <div className="space-y-4">
              <TopazToggle label="Keyframe Animation" active={true} onToggle={() => {}} />
              <TopazToggle label="Velocity Easing" active={true} onToggle={() => {}} />
              <TopazToggle label="Motion Blur" active={false} onToggle={() => {}} />
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Zoom', 'Shake', 'Swipe', 'Beat-Sync'].map(p => (
                    <button key={p} className="py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:border-zinc-700 transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Enhancement Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2">
                {['1x', '2x', '4x', '4K'].map(f => (
                  <button
                    key={f}
                    onClick={() => setUpscaleFactor(f)}
                    className={cn(
                      "py-2 rounded-lg border text-[10px] font-mono transition-all",
                      upscaleFactor === f 
                        ? "bg-emerald-500 text-black border-emerald-500 font-bold" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <TopazSlider label="Sharpness" value={sharpen} onChange={setSharpen} disabled={!videoUrl && !photoUrl} />
              <TopazSlider label="Noise Reduction" value={denoise} onChange={setDenoise} disabled={!videoUrl && !photoUrl} />
              <TopazToggle label="Face Recovery" active={faceRecovery} onToggle={() => setFaceRecovery(!faceRecovery)} disabled={!videoUrl && !photoUrl} />
              {studioMode === 'video' && (
                <TopazToggle label="Stabilization" active={stabilization} onToggle={() => setStabilization(!stabilization)} disabled={!videoUrl} />
              )}
            </div>
          </section>
        )}
      </div>

      <div className="p-6 border-t border-zinc-800/50 space-y-3">
        {(videoUrl || photoUrl) && !isEnhanced && (
          <button 
            onClick={startEnhancement}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {isProcessing ? <RotateCcw className="animate-spin" size={20} /> : <Zap size={20} />}
            {isProcessing ? 'Processing...' : 'Enhance Now'}
          </button>
        )}
        {isEnhanced && (
          <button 
            onClick={handleDownload}
            className="w-full py-4 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Result
          </button>
        )}
        <button 
          onClick={() => setShowSidebar(false)}
          className="sm:hidden w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest"
        >
          Close Settings
        </button>
      </div>
    </aside>
  );

  const renderStudioViewport = () => (
    <div className="flex-1 bg-black relative flex flex-col overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />
      
      {/* Studio Header */}
      <div className="h-14 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-[#09090b]">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowSidebar(true)} className="sm:hidden p-2 text-zinc-400">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Badge variant={engine === 'topaz' ? 'premium' : 'default'}>
              {engine === 'topaz' ? 'Topaz Engine' : 'Built-in Engine'}
            </Badge>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{studioMode} Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <History size={18} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Palette size={18} />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        {(studioMode === 'video' ? videoUrl : photoUrl) ? (
          <div className="w-full h-full max-w-5xl relative flex items-center justify-center">
            {!isEnhanced ? (
              <div className="w-full h-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center relative">
                {studioMode === 'video' ? (
                  <video src={videoUrl!} controls className="w-full h-full object-contain" playsInline />
                ) : (
                  <img src={photoUrl!} className="w-full h-full object-contain" alt="Preview" />
                )}
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold text-white/70 border border-white/10 flex items-center gap-2">
                  <Monitor size={14} className="text-zinc-400" />
                  ORIGINAL PREVIEW
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative flex items-center justify-center">
                {/* Original */}
                {studioMode === 'video' ? (
                  <video src={videoUrl!} className="w-full h-full object-contain" muted loop autoPlay playsInline />
                ) : (
                  <img src={photoUrl!} className="w-full h-full object-contain" alt="Original" />
                )}

                {/* Enhanced */}
                <div 
                  className="absolute inset-0 overflow-hidden flex items-center justify-center"
                  style={{ clipPath: `inset(0 0 0 ${comparisonValue}%)` }}
                >
                  {studioMode === 'video' ? (
                    <video src={videoUrl!} className="w-full h-full object-contain" muted loop autoPlay playsInline />
                  ) : (
                    <img src={photoUrl!} className="w-full h-full object-contain" alt="Enhanced" />
                  )}
                  <div className={cn("absolute inset-0 pointer-events-none", engine === 'topaz' ? "bg-amber-500/5" : "bg-emerald-500/5")} />
                </div>

                {/* Slider Handle */}
                <div className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize z-10" style={{ left: `${comparisonValue}%` }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                      <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <input 
                  type="range" min="0" max="100" value={comparisonValue} 
                  onChange={(e) => setComparisonValue(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono text-white/70 border border-white/10">ORIGINAL</div>
                <div className={cn(
                  "absolute top-6 right-6 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold",
                  engine === 'topaz' ? "bg-amber-500 text-black" : "bg-emerald-500 text-black"
                )}>
                  {engine === 'topaz' ? 'TOPAZ ENHANCED' : 'AI ENHANCED'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-2xl aspect-video rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-zinc-900/30 transition-all group"
          >
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-300">Upload {studioMode} to begin</h3>
              <p className="text-zinc-500 mt-2 text-sm">Drag and drop or click to browse files</p>
            </div>
            <div className="flex gap-3">
              <Badge>4K Support</Badge>
              <Badge>Topaz Engine</Badge>
              <Badge>No Quality Loss</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Editor (Motion Mode Only) */}
      {studioMode === 'motion' && (
        <div className="h-48 bg-[#09090b] border-t border-zinc-800/50 flex flex-col">
          <div className="h-10 border-b border-zinc-800/50 flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><MousePointer2 size={16} /></button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><Type size={16} /></button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300"><Key size={16} /></button>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
              <span>00:00:00</span>
              <div className="w-px h-3 bg-zinc-800" />
              <span className="text-emerald-500">00:00:12</span>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto custom-scrollbar p-4 flex flex-col gap-2">
            <div className="h-8 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center px-4 gap-4">
              <span className="text-[10px] font-bold text-zinc-500 w-20">Layer 1</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full relative">
                <div className="absolute left-1/4 right-1/4 h-full bg-emerald-500/30 border-x border-emerald-500 rounded-full" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="h-8 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center px-4 gap-4">
              <span className="text-[10px] font-bold text-zinc-500 w-20">Text Layer</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full relative">
                <div className="absolute left-1/3 right-1/2 h-full bg-amber-500/30 border-x border-amber-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className={cn(
                    "absolute inset-0 rounded-full border-4 border-t-transparent",
                    engine === 'topaz' ? "border-amber-500" : "border-emerald-500"
                  )}
                />
                <div className="absolute inset-4 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Cpu className={cn("w-10 h-10 animate-pulse", engine === 'topaz' ? "text-amber-500" : "text-emerald-500")} />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  {engine === 'topaz' ? 'Topaz Neural Reconstruction' : 'AI Enhancement in Progress'}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {engine === 'topaz' 
                    ? "Using Topaz AI to deliver ultra-sharp details, advanced noise reduction, and realistic upscaling without artifacts."
                    : "Enhancing quality, improving sharpness, and balancing colors for a natural output."}
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4 }}
                    className={cn("h-full", engine === 'topaz' ? "bg-amber-500" : "bg-emerald-500")}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>NEURAL CLUSTER ACTIVE</span>
                  <span>ETA: 4s</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-300",
      isDarkMode ? "bg-[#09090b] text-white" : "bg-white text-black"
    )}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept={studioMode === 'video' ? 'video/*' : 'image/*'} 
      />

      {/* Global Header */}
      <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 sticky top-0 z-[60] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Activity size={18} className="text-black" />
            </div>
            <span className="font-bold tracking-tighter text-xl">VisionFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { id: 'home', label: 'Home', icon: <Home size={14} /> },
              { id: 'studio', label: 'AI Studio', icon: <Cpu size={14} /> },
              { id: 'pricing', label: 'Pricing', icon: <CreditCard size={14} /> },
              { id: 'help', label: 'Help', icon: <HelpCircle size={14} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  currentPage === item.id ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setCurrentPage('studio')}
            className="hidden sm:flex px-4 py-2 rounded-xl bg-emerald-500 text-black text-sm font-bold hover:bg-emerald-400 transition-all"
          >
            Open Studio
          </button>
          <button className="md:hidden p-2 text-zinc-400">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {currentPage === 'home' && <HomePage onStart={(mode) => { setStudioMode(mode); setCurrentPage('studio'); }} />}
        {currentPage === 'pricing' && <PricingPage />}
        {currentPage === 'studio' && (
          <>
            {renderStudioSidebar()}
            {renderStudioViewport()}
          </>
        )}
        {(currentPage === 'help' || currentPage === 'contact') && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-8">
              <Mail size={32} className="text-zinc-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-zinc-500 max-w-md">We're currently building out our support and contact portals. Please check back later or visit our Pricing page.</p>
            <button onClick={() => setCurrentPage('home')} className="mt-8 px-6 py-3 rounded-xl bg-zinc-100 text-black font-bold">Back to Home</button>
          </div>
        )}
      </main>

      {/* Footer (Only on non-studio pages) */}
      {currentPage !== 'studio' && (
        <footer className="py-12 px-6 border-t border-zinc-800/50 bg-[#09090b]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-emerald-500" />
              <span className="font-bold">VisionFlow AI Studio</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-zinc-300">Terms</a>
              <a href="#" className="hover:text-zinc-300">Privacy</a>
              <a href="#" className="hover:text-zinc-300">Security</a>
            </div>
            <p className="text-sm text-zinc-600">© 2026 VisionFlow AI. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
