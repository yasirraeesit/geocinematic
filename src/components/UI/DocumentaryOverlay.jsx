import React from 'react';
import { Compass, Film, Globe2, MapPin } from 'lucide-react';
import { getCityById } from '../../data/cities';

// Haversine formula to calculate real spherical distance in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function DocumentaryOverlay({
  activeStory,
  progress,
  letterbox,
  onToggleLetterbox
}) {
  const routes = activeStory?.routes || [];
  const totalRoutes = routes.length;

  // Identify current active route leg
  const currentIndex = Math.min(totalRoutes - 1, Math.floor(progress * totalRoutes));
  const currentRoute = routes[currentIndex];

  const fromCity = currentRoute ? getCityById(currentRoute.from) : null;
  const toCity = currentRoute ? getCityById(currentRoute.to) : null;

  const currentDistanceKm =
    fromCity && toCity
      ? calculateDistance(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon)
      : 0;

  return (
    <>
      {/* Cinematic Anamorphic Letterbox Bars (2.39:1 ratio) */}
      {letterbox && (
        <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between">
          <div className="w-full h-14 bg-black/95 border-b border-white/5" />
          <div className="w-full h-14 bg-black/95 border-t border-white/5" />
        </div>
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,7,18,0.7)_100%)]" />

      {/* Top Header Information HUD */}
      <div className="pointer-events-none fixed top-6 left-6 z-20 flex items-center gap-4">
        <div className="flex items-center gap-3 backdrop-blur-md bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-xl shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="text-[10px] tracking-widest font-mono text-cyan-400 uppercase font-semibold">
              DOCUMENTARY ENGINE
            </div>
            <div className="text-sm font-bold text-white tracking-wide font-sans flex items-center gap-1.5">
              <span>GeoCinematic</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                4K MAP
              </span>
            </div>
          </div>
        </div>

        {/* Letterbox toggle button (interactive) */}
        <button
          onClick={onToggleLetterbox}
          className="pointer-events-auto flex items-center gap-2 backdrop-blur-md bg-slate-950/70 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition shadow-lg"
          title="Toggle 2.39:1 Cinema Letterbox"
        >
          <Film size={14} className={letterbox ? 'text-amber-400' : 'text-slate-400'} />
          <span>{letterbox ? 'Letterbox ON' : 'Letterbox OFF'}</span>
        </button>
      </div>

      {/* Top Right Live Telemetry HUD */}
      {currentRoute && fromCity && toCity && (
        <div className="pointer-events-none fixed top-6 right-6 z-20 flex flex-col items-end gap-2">
          <div className="backdrop-blur-md bg-slate-950/75 border border-slate-800/80 px-4 py-2.5 rounded-xl shadow-xl font-mono text-right">
            <div className="text-[10px] text-slate-400 tracking-wider">EXPEDITION TELEMETRY</div>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">
              {currentDistanceKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">KM</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {Math.round(currentDistanceKm * 0.539957).toLocaleString()} NM (Nautical)
            </div>
          </div>
        </div>
      )}

      {/* Lower-Third Documentary Title Card (Broadcast Quality) */}
      {currentRoute && fromCity && toCity && (
        <div className="pointer-events-none fixed bottom-28 left-8 z-20 max-w-lg transition-all duration-500">
          <div className="backdrop-blur-xl bg-slate-950/85 border-l-4 border-cyan-400 border-y border-r border-slate-800/80 p-5 rounded-r-2xl shadow-2xl">
            {/* Era Badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] tracking-widest font-mono uppercase bg-cyan-950/80 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
                {activeStory?.era || 'DOCUMENTARY EXPEDITION'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                LEG {currentIndex + 1} OF {totalRoutes}
              </span>
            </div>

            {/* Main Destination Banner */}
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{fromCity.name}</span>
              <span className="text-cyan-400 font-normal">→</span>
              <span className="text-amber-400">{toCity.name}</span>
            </h2>

            {/* Route description / historical context */}
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {currentRoute.label || `${fromCity.country} to ${toCity.country} intercontinental artery`}
            </p>

            {/* Geographical details */}
            <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{fromCity.flag}</span>
                <span>
                  {Math.abs(fromCity.lat).toFixed(1)}°{fromCity.lat >= 0 ? 'N' : 'S'},{' '}
                  {Math.abs(fromCity.lon).toFixed(1)}°{fromCity.lon >= 0 ? 'E' : 'W'}
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{toCity.flag}</span>
                <span>
                  {Math.abs(toCity.lat).toFixed(1)}°{toCity.lat >= 0 ? 'N' : 'S'},{' '}
                  {Math.abs(toCity.lon).toFixed(1)}°{toCity.lon >= 0 ? 'E' : 'W'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
