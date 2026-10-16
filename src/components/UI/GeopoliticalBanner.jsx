import React from 'react';

export default function GeopoliticalBanner({ countryName = 'Iran' }) {
  return (
    <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center select-none text-center animate-fade-in">
      {/* Top golden accent line with subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/80" />
        <span className="font-serif tracking-widest text-xs md:text-sm text-amber-300/90 font-medium uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Geopolitical Map:
        </span>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
      </div>

      {/* Main Large Title */}
      <h1 className="font-serif text-2xl md:text-4xl font-bold tracking-tight text-amber-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] mt-0.5">
        <span className="bg-gradient-to-b from-amber-50 via-amber-200 to-amber-400 bg-clip-text text-transparent">
          {countryName}
        </span>
        <span className="text-amber-100/95 font-serif font-semibold ml-2">in 3D Perspective</span>
      </h1>
    </div>
  );
}
