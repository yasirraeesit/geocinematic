import React, { useState, useEffect, useRef } from 'react';
import GlobeCanvas from './components/Globe/GlobeCanvas';
import Sidebar from './components/UI/Sidebar';
import TimelineController from './components/UI/TimelineController';
import DocumentaryOverlay from './components/UI/DocumentaryOverlay';
import RecordingStudio from './components/UI/RecordingStudio';
import GeopoliticalBanner from './components/UI/GeopoliticalBanner';
import GeopoliticalLabels from './components/UI/GeopoliticalLabels';
import AllianceScorecard from './components/UI/AllianceScorecard';
import SearchBar from './components/UI/SearchBar';
import HoverTooltip from './components/UI/HoverTooltip';
import { SAMPLE_STORIES } from './data/sampleRoutes';
import { ALLIANCE_PRESETS } from './data/alliancePresets';

export default function App() {
  const [appMode, setAppMode] = useState('geopolitical'); // 'geopolitical' | 'alliances' | 'expeditions'
  const [selectedCountry, setSelectedCountry] = useState('Iran');
  const [extrudeHeight, setExtrudeHeight] = useState(0.28);
  const [countryColor, setCountryColor] = useState('#dc2626');
  const [countriesList, setCountriesList] = useState([]);
  const [labels, setLabels] = useState([]);
  const [hoverData, setHoverData] = useState(null);

  // Alliance State
  const [alliancePreset, setAlliancePreset] = useState(ALLIANCE_PRESETS[0]);
  const [alliances, setAlliances] = useState(ALLIANCE_PRESETS[0].alliances);
  const [activeAllianceId, setActiveAllianceId] = useState(ALLIANCE_PRESETS[0].alliances[0].id);

  const [activeStory, setActiveStory] = useState(SAMPLE_STORIES[0]);
  const [progress, setProgress] = useState(0.05);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [cameraMode, setCameraMode] = useState('follow');
  const [globeStyle, setGlobeStyle] = useState('satellite'); // 'satellite' | 'night' | 'topo'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cleanMode, setCleanMode] = useState(false);
  const [letterbox, setLetterbox] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('full');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'h' || e.key === 'H') {
        setCleanMode((cm) => !cm);
      } else if (e.key === 'Escape') {
        setCleanMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animation Progress Loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let frameId;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const duration = activeStory?.duration || 15;
      const increment = (dt / duration) * speed;

      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 1) {
          if (isLooping) {
            return 0;
          } else {
            setIsPlaying(false);
            return 1;
          }
        }
        return next;
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed, activeStory, isLooping]);

  // Story selection
  const handleSelectStory = (story) => {
    setActiveStory(story);
    setProgress(0);
    setIsPlaying(true);
  };

  // Add custom route
  const handleAddCustomRoute = (newRoute) => {
    setActiveStory((prev) => ({
      ...prev,
      routes: [...prev.routes, newRoute]
    }));
  };

  // Delete custom route
  const handleDeleteCustomRoute = (routeId) => {
    setActiveStory((prev) => ({
      ...prev,
      routes: prev.routes.filter((r) => r.id !== routeId)
    }));
  };

  // Toggle or assign country to active alliance
  const handleCountryAllianceClick = (countryName) => {
    setAlliances((prev) =>
      prev.map((alliance) => {
        const isActive = alliance.id === activeAllianceId;
        const exists = alliance.countries.includes(countryName);

        if (isActive) {
          return {
            ...alliance,
            countries: exists
              ? alliance.countries.filter((c) => c !== countryName)
              : [...alliance.countries, countryName]
          };
        } else {
          return {
            ...alliance,
            countries: alliance.countries.filter((c) => c !== countryName)
          };
        }
      })
    );
  };

  const handleSelectAlliancePreset = (preset) => {
    setAlliancePreset(preset);
    setAlliances(preset.alliances);
    setActiveAllianceId(preset.alliances[0]?.id || '');
    setAppMode('alliances');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
      {/* Aspect Ratio Container for Video Producers */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
          aspectRatio === '16:9'
            ? 'max-w-[177.78vh] max-h-[56.25vw] shadow-2xl ring-1 ring-cyan-500/20'
            : aspectRatio === '9:16'
            ? 'max-w-[56.25vh] max-h-[177.78vw] shadow-2xl ring-1 ring-cyan-500/20'
            : 'w-full h-full'
        }`}
      >
        {/* Three.js 3D Interactive Globe */}
        <GlobeCanvas
          appMode={appMode}
          selectedCountry={selectedCountry}
          alliances={alliances}
          activeAllianceId={activeAllianceId}
          onCountryAllianceClick={handleCountryAllianceClick}
          extrudeHeight={extrudeHeight}
          countryColor={countryColor}
          onSelectCountry={(countryName) => {
            setSelectedCountry(countryName);
            if (appMode !== 'geopolitical') setAppMode('geopolitical');
          }}
          onHoverCountry={setHoverData}
          onCountriesLoaded={setCountriesList}
          onLabelsUpdate={setLabels}
          activeStory={activeStory}
          progress={progress}
          isPlaying={isPlaying}
          cameraMode={cameraMode}
          globeStyle={globeStyle}
          isRecording={isRecording}
          onRecordingComplete={(url) => {
            setRecordedVideoUrl(url);
            setIsRecording(false);
          }}
        />

        {/* Hover Cursor Tooltip (Click to Focus) */}
        {!cleanMode && (
          <HoverTooltip
            hoverData={hoverData}
            appMode={appMode}
            activeAlliance={alliances.find((a) => a.id === activeAllianceId)}
          />
        )}

        {/* Top Global Search Bar with instant fly-to */}
        {!cleanMode && (
          <SearchBar
            countriesList={countriesList}
            selectedCountry={selectedCountry}
            onSelectCountry={(countryName) => {
              setSelectedCountry(countryName);
              if (appMode !== 'geopolitical') setAppMode('geopolitical');
            }}
          />
        )}

        {/* Geopolitical 3D Perspective Mode Overlays (Single Country Extrusion) */}
        {!cleanMode && appMode === 'geopolitical' && (
          <>
            <GeopoliticalBanner countryName={selectedCountry} />
            <GeopoliticalLabels labels={labels} featuredCountry={selectedCountry} />
          </>
        )}

        {/* Alliances & Coalitions Mode Overlays (Multi-Country Alliances) */}
        {!cleanMode && appMode === 'alliances' && (
          <>
            <AllianceScorecard
              presetName={alliancePreset?.name}
              alliances={alliances}
              activeAllianceId={activeAllianceId}
              onSelectActiveAlliance={setActiveAllianceId}
            />
            <GeopoliticalLabels labels={labels} />
          </>
        )}

        {/* Expeditions Mode Overlays (Routes, Distance, Lower-Third Cards) */}
        {!cleanMode && appMode === 'expeditions' && (
          <DocumentaryOverlay
            activeStory={activeStory}
            progress={progress}
            letterbox={letterbox}
            onToggleLetterbox={() => setLetterbox((l) => !l)}
          />
        )}

        {/* Studio Mode Switcher Floating Dock */}
        {!cleanMode && (
          <div className="fixed bottom-6 left-6 z-30 flex items-center p-1 bg-slate-950/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setAppMode('geopolitical')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-sans font-medium ${
                appMode === 'geopolitical'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span>🏛️</span>
              <span>3D Perspective</span>
            </button>

            <button
              onClick={() => setAppMode('alliances')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-sans font-medium ${
                appMode === 'alliances'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span>🛡️</span>
              <span>Coalitions</span>
            </button>

            <button
              onClick={() => setAppMode('expeditions')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs font-sans font-medium ${
                appMode === 'expeditions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span>✈️</span>
              <span>Routes</span>
            </button>
          </div>
        )}

        {/* Recording Studio & Framing Controls (Top Right) */}
        {!cleanMode && (
          <RecordingStudio
            isRecording={isRecording}
            onToggleRecording={() => setIsRecording((r) => !r)}
            cleanMode={cleanMode}
            onToggleCleanMode={() => setCleanMode(true)}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            recordedVideoUrl={recordedVideoUrl}
          />
        )}

        {/* Floating Exit Button when in Clean Screen Mode */}
        {cleanMode && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
            {isRecording && (
              <div className="flex items-center gap-2 bg-rose-600/90 text-white font-mono px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>REC IN PROGRESS</span>
              </div>
            )}
            <button
              onClick={() => setCleanMode(false)}
              className="backdrop-blur-md bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-mono transition shadow-2xl"
              title="Show Studio Controls (Shortcut: H or Esc)"
            >
              Exit Clean View [H]
            </button>
          </div>
        )}

        {/* Studio Sidebar (Expeditions, Route Builder, Country Extrusions, Camera) */}
        {!cleanMode && (
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((o) => !o)}
            appMode={appMode}
            onAppModeChange={setAppMode}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            extrudeHeight={extrudeHeight}
            onExtrudeHeightChange={setExtrudeHeight}
            countryColor={countryColor}
            onCountryColorChange={setCountryColor}
            countriesList={countriesList}
            alliances={alliances}
            onAlliancesChange={setAlliances}
            alliancePreset={alliancePreset}
            onSelectAlliancePreset={handleSelectAlliancePreset}
            activeAllianceId={activeAllianceId}
            onSelectActiveAllianceId={setActiveAllianceId}
            activeStory={activeStory}
            onSelectStory={handleSelectStory}
            onAddCustomRoute={handleAddCustomRoute}
            onDeleteCustomRoute={handleDeleteCustomRoute}
            cameraMode={cameraMode}
            onCameraModeChange={setCameraMode}
            globeStyle={globeStyle}
            onGlobeStyleChange={setGlobeStyle}
          />
        )}

        {/* Bottom Timeline (Active in Expeditions Mode) */}
        {!cleanMode && appMode === 'expeditions' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-6 max-w-3xl">
            <TimelineController
              progress={progress}
              onProgressChange={(p) => {
                setProgress(p);
                setIsPlaying(false);
              }}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              speed={speed}
              onSpeedChange={setSpeed}
              activeStory={activeStory}
              isLooping={isLooping}
              onToggleLoop={() => setIsLooping((l) => !l)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
