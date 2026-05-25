/* Playground — the playful zone.
   Two tabs:
     1. Pokémon × Weather  — search poké + city → live weather → animated card
     2. World map           — submitted picks plotted by city
   The Pokémon card has 3 style variants (Pokédex device / TCG / Flat),
   cycled via the `cardStyle` tweakchange event. */

import * as React from 'react';
import './playground.css';
import { type CityResult } from '../../../lib/api/geocoding';
import { getPokemonByName } from '../../../lib/api/pokeapi';
import { fetchWeatherForCoords, type WeatherData } from '../../../lib/api/weather';
import { typeColor } from '../../../lib/pokemon-utils';
import type { PokemonStat, Pokemon as PokemonType } from '../../../types/pokemon';
import { CitySearch } from './CitySearch';
import { PokemonSearch } from './PokemonSearch';

/* ── Local types ────────────────────────────────────────────────────── */

interface WeatherEffect { boosts: Record<string, number>; debuffs: Record<string, number>; mood: string; vibe: string; emoji: string; }
type WeatherEffects = Record<string, WeatherEffect>;
interface PlaygroundProps {
  weatherEffects: WeatherEffects;
  cardStyle?: string;
  apiUrl?: string;
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function getStat(stats: PokemonStat[], statName: string): number {
  return stats.find(s => s.name === statName)?.base ?? 0;
}

function getOrCreateUid(): string {
  let uid = localStorage.getItem('pg_uid') ?? '';
  if (!uid) {
    uid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('pg_uid', uid);
  }
  return uid;
}

/* ── Weather visuals ───────────────────────────────────────────────── */

function WeatherScene({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <div className={`wx-scene wx-${kind}`}>
      <div className="wx-content">{children}</div>
    </div>
  );
}

/* ── Stat calc ─────────────────────────────────────────────────────── */

interface AdjustedStats {
  buffs: { type: string; pct: number }[];
  mood: string;
  emoji: string;
  vibe: string | undefined;
}

function adjustedStats(pkmn: PokemonType, wxKind: string, weatherEffects: WeatherEffects): AdjustedStats {
  const w = weatherEffects[wxKind] || ({} as WeatherEffect);
  const buffs: { type: string; pct: number }[] = [];
  pkmn.types.forEach(t => {
    if (w.boosts && w.boosts[t]) buffs.push({ type: t, pct: w.boosts[t] });
    if (w.debuffs && w.debuffs[t]) buffs.push({ type: t, pct: w.debuffs[t] });
  });
  return { buffs, mood: w.mood || 'neutral', emoji: w.emoji || '·', vibe: w.vibe };
}

/* ===================================================================
   CARD VARIANT 1 — Pokédex device (retro red shell)
   =================================================================== */

interface CardProps {
  pkmn: PokemonType;
  city: string;
  weather: WeatherData;
  stats: AdjustedStats;
}

function CardPokedex({ pkmn, city, weather, stats }: CardProps) {
  const hp = getStat(pkmn.stats, 'hp');
  const atk = getStat(pkmn.stats, 'attack');
  const def = getStat(pkmn.stats, 'defense');
  return (
    <div className="px-shell">
      <div className="px-top">
        <div className="px-light-big" />
        <div className="px-lights-small">
          <span className="px-light-r" />
          <span className="px-light-y" />
          <span className="px-light-g" />
        </div>
      </div>

      <div className="px-screen">
        <div className="px-screen-inner">
          <img src={pkmn.sprite} alt={pkmn.name} />
        </div>
        <div className="px-meta">
          <span>NO. {String(pkmn.id).padStart(3, '0')}</span>
          <span>{stats.emoji} {weather.kind.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="px-info">
        <div className="px-name">{pkmn.name}</div>
        <div className="px-id">in {city.toUpperCase()} · {weather.temp}°C · {weather.desc}</div>

        <div className="px-types">
          {pkmn.types.map(t => (
            <span key={t} className="px-type" style={{ background: typeColor(t) }}>{t}</span>
          ))}
        </div>

        <div className="px-row">
          <span>HP {hp}</span>
          <span>ATK {atk}</span>
          <span>DEF {def}</span>
        </div>

        <div className="px-effect">
          {stats.buffs.length === 0 && <div>no weather effect on this type.</div>}
          {stats.buffs.map((b, i) => (
            <div key={i} className={b.pct >= 0 ? 'up' : 'down'}>
              · {b.type} {b.pct >= 0 ? '+' : ''}{Math.round(b.pct * 100)}% &nbsp;<span className="px-weather-note">({weather.desc})</span>
            </div>
          ))}
          <div className="px-effect-mood">
            "{stats.mood}"
          </div>
        </div>
      </div>

      <div className="px-controls">
        <div className="px-dpad" />
        <div className="px-buttons">
          <span /><span />
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CARD VARIANT 2 — TCG-inspired card
   =================================================================== */

function CardTCG({ pkmn, city, weather, stats }: CardProps) {
  const dominant = pkmn.types[0];
  const domColor = typeColor(dominant);
  const atk = getStat(pkmn.stats, 'attack');
  const hp = getStat(pkmn.stats, 'hp');
  return (
    <div className="tcg" style={{ ['--dom' as string]: domColor }}>
      <div className="tcg-head">
        <div className="tcg-name">{pkmn.name}</div>
        <div className="tcg-hp">HP <b>{hp}</b></div>
      </div>

      <div className="tcg-art">
        <img src={pkmn.artwork} alt={pkmn.name} />
        <div className="stage">basic · NO. {String(pkmn.id).padStart(3, '0')}</div>
      </div>

      <div className="tcg-meta">
        <span>{city} · {weather.temp}°C {stats.emoji}</span>
        <span className="tcg-meta-mood">"{stats.mood}"</span>
      </div>

      <div className="tcg-body">
        <div className="tcg-attack">
          <div className="tcg-energy">
            {pkmn.types.map((t, i) => (
              <span key={i} style={{ background: typeColor(t) }}>
                {t[0].toUpperCase()}
              </span>
            ))}
          </div>
          <div>
            <div className="tcg-aname">
              {pkmn.types[0]} strike
            </div>
            <div className="tcg-aeffect">
              {stats.buffs.length
                ? `boosted by ${stats.vibe || weather.kind} (${stats.buffs.map(b => `${b.type}${b.pct >= 0 ? '+' : ''}${Math.round(b.pct * 100)}%`).join(', ')})`
                : 'weather has no effect on this type.'}
            </div>
          </div>
          <div className="tcg-adamage">{atk}</div>
        </div>

        <div className="tcg-attack">
          <div className="tcg-energy">
            <span style={{ background: '#aaa' }}>·</span>
          </div>
          <div>
            <div className="tcg-aname">tackle</div>
            <div className="tcg-aeffect">a reliable opener.</div>
          </div>
          <div className="tcg-adamage">{Math.round(atk * 0.4)}</div>
        </div>

        <div className="tcg-foot">
          <span>weakness: see chart</span>
          <span>retreat: ●●</span>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CARD VARIANT 3 — Modern flat (matches editorial style)
   =================================================================== */

function CardFlat({ pkmn, city, weather, stats }: CardProps) {
  const hp = getStat(pkmn.stats, 'hp');
  const atk = getStat(pkmn.stats, 'attack');
  const def = getStat(pkmn.stats, 'defense');
  return (
    <div className="flat-card">
      <div className="flat-art">
        <div className="badge">no. {String(pkmn.id).padStart(3, '0')}</div>
        <img src={pkmn.artwork} alt={pkmn.name} />
      </div>

      <div className="flat-side">
        <div className="num">specimen</div>
        <h3>{pkmn.name}</h3>
        <div className="flat-types">
          {pkmn.types.map(t => (
            <span key={t} className="flat-type" style={{ color: typeColor(t) }}>{t}</span>
          ))}
        </div>
        <div className="flat-stats">
          <div className="flat-stat"><div className="l">HP</div><div className="v">{hp}</div></div>
          <div className="flat-stat"><div className="l">ATK</div><div className="v">{atk}</div></div>
          <div className="flat-stat"><div className="l">DEF</div><div className="v">{def}</div></div>
        </div>
        <div className="flat-wx">
          <div className="where">{city.toUpperCase()} · {weather.temp}°C · {weather.desc} {stats.emoji}</div>
          <div className="flat-effects">
            {stats.buffs.length === 0 && <div className="none">no effect on these types.</div>}
            {stats.buffs.map((b, i) => (
              <div key={i} className={b.pct >= 0 ? 'up' : 'down'}>
                {b.type} {b.pct >= 0 ? '+' : ''}{Math.round(b.pct * 100)}%
              </div>
            ))}
          </div>
          <div className="flat-mood">"{stats.mood}"</div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   MAP TAB
   =================================================================== */

interface CityPin { city: string; lat: number; lon: number; top_pokemon: string; count: number; }

function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon + 180) / 360 * 100, y: (90 - lat) / 180 * 100 };
}

function MapTab({ apiUrl }: { apiUrl: string }) {
  const [pins, setPins] = React.useState<CityPin[]>([]);
  const [hover, setHover] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);

  React.useEffect(() => {
    fetch(`${apiUrl}/api/picks/by-city`)
      .then(r => r.json())
      .then((data: CityPin[]) => { setPins(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => {
        const nz = Math.min(5, Math.max(1, +(z + (e.deltaY < 0 ? 0.25 : -0.25)).toFixed(2)));
        if (nz === 1) setPan({ x: 0, y: 0 });
        return nz;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      setPan({ x: dragRef.current.px + e.clientX - dragRef.current.sx, y: dragRef.current.py + e.clientY - dragRef.current.sy });
    };
    const onUp = () => { dragRef.current = null; setDragging(false); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div className="map-tab">
      <div
        className={`map-canvas${dragging ? ' dragging' : ''}`}
        ref={canvasRef}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('.map-zoom-controls')) return;
          dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
          setDragging(true);
        }}
      >
        <div className="map-inner" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <img src="/world-map.svg" aria-hidden="true" className="map-svg-bg" />
          <div className="map-markers">
            {pins.map((c) => {
              const { x, y } = latLonToXY(c.lat, c.lon);
              const markerClass = `marker${hover === c.city ? ' active' : hover ? ' dim' : ''}`;
              return (
                <div key={c.city}
                  className={markerClass}
                  style={{ left: x + '%', top: y + '%', transform: `translate(-50%, -50%) scale(${+(1 / zoom).toFixed(4)})` }}
                  onMouseEnter={() => setHover(c.city)}
                  onMouseLeave={() => setHover(null)}>
                  <div className="dot" />
                  <div className="pulse" />
                  <div className="tip">
                    {c.city}<br />
                    top: <b>{c.top_pokemon}</b> ({c.count})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {!loading && pins.length === 0 && (
          <div className="map-empty">no picks yet — be the first →</div>
        )}
        <div className="map-zoom-controls">
          <button onClick={() => setZoom(z => Math.min(5, +(z + 0.5).toFixed(2)))}>+</button>
          <button onClick={() => {
            setZoom(z => {
              const nz = Math.max(1, +(z - 0.5).toFixed(2));
              if (nz === 1) setPan({ x: 0, y: 0 });
              return nz;
            });
          }}>−</button>
        </div>
      </div>

      <div className="map-side">
        <h4>where players are</h4>
        <div className="list">
          {loading
            ? <div className="map-notice">loading…</div>
            : pins.length === 0
              ? <div className="map-notice">submit a pick to appear here</div>
              : pins.map(c => (
                <div className="map-row" key={c.city}
                  onMouseEnter={() => setHover(c.city)}
                  onMouseLeave={() => setHover(null)}
                  style={{ background: hover === c.city ? 'color-mix(in oklch, var(--accent) 8%, transparent)' : 'transparent' }}>
                  <div>
                    <div className="city">{c.city}</div>
                    <div className="top">top: {c.top_pokemon}</div>
                  </div>
                  <div className="count">{c.count}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   MAIN PLAYGROUND
   =================================================================== */

const LISBON = { lat: 38.7167, lon: -9.1333 };
const DEFAULT_WEATHER: WeatherData = { temp: 20, kind: 'sunny', desc: 'pleasant' };

export function Playground({ weatherEffects, cardStyle: initialCardStyle = 'flat', apiUrl = 'http://localhost:8000' }: PlaygroundProps) {
  const [selectedPokemon, setSelectedPokemon] = React.useState<PokemonType | null>(null);
  const [weather, setWeather] = React.useState<WeatherData>(DEFAULT_WEATHER);
  const [cityLabel, setCityLabel] = React.useState('Lisbon');
  const [cityCoords, setCityCoords] = React.useState({ lat: LISBON.lat, lon: LISBON.lon });
  const [tab, setTab] = React.useState<'weather' | 'map'>('weather');
  const [saved, setSaved] = React.useState(false);
  const [cardStyle, setCardStyle] = React.useState(initialCardStyle);

  // sync saved state with localStorage whenever pokemon or city changes
  React.useEffect(() => {
    try {
      const prior = JSON.parse(localStorage.getItem('pg_pick') ?? 'null');
      setSaved(prior?.name === selectedPokemon?.name && prior?.city === cityLabel);
    } catch { setSaved(false); }
  }, [selectedPokemon?.name, cityLabel]);

  React.useEffect(() => {
    getPokemonByName('charizard').then(p => { if (p) setSelectedPokemon(p); });
    fetchWeatherForCoords(LISBON.lat, LISBON.lon).then(setWeather);
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Record<string, unknown>;
      if ('cardStyle' in detail) setCardStyle(String(detail.cardStyle));
    };
    window.addEventListener('tweakchange', handler);
    return () => window.removeEventListener('tweakchange', handler);
  }, []);

  const handleCitySelect = React.useCallback((city: CityResult) => {
    setCityLabel(city.name);
    setCityCoords({ lat: city.lat, lon: city.lon });
    fetchWeatherForCoords(city.lat, city.lon).then(setWeather);
  }, []);

  const stats = selectedPokemon ? adjustedStats(selectedPokemon, weather.kind, weatherEffects) : null;

  const Card = cardStyle === 'pokedex' ? CardPokedex
    : cardStyle === 'tcg' ? CardTCG
      : CardFlat;

  return (
    <section id="playground" className="sec-playground">
      <div className="pg-inner">
        <div className="pg-intro">
          <div>
            <div className="sec-head">
              <div className="kicker">04 — playground</div>
            </div>
            <h2>
              Things I built<br />that you can <em>poke</em>.
            </h2>
          </div>
          <p className="pg-lead">
            The point of the integration work isn't the integration — it's what it lets
            you do. Below: a small toy that wires up the Pokémon API to a weather feed,
            uses both to compute a result, and (if you opt in) tells me where you played
            from. Two tabs.
          </p>
        </div>

        <div className="pg-tabs">
          <button className={`pg-tab ${tab === 'weather' ? 'active' : ''}`}
            onClick={() => setTab('weather')}>
            <span className="n">01</span>pokémon × weather
          </button>
          <button className={`pg-tab ${tab === 'map' ? 'active' : ''}`}
            onClick={() => setTab('map')}>
            <span className="n">02</span>world map of picks
          </button>
        </div>

        {tab === 'weather' && (
          <div className="pg-stage">
            <div className="pg-controls">
              <h4>1 · pick a pokémon</h4>
              <PokemonSearch onSelect={setSelectedPokemon} />

              <h4>2 · your city</h4>
              <CitySearch onSelect={handleCitySelect} />

              <div className="save-row">
                <label>
                  <input type="checkbox"
                    checked={saved}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (!checked) { setSaved(false); return; }

                      setSaved(true);

                      if (selectedPokemon) {
                        fetch(`${apiUrl}/api/picks`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            pokemon_name: selectedPokemon.name,
                            city: cityLabel,
                            lat: cityCoords.lat,
                            lon: cityCoords.lon,
                            uid: getOrCreateUid(),
                          }),
                        })
                          .then(() => localStorage.setItem('pg_pick', JSON.stringify({ name: selectedPokemon.name, city: cityLabel })))
                          .catch(() => {});
                      }
                    }} />
                  <span>
                    send my pick to the wall (anonymous — only city + pokémon).
                    helps the map grow.
                  </span>
                </label>
                {saved && <div className="saved">✓ saved · thanks. see the map tab →</div>}
              </div>
            </div>

            <div className="pg-card-wrap">
              {selectedPokemon && stats ? (
                <WeatherScene kind={weather.kind}>
                  <div className="wx-inner-pad">
                    <Card pkmn={selectedPokemon} city={cityLabel} weather={weather} stats={stats} />
                  </div>
                </WeatherScene>
              ) : (
                <div className="pg-card-placeholder">
                  loading pokémon…
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'map' && <MapTab apiUrl={apiUrl} />}
      </div>
    </section>
  );
}
