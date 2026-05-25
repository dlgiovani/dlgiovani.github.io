import { useState, useEffect, useRef, useCallback } from 'react';
import type { Pokemon } from '../../../types/pokemon';
import { fetchAllNames, getPokemonByName, type PokemonNameEntry } from '../../../lib/api/pokeapi';
import { formatPokemonName, spriteUrl } from '../../../lib/pokemon-utils';
import styles from './PokemonSearch.module.css';

interface Props {
  onSelect: (pokemon: Pokemon) => void;
  placeholder?: string;
}

export function PokemonSearch({ onSelect, placeholder = 'search pokémon…' }: Props) {
  const [query, setQuery]       = useState('');
  const [allEntries, setAll]    = useState<PokemonNameEntry[]>([]);
  const [results, setResults]   = useState<PokemonNameEntry[]>([]);
  const [loading, setLoading]   = useState(false);
  const [activeIdx, setActive]  = useState(-1);
  const [open, setOpen]         = useState(false);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { fetchAllNames().then(setAll); }, []);

  const filter = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const lq = q.toLowerCase();
    setResults(allEntries.filter(e => e.name.includes(lq)).slice(0, 8));
    setOpen(true);
    setActive(-1);
  }, [allEntries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => filter(q), 200);
  };

  const handleSelect = async (entry: PokemonNameEntry) => {
    setOpen(false);
    setQuery(formatPokemonName(entry.name));
    setLoading(true);
    try {
      const poke = await getPokemonByName(entry.name);
      if (poke) onSelect(poke);
    } finally {
      setLoading(false);
    }
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
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query && filter(query)}
        aria-label="Search Pokémon"
        aria-autocomplete="list"
        aria-controls="pokemon-listbox"
        autoComplete="off"
        spellCheck={false}
      />
      {loading && <span className={styles.spinner} aria-label="Loading" />}
      {open && results.length > 0 && (
        <ul
          id="pokemon-listbox"
          role="listbox"
          className={styles.dropdown}
          aria-label="Pokémon suggestions"
        >
          {results.map((entry, i) => (
            <li
              key={entry.name}
              role="option"
              aria-selected={i === activeIdx}
              className={`${styles.option} ${i === activeIdx ? styles.active : ''}`}
              onMouseDown={() => handleSelect(entry)}
              onMouseEnter={() => setActive(i)}
            >
              <img
                src={spriteUrl(entry.id)}
                alt=""
                aria-hidden="true"
                className={styles.sprite}
                width={32}
                height={32}
              />
              <span>{formatPokemonName(entry.name)}</span>
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && query.trim() && (
        <div className={styles.empty}>no results for "{query}"</div>
      )}
    </div>
  );
}
