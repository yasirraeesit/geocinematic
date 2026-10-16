import React from 'react';
import { getFlagEmoji } from '../../utils/countryBorders';

export default function GeopoliticalLabels({ labels = [], featuredCountry }) {
  if (!labels || labels.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {labels.map((item, index) => {
        const { x, y, name, isFeatured, flag, iso2 } = item;

        // Skip if off screen
        if (x < 20 || x > window.innerWidth - 20 || y < 20 || y > window.innerHeight - 20) {
          return null;
        }

        if (isFeatured) {
          // Large Featured National Flag & Callout in center of extruded country
          return (
            <div
              key={`featured-${name}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-75"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {/* Glossy Flag Badge */}
              <div className="relative group p-1 bg-black/60 backdrop-blur-md border-2 border-white/80 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.8)] flex items-center justify-center animate-bounce-slow">
                <span className="text-3xl md:text-4xl filter drop-shadow">
                  {flag || getFlagEmoji(iso2)}
                </span>
              </div>

              {/* Glowing Country Title */}
              <div className="mt-1 px-3 py-0.5 bg-red-950/90 border border-red-500/80 rounded-md shadow-xl text-center">
                <span className="font-serif font-black tracking-widest text-xs md:text-sm text-white uppercase drop-shadow">
                  {name}
                </span>
              </div>
            </div>
          );
        }

        // Surrounding Country / Alliance Member Callout Badge
        const borderColor = item.color ? `${item.color}90` : 'rgba(255, 255, 255, 0.4)';
        const shadowGlow = item.color ? `0 4px 16px ${item.color}40` : '0 4px 16px rgba(0, 0, 0, 0.7)';

        return (
          <div
            key={`neighbor-${name}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 backdrop-blur-md bg-black/75 px-2.5 py-1 rounded-lg transition-all duration-75"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              border: `1.5px solid ${borderColor}`,
              boxShadow: shadowGlow
            }}
          >
            <span className="text-base filter drop-shadow">
              {flag || getFlagEmoji(iso2)}
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold tracking-wider text-[11px] md:text-xs text-white uppercase drop-shadow">
                {name}
              </span>
              {item.allianceName && (
                <span
                  className="text-[9px] font-mono tracking-tight font-semibold uppercase truncate max-w-[120px]"
                  style={{ color: item.color || '#38bdf8' }}
                >
                  {item.allianceName}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
