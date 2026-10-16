import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';

export default function SearchBar({ countriesList = [], onSelectCountry, selectedCountry }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filtered = query.trim()
    ? countriesList.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

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
  };

  return (
    <div ref={containerRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-80 max-w-[90vw]">
      <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl border border-slate-700/80 hover:border-amber-500/60 focus-within:border-amber-400 rounded-2xl shadow-2xl transition">
        <Search size={15} className="ml-3.5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search country... (Current: ${selectedCountry || 'Iran'})`}
          className="w-full bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-1 mr-2 text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Auto-suggest dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-950/95 backdrop-blur-2xl border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden py-1 z-40 max-h-60 overflow-y-auto custom-scrollbar">
          {filtered.map((name) => (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              className="w-full px-3.5 py-2 text-left text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <MapPin size={12} className="text-amber-400" />
                <span>{name}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-sans">Fly to →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
