import React from 'react';
import { MapPin } from 'lucide-react';
import { getFlagEmoji } from '../../utils/countryBorders';

export default function GeopoliticalLabels({ labels = [], featuredCountry }) {
  if (!labels || labels.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {labels.map((item, index) => {
        const { x, y, name, isFeatured, flag, iso2 } = item;

        // Skip if off screen or too close to window edges
        if (x < 30 || x > window.innerWidth - 30 || y < 40 || y > window.innerHeight - 40) {
          return null;
        }

        if (isFeatured) {
          // Large Featured National Callout in center of extruded country
          return (
            <div
              key={`featured-${name}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-75 animate-fade-in"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {/* Central Glowing Anchor Radar */}
              <div className="relative flex items-center justify-center mb-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-ping opacity-75" />
                <span className="absolute w-2 h-2 rounded-full bg-white shadow-md" />
              </div>

              {/* Glossy Featured Badge */}
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
                <span className="text-xl filter drop-shadow">
                  {flag || getFlagEmoji(iso2)}
                </span>
                <span className="font-serif font-black tracking-widest text-sm text-white uppercase drop-shadow">
                  {name}
                </span>
              </div>
            </div>
          );
        }

        // Surrounding Neighboring Country Callout Badge
        const borderColor = item.color ? `${item.color}80` : 'rgba(255, 255, 255, 0.25)';
        const glowColor = item.color ? `${item.color}30` : 'rgba(0, 0, 0, 0.7)';

        return (
          <div
            key={`neighbor-${name}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 backdrop-blur-xl bg-slate-950/90 px-2.5 py-1 rounded-xl transition-all duration-75 shadow-lg border"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              borderColor: borderColor,
              boxShadow: `0 4px 16px ${glowColor}`
            }}
          >
            {/* Small Glowing Anchor Point */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color || '#f59e0b' }}
            />

            {/* ISO Badge */}
            {iso2 && (
              <span className="text-[9px] font-mono font-bold text-slate-300 bg-slate-800/80 px-1 py-0.2 rounded border border-slate-700/60">
                {iso2}
              </span>
            )}

            {/* Country Name */}
            <span className="font-sans font-bold tracking-wider text-[11px] text-slate-100 uppercase drop-shadow">
              {name}
            </span>

            {/* Optional Alliance Tag */}
            {item.allianceName && (
              <span
                className="text-[9px] font-mono tracking-tight font-semibold uppercase truncate max-w-[100px]"
                style={{ color: item.color || '#38bdf8' }}
              >
                • {item.allianceName}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
