/* Playground — the playful zone.
   Two tabs:
     1. Pokémon × Weather  — search poké + city → live weather → animated card
     2. World map           — submitted picks plotted by city
   The Pokémon card has 3 style variants (Pokédex device / TCG / Flat). */

import * as React from 'react';
import { type CityResult } from '../../../lib/api/geocoding';
import { fetchAllNames, getPokemonByName } from '../../../lib/api/pokeapi';
import { fetchWeatherForCoords, type WeatherData } from '../../../lib/api/weather';
import { spriteUrl, typeColor } from '../../../lib/pokemon-utils';
import type { PokemonStat, Pokemon as PokemonType } from '../../../types/pokemon';
import { CitySearch } from './CitySearch';
import './playground.css';
import { PokemonSearch } from './PokemonSearch';

/* ── Local types ────────────────────────────────────────────────────── */

interface WeatherEffect { boosts: Record<string, number>; debuffs: Record<string, number>; mood: string; vibe: string; emoji: string; }
type WeatherEffects = Record<string, WeatherEffect>;

interface PgStrings {
  kicker: string; title_1: string; title_2: string; title_em: string; lead: string;
  tab_weather: string; tab_map: string; step_pokemon: string; step_city: string;
  save_label: string; save_done: string; loading_pokemon: string;
  map_title: string; map_loading: string; map_empty_list: string; map_empty_map: string; map_top: string; map_top_picks?: string;
  card_no_wx_effect?: string;
  card_basic?: string;
  card_boosted_by?: string;
  card_opener?: string;
  card_weakness?: string;
  card_retreat?: string;
  card_specimen?: string;
}

interface PlaygroundProps {
  weatherEffects: WeatherEffects;
  cardStyle?: string;
  apiUrl?: string;
  strings?: PgStrings;
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
  strings: PgStrings;
}

function CardPokedex({ pkmn, city, weather, stats, strings }: CardProps) {
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
          {stats.buffs.length === 0 && <div>{strings.card_no_wx_effect ?? 'no weather effect on this type.'}</div>}
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

function CardTCG({ pkmn, city, weather, stats, strings }: CardProps) {
  const dominant = pkmn.types[0];
  const domColor = typeColor(dominant);
  const atk = getStat(pkmn.stats, 'attack');
  const hp = getStat(pkmn.stats, 'hp');
  const noWxEffect = strings.card_no_wx_effect ?? 'no weather effect on this type.';
  const boostedBy  = strings.card_boosted_by   ?? 'boosted by';
  return (
    <div className="tcg" style={{ ['--dom' as string]: domColor }}>
      <div className="tcg-head">
        <div className="tcg-name">{pkmn.name}</div>
        <div className="tcg-hp">HP <b>{hp}</b></div>
      </div>

      <div className="tcg-art">
        <img src={pkmn.artwork} alt={pkmn.name} />
        <div className="stage">{strings.card_basic ?? 'basic · NO. '}{String(pkmn.id).padStart(3, '0')}</div>
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
                ? `${boostedBy} ${stats.vibe || weather.kind} (${stats.buffs.map(b => `${b.type}${b.pct >= 0 ? '+' : ''}${Math.round(b.pct * 100)}%`).join(', ')})`
                : noWxEffect}
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
            <div className="tcg-aeffect">{strings.card_opener ?? 'a reliable opener.'}</div>
          </div>
          <div className="tcg-adamage">{Math.round(atk * 0.4)}</div>
        </div>

        <div className="tcg-foot">
          <span>{strings.card_weakness ?? 'weakness: see chart'}</span>
          <span>{strings.card_retreat ?? 'retreat: ●●'}</span>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CARD VARIANT 3 — Modern flat (matches editorial style)
   =================================================================== */

function CardFlat({ pkmn, city, weather, stats, strings }: CardProps) {
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
        <div className="num">{strings.card_specimen ?? 'specimen'}</div>
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
            {stats.buffs.length === 0 && <div className="none">{strings.card_no_wx_effect ?? 'no effect on these types.'}</div>}
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

interface PinEntry { name: string; count: number; }
interface CityPin { city: string; lat: number; lon: number; total: number; picks: PinEntry[]; }

function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon + 180) / 360 * 100, y: (90 - lat) / 180 * 100 };
}

