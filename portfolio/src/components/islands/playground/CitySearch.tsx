import { useState, useRef, useCallback, useEffect } from 'react';
import { searchCities, type CityResult } from '../../../lib/api/geocoding';
import type { Locale } from '../../../types/i18n';
import styles from './CitySearch.module.css';

interface Props {
  onSelect: (city: CityResult) => void;
  placeholder?: string;
  locale?: Locale;
}

export function CitySearch({ onSelect, placeholder = 'search a city…', locale = 'en' }: Props) {
  const [query, setQuery]      = useState('');
  const [results, setResults]  = useState<CityResult[]>([]);
  const [loading, setLoading]  = useState(false);
  const [activeIdx, setActive] = useState(-1);
  const [open, setOpen]        = useState(false);
  const [hint, setHint]        = useState(true);
  const debounceRef            = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setHint(false), 2600);
    return () => clearTimeout(t);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const found = await searchCities(q, locale);
      setResults(found);
      setOpen(found.length > 0);
      setActive(-1);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 250);
  };

  const handleSelect = (city: CityResult) => {
    setOpen(false);
    setQuery(`${city.name}, ${city.countryCode}`);
    onSelect(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(results[activeIdx]); }
    if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className={styles.wrap} role="combobox" aria-expanded={open} aria-haspopup="listbox">
      <input
        type="text"
        className={`${styles.input} ${hint ? styles.hint : ''}`}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setHint(false)}
        aria-label="Search city"
        aria-autocomplete="list"
        aria-controls="city-listbox"
        autoComplete="off"
        spellCheck={false}
      />
      {loading && <span className={styles.spinner} aria-label="Loading" />}
      {open && results.length > 0 && (
        <ul
          id="city-listbox"
          role="listbox"
          className={styles.dropdown}
          aria-label="City suggestions"
        >
          {results.map((city, i) => (
            <li
              key={city.id}
              role="option"
              aria-selected={i === activeIdx}
              className={`${styles.option} ${i === activeIdx ? styles.active : ''}`}
              onMouseDown={() => handleSelect(city)}
              onMouseEnter={() => setActive(i)}
            >
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.cityMeta}>
                {city.countryCode}{city.region ? ` · ${city.region}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && !loading && query.trim() && (
        <div className={styles.empty}>no results for "{query}"</div>
      )}
    </div>
  );
}
