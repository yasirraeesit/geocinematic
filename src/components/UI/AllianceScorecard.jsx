import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { getFlagEmoji } from '../../utils/countryBorders';

export default function AllianceScorecard({
  presetName,
  alliances = [],
  activeAllianceId,
  onSelectActiveAlliance,
  geoJsonData
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!alliances || alliances.length === 0) return null;

  // Helper to find flag from country name
  const getFlagForCountry = (countryName) => {
    if (!geoJsonData || !geoJsonData.features) return '🌐';
    const feature = geoJsonData.features.find(
      (f) => f.properties.NAME.toLowerCase() === countryName.toLowerCase()
    );
    return feature ? getFlagEmoji(feature.properties.ISO_A2) : '🌐';
  };

  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4 flex flex-col items-center pointer-events-none select-none animate-fade-in"
      style={{ position: 'fixed', top: '4.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
    >
      {/* Preset Title Header Bar with Collapse Toggle */}
      {presetName && (
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          className="pointer-events-auto flex items-center gap-2 mb-1.5 backdrop-blur-md bg-slate-950/80 hover:bg-slate-900 px-3 py-1 rounded-full border border-white/20 shadow-lg text-[10px] font-mono tracking-wider text-amber-300 uppercase transition"
          title={isCollapsed ? 'Expand Coalition Cards' : 'Minimize Coalition Cards'}
        >
          <Shield size={11} className="text-amber-400" />
          <span>{presetName}</span>
          {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      )}

      {/* Alliance Badges Row */}
      {!isCollapsed && (
        <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        {alliances.map((alliance) => {
          const isSelected = activeAllianceId === alliance.id;
          return (
            <div
              key={alliance.id}
              onClick={() => onSelectActiveAlliance && onSelectActiveAlliance(alliance.id)}
              className={`backdrop-blur-xl px-3.5 py-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 shadow-2xl ${
                isSelected
                  ? 'bg-slate-900/95 ring-2 ring-white/80 scale-105'
                  : 'bg-slate-950/80 hover:bg-slate-900/90 hover:scale-102 border-slate-800'
              }`}
              style={{
                borderColor: isSelected ? alliance.color : undefined
              }}
              title="Click to activate and add countries by clicking on the 3D globe"
            >
              {/* Color indicator dot */}
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                style={{ backgroundColor: alliance.color }}
              />

              {/* Alliance Name and Member Count */}
              <div>
                <div className="text-xs font-bold font-sans text-white tracking-tight flex items-center gap-1.5">
                  <span>{alliance.name}</span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded-full text-slate-200"
                    style={{ backgroundColor: `${alliance.color}40` }}
                  >
                    {alliance.countries.length}
                  </span>
                </div>

                {/* Country Flags Roll */}
                <div className="flex items-center gap-1 mt-0.5 text-xs">
                  {alliance.countries.slice(0, 6).map((c) => (
                    <span key={c} title={c}>
                      {getFlagForCountry(c)}
                    </span>
                  ))}
                  {alliance.countries.length > 6 && (
                    <span className="text-[10px] font-mono text-slate-400">
                      +{alliance.countries.length - 6}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
