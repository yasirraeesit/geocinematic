import React, { useState, useEffect } from 'react';
import { Video, Square, Download, Eye, EyeOff, Maximize, Smartphone, Monitor } from 'lucide-react';

export default function RecordingStudio({
  isRecording,
  onToggleRecording,
  cleanMode,
  onToggleCleanMode,
  aspectRatio, // '16:9' | '9:16' | 'full'
  onAspectRatioChange,
  recordedVideoUrl
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-6 right-6 z-30 flex items-center gap-3">
      {/* Aspect Ratio Framing Guides for Video Creators */}
      <div className="backdrop-blur-md bg-slate-950/80 border border-slate-800 p-1 rounded-xl flex items-center gap-1 shadow-xl">
        <button
          onClick={() => onAspectRatioChange('full')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
            aspectRatio === 'full'
              ? 'bg-slate-800 text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Full Window"
        >
          <Maximize size={13} />
          <span>Full</span>
        </button>

        <button
          onClick={() => onAspectRatioChange('16:9')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
            aspectRatio === '16:9'
              ? 'bg-slate-800 text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="16:9 YouTube / Documentary Standard"
        >
          <Monitor size={13} />
          <span>16:9</span>
        </button>

        <button
          onClick={() => onAspectRatioChange('9:16')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
            aspectRatio === '9:16'
              ? 'bg-slate-800 text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="9:16 Shorts & Reels"
        >
          <Smartphone size={13} />
          <span>9:16</span>
        </button>
      </div>

      {/* Clean Mode / Hide UI Toggle */}
      <button
        onClick={onToggleCleanMode}
        className={`flex items-center gap-2 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-mono transition border shadow-xl ${
          cleanMode
            ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
            : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
        }`}
        title="Toggle Clean Mode (Hide all menus for clean video recording - Shortcut: H)"
      >
        {cleanMode ? <EyeOff size={15} /> : <Eye size={15} />}
        <span>Clean View [H]</span>
      </button>

      {/* Record Canvas Button */}
      <button
        onClick={onToggleRecording}
        className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all shadow-xl ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50'
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-rose-600/30 active:scale-95'
        }`}
      >
        {isRecording ? (
          <>
            <Square size={14} className="fill-current" />
            <span>REC {formatTime(seconds)}</span>
          </>
        ) : (
          <>
            <Video size={15} />
            <span>REC 60FPS</span>
          </>
        )}
      </button>

      {/* Download Video button if recording finished */}
      {recordedVideoUrl && !isRecording && (
        <a
          href={recordedVideoUrl}
          download="geocinematic-documentary-map.webm"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider shadow-xl shadow-emerald-600/30 transition active:scale-95"
          title="Download the captured 60FPS video file"
        >
          <Download size={15} />
          <span>Save Video</span>
        </a>
      )}
    </div>
  );
}
