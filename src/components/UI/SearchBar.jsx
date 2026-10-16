import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Compass, Flame, CornerDownLeft } from 'lucide-react';

const TRENDING_COUNTRIES = [
  { name: 'Iran', flag: '🇮🇷', tag: 'Middle East' },
  { name: 'Ukraine', flag: '🇺🇦', tag: 'Eastern Europe' },
  { name: 'Taiwan', flag: '🇹🇼', tag: 'East Asia' },
  { name: 'United States of America', flag: '🇺🇸', tag: 'North America' },
  { name: 'China', flag: '🇨🇳', tag: 'East Asia' },
  { name: 'Israel', flag: '🇮🇱', tag: 'Middle East' },
  { name: 'Russia', flag: '🇷🇺', tag: 'Eurasia' }
];

export default function SearchBar({ countriesList = [], onSelectCountry, selectedCountry }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? countriesList.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  // Global Keyboard Shortcut: Ctrl+K or / opens search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          setIsOpen(true);
          inputRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (countryName) => {
    onSelectCountry(countryName);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Keyboard Navigation inside search list
  const handleInputKeyDown = (e) => {
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
    <div
      ref={containerRef}
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${
        isOpen ? 'w-[440px] max-w-[94vw]' : 'w-84 max-w-[90vw]'
      }`}
    >
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-slate-950/85 backdrop-blur-2xl border border-slate-700/80 hover:border-amber-500/60 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all">
        <Search size={16} className="ml-3.5 text-amber-400 flex-shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={`Find country... (Current: ${selectedCountry || 'Iran'})`}
          className="w-full bg-transparent px-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-1 mr-2 text-slate-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-1 mr-3 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700/80 rounded shadow-sm">
              Ctrl+K
            </kbd>
          </div>
        )}
      </div>

      {/* Expanded Spotlight Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-3xl border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-40 animate-fade-in divide-y divide-slate-800/60">
          
          {/* Quick Trending Documentary Hotspots (When not searching or few results) */}
          {!query && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400/90 mb-2 font-semibold">
                <Flame size={12} className="text-amber-400" />
                <span>Trending Documentary Hotspots</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_COUNTRIES.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelect(item.name)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-white transition group shadow-sm"
                  >
                    <span className="text-sm">{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Autocomplete Search Results List */}
          {query && filtered.length > 0 && (
            <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Matching Territories ({filtered.length})
              </div>
              {filtered.map((name, idx) => {
                const isHighlighted = idx === selectedIndex;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelect(name)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all ${
                      isHighlighted
                        ? 'bg-amber-500/15 text-white border border-amber-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isHighlighted ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Compass size={13} />
                      </div>
                      <span className="font-semibold text-slate-100">{name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400/90">
                      <span>Fly & 3D Extrude</span>
                      <CornerDownLeft size={12} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {query && filtered.length === 0 && (
            <div className="p-6 text-center text-xs font-mono text-slate-400">
              No country found matching "<span className="text-amber-400">{query}</span>"
            </div>
          )}

          {/* Footer Hints */}
          <div className="px-3.5 py-2 bg-slate-900/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>↑↓ Navigate</span>
            <span>↵ Select & Fly</span>
            <span>Esc Close</span>
          </div>
        </div>
      )}
    </div>
  );
}
