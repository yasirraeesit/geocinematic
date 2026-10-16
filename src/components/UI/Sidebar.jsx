import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  Video,
  Sparkles,
  Camera,
  Play,
  Shield,
  X
} from 'lucide-react';
import { WORLD_CITIES } from '../../data/cities';
import { SAMPLE_STORIES } from '../../data/sampleRoutes';
import { ALLIANCE_PRESETS } from '../../data/alliancePresets';

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
  customRoutes,
  onAddCustomRoute,
  onDeleteCustomRoute,
  cameraMode,
  onCameraModeChange,
  globeStyle,
  onGlobeStyleChange
}) {
  const [activeTab, setActiveTab] = useState('geopolitical'); // 'geopolitical' | 'alliances' | 'stories' | 'builder' | 'camera'
  const [countryFilter, setCountryFilter] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  // Custom route form state
  const [fromCityId, setFromCityId] = useState('london');
  const [toCityId, setToCityId] = useState('newyork');
  const [routeColor, setRouteColor] = useState('#06b6d4');
  const [arcHeight, setArcHeight] = useState(0.28);
  const [routeLabel, setRouteLabel] = useState('');

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (fromCityId === toCityId) {
      alert('Please select two different cities for a route.');
      return;
    }

    const newRoute = {
      id: `custom-${Date.now()}`,
      name: `${fromCityId} to ${toCityId}`,
      from: fromCityId,
      to: toCityId,
      color: routeColor,
      arcHeight: parseFloat(arcHeight),
      label: routeLabel.trim() || 'Custom Documentary Corridor'
    };

    onAddCustomRoute(newRoute);
    setRouteLabel('');
  };

  return (
    <>
      {/* Sidebar Toggle Tab Button when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-6 top-20 z-30 flex items-center gap-2 backdrop-blur-md bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl shadow-2xl transition"
          title="Open Studio Panel"
        >
          <Layers size={15} className="text-amber-400" />
          <span className="text-xs font-mono font-medium">STUDIO CONTROLS</span>
          <ChevronRight size={13} />
        </button>
      )}

      {/* Main Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-30 w-96 overflow-hidden backdrop-blur-2xl bg-slate-950/95 border-r border-slate-800/90 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Navigation size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight font-serif">GeoCinematic</h1>
              <p className="text-[11px] font-mono text-amber-400">3D DOCUMENTARY MAPS</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 px-4 pt-2 gap-2 text-xs font-medium font-mono overflow-x-auto custom-scrollbar flex-nowrap">
          <button
            onClick={() => {
              setActiveTab('geopolitical');
              if (onAppModeChange) onAppModeChange('geopolitical');
            }}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'geopolitical'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏛️ 3D Perspective</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('alliances');
              if (onAppModeChange) onAppModeChange('alliances');
            }}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'alliances'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={14} />
            <span>Alliances</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('stories');
              if (onAppModeChange) onAppModeChange('expeditions');
            }}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'stories'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>Stories</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus size={14} />
            <span>Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera size={14} />
            <span>Camera</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* TAB 0: GEOPOLITICAL 3D PERSPECTIVE (MATCHING USER IMAGE) */}
          {activeTab === 'geopolitical' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Geopolitical 3D Perspective Map
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  DOCUMENTARY STYLE
                </span>
              </div>

              {/* Select Country */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-amber-400" />
                    <span>Featured Country Plateau:</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{selectedCountry}</span>
                </label>

                {/* Search filter for countries */}
                <input
                  type="text"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  placeholder="Filter 177 countries..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 mb-2 focus:outline-none focus:border-amber-400"
                />

                <select
                  value={selectedCountry}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-serif text-sm custom-scrollbar"
                  size={5}
                >
                  {(countriesList.length > 0
                    ? countriesList.filter((c) => c.toLowerCase().includes(countryFilter.toLowerCase()))
                    : ['Iran', 'United States', 'China', 'Russia', 'Ukraine', 'India', 'Saudi Arabia']
                  ).map((c) => (
                    <option key={c} value={c} className="py-1 px-2 hover:bg-slate-800 cursor-pointer">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Geopolitical Presets */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Popular Geopolitical Scenes:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'Iran', label: '🇮🇷 Iran (Attached)', color: '#dc2626' },
                    { name: 'Ukraine', label: '🇺🇦 Ukraine Corridor', color: '#2563eb' },
                    { name: 'China', label: '🇨🇳 China / Taiwan', color: '#dc2626' },
                    { name: 'Saudi Arabia', label: '🇸🇦 Arabian Peninsula', color: '#059669' },
                    { name: 'United States', label: '🇺🇸 North America', color: '#b91c1c' },
                    { name: 'India', label: '🇮🇳 South Asia', color: '#ea580c' }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        onSelectCountry(p.name);
                        onCountryColorChange(p.color);
                      }}
                      className={`p-2 rounded-lg border text-left transition ${
                        selectedCountry.toLowerCase() === p.name.toLowerCase()
                          ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-[11px] truncate">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Extrusion Height */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>3D Plateau Extrusion Height:</span>
                  <span className="text-amber-400">{Math.round(extrudeHeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.6"
                  step="0.02"
                  value={extrudeHeight}
                  onChange={(e) => onExtrudeHeightChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Plateau Color */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Extrusion Fill Color:
                </label>
                <div className="flex items-center gap-2">
                  {['#dc2626', '#b91c1c', '#059669', '#2563eb', '#d97706', '#7c3aed'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => onCountryColorChange(col)}
                      className={`w-7 h-7 rounded-lg transition-transform ${
                        countryColor === col
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-slate-300 space-y-1.5 font-sans leading-relaxed">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <span>✨ 3D PERSPECTIVE FEATURES</span>
                </div>
                <p>
                  • <strong>3D Raised Plateau</strong> with extruded vertical walls.
                </p>
                <p>
                  • <strong>Neighboring Country Labels</strong> floating over territory with national flags.
                </p>
                <p>
                  • <strong>Cinematic Horizon Tilt</strong> framing the country against the planetary curve.
                </p>
              </div>
            </div>
          )}

          {/* TAB: ALLIANCES & COALITIONS BUILDER */}
          {activeTab === 'alliances' && (
            <div className="space-y-6">
              {/* Presets List */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Alliance Presets
                </label>
                <div className="space-y-2">
                  {ALLIANCE_PRESETS.map((preset) => {
                    const isSelected = alliancePreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (onSelectAlliancePreset) onSelectAlliancePreset(preset);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-rose-500/80 ring-1 ring-rose-500/50 shadow-lg'
                            : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white font-sans">
                            {preset.name}
                          </span>
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                            {preset.alliances.length} TEAMS
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Coalition Selector & Member Inspector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Painting Brush & Coalitions
                  </label>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                    CLICK GLOBE TO DRAFT
                  </span>
                </div>

                {/* Active Paintbrush Banner */}
                {(() => {
                  const activeTeam = alliances.find((a) => a.id === activeAllianceId);
                  if (!activeTeam) return null;
                  return (
                    <div
                      className="p-3 mb-3 rounded-xl border flex items-center justify-between shadow-lg"
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
                          <div className="text-[10px] font-mono text-slate-400 uppercase">Current Brush:</div>
                          <div className="text-xs font-bold text-white font-sans">{activeTeam.name}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white border border-white/20">
                        {activeTeam.countries.length} countries
                      </span>
                    </div>
                  );
                })()}

                {/* Direct Add Country Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMemberName.trim() || !activeAllianceId) return;
                    const match = countriesList.find(
                      (c) => c.toLowerCase() === newMemberName.trim().toLowerCase()
                    ) || newMemberName.trim();

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
                  className="flex items-center gap-2 mb-3"
                >
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Add country by name (e.g. Turkey)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30 transition shadow-sm"
                  >
                    + Add
                  </button>
                </form>

                <div className="space-y-3">
                  {alliances.map((alliance) => {
                    const isActive = activeAllianceId === alliance.id;
                    return (
                      <div
                        key={alliance.id}
                        className={`p-3 rounded-xl border transition ${
                          isActive
                            ? 'bg-slate-900/90 border-slate-700 shadow-md ring-1 ring-white/20'
                            : 'bg-slate-950/60 border-slate-800/70 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            onClick={() => onSelectActiveAllianceId && onSelectActiveAllianceId(alliance.id)}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-md"
                              style={{ backgroundColor: alliance.color }}
                            />
                            <span className="text-xs font-bold text-white font-sans">
                              {alliance.name}
                            </span>
                          </div>

                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full text-slate-200"
                            style={{ backgroundColor: `${alliance.color}35` }}
                          >
                            {alliance.countries.length} members
                          </span>
                        </div>

                        {/* Country Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {alliance.countries.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300"
                            >
                              <span>{c}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onAlliancesChange) {
                                    onAlliancesChange((prev) =>
                                      prev.map((a) =>
                                        a.id === alliance.id
                                          ? { ...a, countries: a.countries.filter((x) => x !== c) }
                                          : a
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

              {/* Height Slider */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Extrusion Height:</span>
                  <span className="text-rose-400">{Math.round(extrudeHeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.6"
                  step="0.02"
                  value={extrudeHeight}
                  onChange={(e) => onExtrudeHeightChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>
            </div>
          )}

          {/* TAB 1: PRESET DOCUMENTARY STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Pre-configured Expeditions
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {SAMPLE_STORIES.length} PRESETS
                </span>
              </div>

              <div className="space-y-3">
                {SAMPLE_STORIES.map((story) => {
                  const isSelected = activeStory?.id === story.id;
                  return (
                    <div
                      key={story.id}
                      onClick={() => onSelectStory(story)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: story.color }}
                        />
                        <span className="text-[10px] font-mono text-slate-400">
                          {story.era}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">{story.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {story.subtitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
                        <span>{story.routes.length} Flight Arcs</span>
                        <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                          Load Story →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM ROUTE BUILDER */}
          {activeTab === 'builder' && (
            <div className="space-y-5">
              <form onSubmit={handleAddRoute} className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Create Animated Route
                </div>

                {/* Origin City */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-emerald-400" />
                    <span>Origin Departure:</span>
                  </label>
                  <select
                    value={fromCityId}
                    onChange={(e) => setFromCityId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {WORLD_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}, {c.country} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination City */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-rose-400" />
                    <span>Target Destination:</span>
                  </label>
                  <select
                    value={toCityId}
                    onChange={(e) => setToCityId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {WORLD_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}, {c.country} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Route Color */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Trail Color Theme:
                  </label>
                  <div className="flex items-center gap-2">
                    {['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#a855f7', '#ffffff'].map(
                      (col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setRouteColor(col)}
                          className={`w-7 h-7 rounded-lg transition-transform ${
                            routeColor === col
                              ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Arc Trajectory Height */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Arc Altitude:</span>
                    <span className="text-cyan-400">{Math.round(arcHeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.6"
                    step="0.02"
                    value={arcHeight}
                    onChange={(e) => setArcHeight(e.target.value)}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Label / Context */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Documentary Callout / Description:
                  </label>
                  <input
                    type="text"
                    value={routeLabel}
                    onChange={(e) => setRouteLabel(e.target.value)}
                    placeholder="e.g. Major Transatlantic Trade Passage"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition active:scale-98 shadow-lg shadow-cyan-500/20"
                >
                  <Plus size={15} />
                  <span>ADD ROUTE TO EXPEDITION</span>
                </button>
              </form>

              {/* Active Route Legs List */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Current Route Legs ({activeStory?.routes?.length || 0})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {activeStory?.routes?.map((route, i) => (
                    <div
                      key={route.id || i}
                      className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: route.color || '#38bdf8' }}
                        />
                        <div className="truncate">
                          <div className="font-semibold text-slate-200 truncate">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate font-mono">
                            {route.label || 'Standard trajectory'}
                          </div>
                        </div>
                      </div>

                      {onDeleteCustomRoute && (
                        <button
                          onClick={() => onDeleteCustomRoute(route.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition ml-2"
                          title="Remove Leg"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAMERA CHOREOGRAPHY & MAP REALISM */}
          {activeTab === 'camera' && (
            <div className="space-y-6">
              {/* Photorealistic Basemap Selector */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                  Earth Basemap & Realism
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'satellite',
                      title: 'NASA Blue Marble (Satellite)',
                      desc: 'Photorealistic daylight satellite photography with ocean reflections & clouds.'
                    },
                    {
                      id: 'night',
                      title: 'NASA Black Marble (Night Lights)',
                      desc: 'Glowing golden metropolis clusters across continents on the night hemisphere.'
                    },
                    {
                      id: 'topo',
                      title: 'Topographic Relief Elevation',
                      desc: 'Crisp 3D mountain chains (Himalayas, Andes, Alps) with elevation bump contours.'
                    }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onGlobeStyleChange(style.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        globeStyle === style.id
                          ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-0.5">{style.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Choreography */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                  Camera Choreography & Angles
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'free',
                      title: 'Free Orbit (Manual)',
                      desc: 'Drag to rotate, scroll to zoom anywhere freely.'
                    },
                    {
                      id: 'follow',
                      title: 'Follow Leading Edge / Arrow',
                      desc: 'Cinematic tracking that follows the route tip in flight.'
                    },
                    {
                      id: 'horizon',
                      title: 'Dramatic Low-Horizon Angle',
                      desc: 'Cinematic perspective gazing across the curvature of the planet.'
                    },
                    {
                      id: 'topdown',
                      title: 'Tactical Orbital Top-Down',
                      desc: 'Orthographic global view perfect for world war / trade overviews.'
                    }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => onCameraModeChange(mode.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        cameraMode === mode.id
                          ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-0.5">{mode.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
                <div className="font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Compass size={14} />
                  <span>DIRECTOR SHORTCUTS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-white font-bold">[Space]</span> Play / Pause
                  </div>
                  <div>
                    <span className="text-white font-bold">[H]</span> Clean Screen
                  </div>
                  <div>
                    <span className="text-white font-bold">[Drag]</span> Pan Orbit
                  </div>
                  <div>
                    <span className="text-white font-bold">[Wheel]</span> Altitude Zoom
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
