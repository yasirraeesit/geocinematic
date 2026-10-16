import React, { useState } from 'react';
import {
  X,
  Layers,
  MapPin,
  Shield,
  Palette,
  Camera,
  Compass,
  Sliders,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { ALLIANCE_PRESETS } from '../../data/alliancePresets';
import { SAMPLE_STORIES } from '../../data/sampleRoutes';

const POPULAR_COUNTRIES = [
  { name: 'Iran', flag: '🇮🇷', color: '#dc2626' },
  { name: 'Ukraine', flag: '🇺🇦', color: '#2563eb' },
  { name: 'Taiwan', flag: '🇹🇼', color: '#059669' },
  { name: 'United States of America', flag: '🇺🇸', color: '#b91c1c' },
  { name: 'China', flag: '🇨🇳', color: '#d97706' },
  { name: 'Israel', flag: '🇮🇱', color: '#3b82f6' },
  { name: 'Saudi Arabia', flag: '🇸🇦', color: '#10b981' },
  { name: 'Russia', flag: '🇷🇺', color: '#7c3aed' }
];

const PRESET_COLORS = [
  '#dc2626', // Crimson Red
  '#f59e0b', // Golden Amber
  '#10b981', // Emerald Green
  '#2563eb', // Royal Blue
  '#8b5cf6', // Electric Purple
  '#ec4899', // Hot Pink
  '#06b6d4', // Cyan
  '#ffffff'  // Crisp White
];

export default function Sidebar({
  isOpen,
  onToggle,
  appMode,
  onAppModeChange,
  selectedCountry,
  onSelectCountry,
  extrudeHeight,
  onExtrudeHeightChange,
  countryColor,
  onCountryColorChange,
  countriesList = [],
  alliances = [],
  onAlliancesChange,
  alliancePreset,
  onSelectAlliancePreset,
  activeAllianceId,
  onSelectActiveAllianceId,
  activeStory,
  onSelectStory,
  cameraMode,
  onCameraModeChange,
  globeStyle,
  onGlobeStyleChange
}) {
  const [activeTab, setActiveTab] = useState(
    appMode === 'alliances' ? 'coalitions' : appMode === 'expeditions' ? 'routes' : 'focus'
  );
  const [countryFilter, setCountryFilter] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  // Synchronize tab with appMode when appMode changes from outside
  React.useEffect(() => {
    if (appMode === 'alliances') setActiveTab('coalitions');
    else if (appMode === 'expeditions') setActiveTab('routes');
    else if (appMode === 'geopolitical') setActiveTab('focus');
  }, [appMode]);

  return (
    <>
      {/* Collapsed Studio Controls Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-white transition shadow-lg text-xs font-mono"
          title="Open Studio Controls"
        >
          <Layers size={14} className="text-amber-400" />
          <span className="font-sans font-medium text-xs">Studio Controls</span>
          <ChevronRight size={13} className="text-slate-400" />
        </button>
      )}

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Main Responsive Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 sm:w-88 max-w-[85vw] bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Layers size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans tracking-tight">Studio Inspector</h2>
              <p className="text-[10px] font-mono text-amber-400 uppercase">Interactive Director</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title="Close Panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Clean 4-Tab Navigation */}
        <div className="flex border-b border-slate-800/80 px-2 pt-1 gap-1 text-xs font-sans">
          <button
            onClick={() => {
              setActiveTab('focus');
              if (onAppModeChange) onAppModeChange('geopolitical');
            }}
            className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 text-xs font-medium ${
              activeTab === 'focus'
                ? 'border-b-2 border-amber-400 text-amber-300 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            <span>🏛️ Focus</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('coalitions');
              if (onAppModeChange) onAppModeChange('alliances');
            }}
            className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 text-xs font-medium ${
              activeTab === 'coalitions'
                ? 'border-b-2 border-rose-400 text-rose-300 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            <span>🛡️ Teams</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('routes');
              if (onAppModeChange) onAppModeChange('expeditions');
            }}
            className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 text-xs font-medium ${
              activeTab === 'routes'
                ? 'border-b-2 border-cyan-400 text-cyan-300 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            <span>✈️ Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 text-xs font-medium ${
              activeTab === 'style'
                ? 'border-b-2 border-purple-400 text-purple-300 font-semibold bg-slate-900/40'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            <span>🎨 Style</span>
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

          {/* TAB 1: 3D PERSPECTIVE FOCUS */}
          {activeTab === 'focus' && (
            <div className="space-y-4 animate-fade-in">
              {/* Current Featured Country Card */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Plateau</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/40">
                    3D EXTRUDED
                  </span>
                </div>
                <div className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400" />
                  <span>{selectedCountry}</span>
                </div>
              </div>

              {/* Quick Preset Hotspots */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Quick Documentary Hotspots
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {POPULAR_COUNTRIES.map((p) => {
                    const isSelected = selectedCountry.toLowerCase() === p.name.toLowerCase();
                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          onSelectCountry(p.name);
                          onCountryColorChange(p.color);
                        }}
                        className={`p-2 rounded-lg text-left transition flex items-center gap-2 text-xs border ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500/80 text-white font-bold shadow-sm'
                            : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-sm">{p.flag}</span>
                        <span className="truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search filter for all 177 countries */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Search All 177 Territories
                </label>
                <input
                  type="text"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  placeholder="Filter country list..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-2 font-mono"
                />
                <div className="max-h-36 overflow-y-auto custom-scrollbar border border-slate-800 rounded-lg divide-y divide-slate-800/50 bg-slate-900/30">
                  {(countriesList.length > 0 ? countriesList : ['Iran', 'Ukraine', 'China', 'United States'])
                    .filter((c) => c.toLowerCase().includes(countryFilter.toLowerCase()))
                    .map((c) => (
                      <button
                        key={c}
                        onClick={() => onSelectCountry(c)}
                        className={`w-full px-2.5 py-1.5 text-left text-xs transition flex items-center justify-between ${
                          selectedCountry === c ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{c}</span>
                        {selectedCountry === c && <Check size={12} className="text-amber-400" />}
                      </button>
                    ))}
                </div>
              </div>

              {/* Extrusion Height Slider */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders size={13} className="text-amber-400" />
                    <span>3D Height:</span>
                  </span>
                  <span className="text-amber-400 font-bold">{Math.round(extrudeHeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.55"
                  step="0.02"
                  value={extrudeHeight}
                  onChange={(e) => onExtrudeHeightChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Color Swatches */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <label className="block text-xs font-mono text-slate-300">Plateau Color:</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => onCountryColorChange(col)}
                      className={`w-7 h-7 rounded-lg transition-transform ${
                        countryColor === col
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-md'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COALITIONS & ALLIANCES */}
          {activeTab === 'coalitions' && (
            <div className="space-y-4 animate-fade-in">
              {/* Presets List */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Alliance Presets
                </label>
                <div className="space-y-1.5">
                  {ALLIANCE_PRESETS.map((preset) => {
                    const isSelected = alliancePreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (onSelectAlliancePreset) onSelectAlliancePreset(preset);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/40 shadow-sm'
                            : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-sans">{preset.name}</span>
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800/40">
                            {preset.alliances.length} TEAMS
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Paintbrush Indicator */}
              {(() => {
                const activeTeam = alliances.find((a) => a.id === activeAllianceId);
                if (!activeTeam) return null;
                return (
                  <div
                    className="p-3 rounded-xl border flex items-center justify-between shadow-md"
                    style={{
                      backgroundColor: `${activeTeam.color}15`,
                      borderColor: `${activeTeam.color}60`
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-md animate-pulse"
                        style={{ backgroundColor: activeTeam.color }}
                      />
                      <div>
                        <div className="text-[9px] font-mono text-slate-400 uppercase">Paintbrush Active:</div>
                        <div className="text-xs font-bold text-white font-sans">{activeTeam.name}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white border border-white/20">
                      {activeTeam.countries.length}
                    </span>
                  </div>
                );
              })()}

              {/* Quick Add Country to Active Coalition */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMemberName.trim() || !activeAllianceId) return;
                  const match =
                    countriesList.find((c) => c.toLowerCase() === newMemberName.trim().toLowerCase()) ||
                    newMemberName.trim();

                  if (onAlliancesChange) {
                    onAlliancesChange((prev) =>
                      prev.map((a) => {
                        if (a.id === activeAllianceId && !a.countries.includes(match)) {
                          return { ...a, countries: [...a.countries, match] };
                        }
                        return a;
                      })
                    );
                  }
                  setNewMemberName('');
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Type country to add (e.g. Turkey)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30 transition"
                >
                  + Add
                </button>
              </form>

              {/* Teams & Member Chips */}
              <div className="space-y-2.5">
                {alliances.map((alliance) => {
                  const isActive = activeAllianceId === alliance.id;
                  return (
                    <div
                      key={alliance.id}
                      className={`p-2.5 rounded-xl border transition ${
                        isActive
                          ? 'bg-slate-900/90 border-slate-700 shadow-md ring-1 ring-white/20'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/50'
                      }`}
                    >
                      <div
                        onClick={() => onSelectActiveAllianceId && onSelectActiveAllianceId(alliance.id)}
                        className="flex items-center justify-between cursor-pointer mb-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: alliance.color }} />
                          <span className="text-xs font-bold text-white font-sans">{alliance.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{alliance.countries.length} countries</span>
                      </div>

                      {/* Member Chips */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {alliance.countries.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onAlliancesChange) {
                                  onAlliancesChange((prev) =>
                                    prev.map((a) =>
                                      a.id === alliance.id ? { ...a, countries: a.countries.filter((x) => x !== c) } : a
                                    )
                                  );
                                }
                              }}
                              className="text-slate-500 hover:text-red-400"
                              title={`Remove ${c}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TRAVEL ROUTES */}
          {activeTab === 'routes' && (
            <div className="space-y-4 animate-fade-in">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Documentary Expeditions
              </label>
              <div className="space-y-2">
                {SAMPLE_STORIES.map((story) => {
                  const isSelected = activeStory?.id === story.id;
                  return (
                    <button
                      key={story.id}
                      onClick={() => onSelectStory(story)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/40 text-white shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-sans">{story.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{story.routes.length} LEGS</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{story.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GLOBE STYLE & CAMERA */}
          {activeTab === 'style' && (
            <div className="space-y-4 animate-fade-in">
              {/* Globe Texture */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Planetary Texture
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'satellite', label: 'NASA Day', icon: '☀️' },
                    { id: 'night', label: 'City Lights', icon: '🌃' },
                    { id: 'topo', label: 'Relief Map', icon: '🏔️' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onGlobeStyleChange(style.id)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 text-xs ${
                        globeStyle === style.id
                          ? 'bg-purple-950/40 border-purple-500/80 text-white font-bold'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-[11px] font-mono">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Choreography */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Camera Choreography
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'horizon', label: 'Low-Horizon Cinematic', desc: 'Dramatic angle looking across planetary curvature' },
                    { id: 'follow', label: 'Follow Leading Edge', desc: 'Camera dynamically tracks flight beacon' },
                    { id: 'topdown', label: 'Top-Down Tactical', desc: 'Bird-eye overview for strategic territory map' }
                  ].map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => onCameraModeChange(cam.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition ${
                        cameraMode === cam.id
                          ? 'bg-purple-950/40 border-purple-500/80 text-white font-bold ring-1 ring-purple-500/40'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-sans font-bold text-slate-200">{cam.label}</div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{cam.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
