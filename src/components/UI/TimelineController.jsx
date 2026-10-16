import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Repeat } from 'lucide-react';

export default function TimelineController({
  progress,
  onProgressChange,
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange,
  activeStory,
  isLooping,
  onToggleLoop
}) {
  const routes = activeStory?.routes || [];

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Top scrubber bar */}
      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            TIMELINE PROGRESS
          </span>
          <span className="text-cyan-400 font-bold tracking-wider">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Progress Slider */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => onProgressChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />

          {/* Waypoint notches */}
          {routes.length > 1 &&
            routes.map((_, i) => {
              const posPercent = ((i + 1) / routes.length) * 100;
              if (posPercent >= 100) return null;
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-500/50 pointer-events-none group-hover:bg-cyan-400"
                  style={{ left: `${posPercent}%` }}
                  title={`Leg ${i + 1}`}
                />
              );
            })}
        </div>
      </div>

      {/* Playback Controls Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/25"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          {/* Reset / Rewind */}
          <button
            onClick={() => onProgressChange(0)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition"
            title="Rewind to start"
          >
            <RotateCcw size={16} />
          </button>

          {/* Loop toggle */}
          <button
            onClick={onToggleLoop}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition ${
              isLooping
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Loop Playback"
          >
            <Repeat size={16} />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 rounded-lg transition ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