function MapTab({ apiUrl, strings }: { apiUrl: string; strings: PgStrings }) {
  const [pins, setPins] = React.useState<CityPin[]>([]);
  const [sprites, setSprites] = React.useState<Record<string, string>>({});
  const [hover, setHover] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const zoomRef = React.useRef(zoom);
  const panRef = React.useRef(pan);
  React.useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  React.useEffect(() => { panRef.current = pan; }, [pan]);

  React.useEffect(() => {
    fetch(`${apiUrl}/api/picks/by-city`)
      .then(r => r.json())
      .then(async (data: CityPin[]) => {
        setPins(data);
        setLoading(false);
        const uniqueNames = [...new Set(data.map(c => c.picks[0]?.name).filter(Boolean))] as string[];
        const allNames = await fetchAllNames();
        const nameToId = new Map(allNames.map(p => [p.name, p.id]));
        const spriteMap: Record<string, string> = {};
        for (const name of uniqueNames) {
          const id = nameToId.get(name);
          if (id) spriteMap[name] = spriteUrl(id);
        }
        setSprites(spriteMap);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Mouse position relative to canvas centre (the transform-origin of map-inner)
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      const z = zoomRef.current;
      const { x: px, y: py } = panRef.current;
      const nz = Math.min(15, Math.max(1, +(z + (e.deltaY < 0 ? 0.5 : -0.5)).toFixed(2)));
      if (nz === z) return;
      if (nz === 1) { setZoom(1); setPan({ x: 0, y: 0 }); return; }
      // Keep the map point under the cursor fixed after scaling
      const ratio = nz / z;
      setZoom(nz);
      setPan({ x: mx * (1 - ratio) + px * ratio, y: my * (1 - ratio) + py * ratio });
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

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ts = {
      panStart: null as { tx: number; ty: number; px: number; py: number } | null,
      pinchDist: 0,
      pinchMid: { x: 0, y: 0 },
      pinchPan: { x: 0, y: 0 },
      pinchZoom: 1,
    };
    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('.map-zoom-controls')) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        ts.panStart = { tx: e.touches[0].clientX, ty: e.touches[0].clientY, px: panRef.current.x, py: panRef.current.y };
        ts.pinchDist = 0;
        setDragging(true);
      } else if (e.touches.length === 2) {
        ts.panStart = null;
        const [t1, t2] = [e.touches[0], e.touches[1]];
        ts.pinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const rect = el.getBoundingClientRect();
        ts.pinchMid = {
          x: (t1.clientX + t2.clientX) / 2 - rect.left - rect.width / 2,
          y: (t1.clientY + t2.clientY) / 2 - rect.top - rect.height / 2,
        };
        ts.pinchPan = { ...panRef.current };
        ts.pinchZoom = zoomRef.current;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && ts.panStart) {
        setPan({ x: ts.panStart.px + e.touches[0].clientX - ts.panStart.tx, y: ts.panStart.py + e.touches[0].clientY - ts.panStart.ty });
      } else if (e.touches.length === 2 && ts.pinchDist > 0) {
        const [t1, t2] = [e.touches[0], e.touches[1]];
        const newDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const ratio = newDist / ts.pinchDist;
        const nz = Math.min(15, Math.max(1, +(ts.pinchZoom * ratio).toFixed(2)));
        if (nz === 1) { setZoom(1); setPan({ x: 0, y: 0 }); return; }
        const zRatio = nz / ts.pinchZoom;
        setZoom(nz);
        setPan({ x: ts.pinchMid.x * (1 - zRatio) + ts.pinchPan.x * zRatio, y: ts.pinchMid.y * (1 - zRatio) + ts.pinchPan.y * zRatio });
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) { ts.panStart = null; setDragging(false); }
      else if (e.touches.length === 1) {
        ts.panStart = { tx: e.touches[0].clientX, ty: e.touches[0].clientY, px: panRef.current.x, py: panRef.current.y };
        ts.pinchDist = 0;
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
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
          <img src="/world-states.svg" aria-hidden="true" className="map-svg-states" />
          <div className="map-markers">
            {pins.map((c) => {
              const { x, y } = latLonToXY(c.lat, c.lon);
              const markerClass = `marker${hover === c.city ? ' active' : hover ? ' dim' : ''}`;
              const topName = c.picks[0]?.name;
              const topSprite = topName ? sprites[topName] : undefined;
              return (
                <div key={c.city}
                  className={markerClass}
                  style={{ left: x + '%', top: y + '%', transform: `translate(-50%, -50%) scale(${+(1 / zoom).toFixed(4)})` }}
                  onMouseEnter={() => setHover(c.city)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(h => h === c.city ? null : c.city)}>
                  {topSprite
                    ? <img className="map-sprite" src={topSprite} alt={topName} />
                    : <div className="dot" />}
                  <div className="pulse" />
                  <div className="tip">
                    <span className="tip-city">{c.city} ({c.total})</span>
                    <span className="tip-label">{strings.map_top_picks ?? 'top picks'}</span>
                    {c.picks.map(p => <span key={p.name} className="tip-pick">{p.name} ({p.count})</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {!loading && pins.length === 0 && (
          <div className="map-empty">{strings.map_empty_map}</div>
        )}
        <div className="map-zoom-controls">
          <button onClick={() => setZoom(z => Math.min(15, +(z + 1).toFixed(2)))}>+</button>
          <button onClick={() => {
            setZoom(z => {
              const nz = Math.max(1, +(z - 1).toFixed(2));
              if (nz === 1) setPan({ x: 0, y: 0 });
              return nz;
            });
          }}>−</button>
        </div>
      </div>

      <div className="map-side">
        <h4>{strings.map_title}</h4>
        <div className="list">
          {loading
            ? <div className="map-notice">{strings.map_loading}</div>
            : pins.length === 0
              ? <div className="map-notice">{strings.map_empty_list}</div>
              : pins.map(c => (
                <div className="map-row" key={c.city}
                  onMouseEnter={() => setHover(c.city)}
                  onMouseLeave={() => setHover(null)}
                  style={{ background: hover === c.city ? 'color-mix(in oklch, var(--accent) 8%, transparent)' : 'transparent' }}>
                  <div>
                    <div className="city">{c.city}</div>
                    <div className="top">{strings.map_top}{c.picks[0]?.name ?? ''}</div>
                  </div>
                  <div className="count">{c.total}</div>
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

const DEFAULT_STRINGS: PgStrings = {
  kicker: '04 — playground', title_1: 'Things I built', title_2: 'that you can ', title_em: 'poke',
  lead: 'The point of the integration work is what it lets you do. Below: a Pokémon × weather toy. Two tabs.',
  tab_weather: 'pokémon × weather', tab_map: 'world map of picks',
  step_pokemon: '1 · pick a pokémon', step_city: '2 · your city',
  save_label: 'send my pick to the wall (anonymous). helps the map grow.',
  save_done: '✓ saved · thanks. see the map tab →', loading_pokemon: 'loading pokémon…',
  map_title: 'where players are', map_loading: 'loading…',
  map_empty_list: 'submit a pick to appear here', map_empty_map: 'no picks yet — be the first →', map_top: 'top: ', map_top_picks: 'top picks',
  card_no_wx_effect: 'no weather effect on this type.',
  card_basic: 'basic · NO. ', card_boosted_by: 'boosted by',
  card_opener: 'a reliable opener.', card_weakness: 'weakness: see chart',
  card_retreat: 'retreat: ●●', card_specimen: 'specimen',
};

export function Playground({ weatherEffects, cardStyle: initialCardStyle = 'flat', apiUrl = 'http://localhost:8000', strings = DEFAULT_STRINGS }: PlaygroundProps) {
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
              <div className="kicker">{strings.kicker}</div>
            </div>
            <h2>
              {strings.title_1}<br />{strings.title_2}<em>{strings.title_em}</em>.
            </h2>
          </div>
          <p className="pg-lead">{strings.lead}</p>
        </div>

        <div className="pg-tabs">
          <button className={`pg-tab ${tab === 'weather' ? 'active' : ''}`}
            onClick={() => setTab('weather')}>
            <span className="n">01</span>{strings.tab_weather}
          </button>
          <button className={`pg-tab ${tab === 'map' ? 'active' : ''}`}
            onClick={() => setTab('map')}>
            <span className="n">02</span>{strings.tab_map}
          </button>
        </div>

        {tab === 'weather' && (
          <div className="pg-stage">
            <div className="pg-controls">
              <h4>{strings.step_pokemon}</h4>
              <PokemonSearch onSelect={setSelectedPokemon} />

              <h4>{strings.step_city}</h4>
              <CitySearch onSelect={handleCitySelect} />

              {/* <h4>3 · card style</h4>
              <div className="style-btns">
                {(['flat', 'pokedex', 'tcg'] as const).map(s => (
                  <button key={s} className={`style-btn${cardStyle === s ? ' active' : ''}`}
                    onClick={() => setCardStyle(s)}>{s}</button>
                ))}
              </div> */}

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
                          .catch(() => { });
                      }
                    }} />
                  <span>{strings.save_label}</span>
                </label>
                {saved && <div className="saved">{strings.save_done}</div>}
              </div>
            </div>

            <div className="pg-card-wrap">
              {selectedPokemon && stats ? (
                <WeatherScene kind={weather.kind}>
                  <div className="wx-inner-pad">
                    <Card pkmn={selectedPokemon} city={cityLabel} weather={weather} stats={stats} strings={strings} />
                  </div>
                </WeatherScene>
              ) : (
                <div className="pg-card-placeholder">{strings.loading_pokemon}</div>
              )}
            </div>
          </div>
        )}

        {tab === 'map' && <MapTab apiUrl={apiUrl} strings={strings} />}
      </div>
    </section>
  );
}
