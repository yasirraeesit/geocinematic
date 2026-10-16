import React from 'react';
import { Plus, Minus, RotateCcw, Compass } from 'lucide-react';

export default function ZoomControls() {
  const triggerZoom = (factor) => {
    window.dispatchEvent(new CustomEvent('globe-zoom', { detail: { factor } }));
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-30 flex flex-col items-center p-1 bg-slate-950/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] select-none gap-1"
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 40 }}
      title="Cinematic Zoom & Framing Controls"
    >
      {/* Zoom In Button */}
      <button
        onClick={() => triggerZoom(0.78)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-amber-400/40 active:scale-95 group relative"
        title="Zoom In (Shortcut: + or =)"
      >
        <Plus size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-5 h-px bg-slate-800" />

      {/* Zoom Out Button */}
      <button
        onClick={() => triggerZoom(1.28)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-amber-400/40 active:scale-95 group relative"
        title="Zoom Out (Shortcut: - or _)"
      >
        <Minus size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-5 h-px bg-slate-800" />

      {/* Reset Camera View Button */}
      <button
        onClick={() => triggerZoom(0)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all border border-transparent hover:border-cyan-400/40 active:scale-95 group relative"
        title="Reset Camera Framing (Shortcut: 0)"
      >
        <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-300" />
      </button>
    </div>
  );
}
