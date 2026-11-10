'use client';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function SearchBar({ value = '', onChange, placeholder = 'Search company, internship or website...', debounceMs = 300, className = '' }) {
  const [internal, setInternal] = useState(value);
  const timer = useRef(null);

  useEffect(() => { setInternal(value); }, [value]);

  const handleChange = (e) => {
    const next = e.target.value;
    setInternal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange?.(next), debounceMs);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">Search</span>
      <Search className="absolute left-4 top-3 text-muted" size={20} />
      <input
        className="input pl-11"
        type="search"
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}
