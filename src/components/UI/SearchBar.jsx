import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Compass, Flame, CornerDownLeft, Globe } from 'lucide-react';

const TRENDING_COUNTRIES = [
  { name: 'Iran', flag: '🇮🇷', region: 'Middle East' },
  { name: 'Ukraine', flag: '🇺🇦', region: 'Eastern Europe' },
  { name: 'Taiwan', flag: '🇹🇼', region: 'East Asia' },
  { name: 'United States of America', flag: '🇺🇸', region: 'North America' },
  { name: 'China', flag: '🇨🇳', region: 'East Asia' },
  { name: 'Israel', flag: '🇮🇱', region: 'Middle East' },
  { name: 'Russia', flag: '🇷🇺', region: 'Eurasia' },
  { name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' }
];

export default function SearchBar({ countriesList = [], onSelectCountry, selectedCountry }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? countriesList.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : [];

  // Global Keyboard Shortcut: Ctrl+K or / opens search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !isOpen) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          setIsOpen(true);
        }
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSelect = (countryName) => {
    onSelectCountry(countryName);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0 && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      } else if (query.trim()) {
        const exact = countriesList.find((c) => c.toLowerCase() === query.toLowerCase().trim());
        if (exact) handleSelect(exact);
      }
    }
  };

  return (
    <>
      {/* Minimal Top-Bar Search Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-44 z-30 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-white transition shadow-lg text-xs"
        title="Search Country (Ctrl+K)"
      >
        <Search size={13} className="text-amber-400" />
        <span className="text-slate-400 font-sans text-xs">
          {selectedCountry ? `Viewing: ${selectedCountry}` : 'Search country...'}
        </span>
        <kbd className="text-[10px] font-mono bg-slate-800/90 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-24 sm:hidden z-30 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-amber-400 shadow-lg"
        title="Search Country"
      >
        <Search size={16} />
      </button>

      {/* Centered Spotlight Command Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-slate-950/95 border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Search Input Header */}
            <div className="relative flex items-center px-4 py-3 border-b border-slate-800/80">
              <Search size={18} className="text-amber-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type country name to fly & 3D extrude..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 font-sans focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Trending Hotspot Chips */}
            {!query && (
              <div className="p-4 border-b border-slate-800/60 bg-slate-900/30">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold mb-2.5">
                  <Flame size={12} className="text-amber-400" />
                  <span>Trending Documentary Scenes</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_COUNTRIES.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelect(item.name)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-white transition shadow-sm"
                    >
                      <span className="text-sm">{item.flag}</span>
                      <span className="font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Results List */}
            {query && (
              <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                {filtered.length > 0 ? (
                  filtered.map((name, idx) => {
                    const isHighlighted = idx === selectedIndex;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSelect(name)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                          isHighlighted
                            ? 'bg-amber-500/20 text-white border border-amber-500/50 shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isHighlighted ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <Globe size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-xs">{name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Territory • 3D Plateau</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <span>Focus</span>
                          <CornerDownLeft size={12} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs font-mono text-slate-400">
                    No country found matching "<span className="text-amber-400">{query}</span>"
                  </div>
                )}
              </div>
            )}

            {/* Modal Keyboard Navigation Footer */}
            <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
