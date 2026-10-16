import React from 'react';
import { MousePointer, Shield, Sparkles } from 'lucide-react';

export default function HoverTooltip({ hoverData, appMode = 'geopolitical', activeAlliance }) {
  if (!hoverData || !hoverData.name) return null;

  const isAllianceMode = appMode === 'alliances';

  return (
    <div
      className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-14 transition-transform duration-75 flex items-center gap-2.5 px-3.5 py-2 bg-slate-950/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-xs font-mono text-white select-none animate-fade-in"
      style={{
        left: `${hoverData.x}px`,
        top: `${hoverData.y}px`,
        borderColor: isAllianceMode && activeAlliance ? `${activeAlliance.color}90` : 'rgba(245, 158, 11, 0.4)'
      }}
    >
      {/* Country Flag Badge */}
      <span className="text-xl filter drop-shadow">{hoverData.flag || '🌐'}</span>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tracking-wide text-white uppercase font-sans text-xs">
            {hoverData.name}
          </span>
          {hoverData.iso2 && (
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">
              {hoverData.iso2}
            </span>
          )}
        </div>

        {/* Dynamic Contextual Action Prompt */}
        <div className="flex items-center gap-1 text-[10px] text-slate-300 font-sans mt-0.5">
          {isAllianceMode ? (
            <>
              <Shield size={10} style={{ color: activeAlliance?.color || '#38bdf8' }} />
              <span>
                Click to draft into{' '}
                <strong style={{ color: activeAlliance?.color || '#38bdf8' }}>
                  {activeAlliance?.name || 'Coalition'}
                </strong>
              </span>
            </>
          ) : (
            <>
              <Sparkles size={10} className="text-amber-400" />
              <span>Click to 3D Extrude & Frame</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
