import React from 'react';

export default function HoverTooltip({ hoverData }) {
  if (!hoverData || !hoverData.name) return null;

  return (
    <div
      className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-12 transition-transform duration-75 flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl text-xs font-mono text-white select-none"
      style={{ left: `${hoverData.x}px`, top: `${hoverData.y}px` }}
    >
      <span className="text-base">{hoverData.flag || '🌐'}</span>
      <span className="font-bold tracking-wide text-cyan-300 uppercase">{hoverData.name}</span>
      <span className="text-[10px] text-slate-400 font-sans ml-1">(Click to Focus)</span>
    </div>
  );
}
