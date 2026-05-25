// TweaksPanel — React island for live site customisation.
// Dispatches `tweakchange` CustomEvent on every change so sibling islands
// (e.g. Playground) can react without prop-drilling.

import * as React from 'react';
import './TweaksPanel.css';

/* ── Constants ─────────────────────────────────────────────────────── */

const TWEAK_DEFAULTS = {
  theme: 'light',
  density: 'cozy',
  apod: false,
  tickerSpeed: 1.2,
  cardStyle: 'flat',
  headlineFont: 'Instrument Serif',
  accent: '#1f6b4e',
};

const HEADLINE_FONTS: Record<string, string> = {
  'Instrument Serif': "'Instrument Serif', Georgia, serif",
  'Newsreader':       "'Newsreader', Georgia, serif",
  'IBM Plex Sans':    "'IBM Plex Sans', system-ui, sans-serif",
  'IBM Plex Mono':    "'IBM Plex Mono', ui-monospace, monospace",
};

const ACCENT_OPTIONS = ['#2a5d9f', '#c14a2b', '#1f6b4e', '#7a3da6', '#0a0a0a'];

/* ── useTweaks ─────────────────────────────────────────────────────── */

type TweakValues = typeof TWEAK_DEFAULTS;

function useTweaks(defaults: TweakValues): [TweakValues, (keyOrEdits: keyof TweakValues | Partial<TweakValues>, val?: unknown) => void] {
  const [values, setValues] = React.useState<TweakValues>(() => ({
    ...defaults,
    theme: (typeof localStorage !== 'undefined' ? localStorage.getItem('tweak_theme') : null) ?? defaults.theme,
  }));

  const setTweak = React.useCallback((keyOrEdits: keyof TweakValues | Partial<TweakValues>, val?: unknown) => {
    const edits: Partial<TweakValues> = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits as Partial<TweakValues>
      : { [keyOrEdits]: val } as Partial<TweakValues>;
    setValues((prev) => ({ ...prev, ...edits }));
    if (edits.theme) localStorage.setItem('tweak_theme', edits.theme as string);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);

  return [values, setTweak];
}

/* ── Layout helpers ────────────────────────────────────────────────── */

function TweakSection({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }: { label: string; value?: string | number; children?: React.ReactNode; inline?: boolean }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────── */

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }: {
  label: string; value: number; min?: number; max?: number; step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const labelLen = (o: string) => o.length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= (({ 2: 16, 3: 10 } as Record<number, number>)[options.length] ?? 0);

  if (!fitsAsSegments) {
    return <TweakSelect label={label} value={value} options={options} onChange={onChange} />;
  }

  const opts = options.map((o) => ({ value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX: number) => {
    if (!trackRef.current) return opts[0].value;
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev: PointerEvent) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </TweakRow>
  );
}

function TweakColor({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  function twkIsLight(hex: string): boolean {
    const h = String(hex).replace('#', '');
    const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
    const n = parseInt(x.slice(0, 6), 16);
    if (Number.isNaN(n)) return true;
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return r * 299 + g * 587 + b * 114 > 148000;
  }

  const TwkCheck = ({ light }: { light: boolean }) => (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
    </svg>
  );

  const cur = value.toLowerCase();
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const on = o.toLowerCase() === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={o} title={o}
                    style={{ background: o }}
                    onClick={() => onChange(o)}>
              {on && <TwkCheck light={twkIsLight(o)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

/* ── TweaksPanel shell ─────────────────────────────────────────────── */

function TweaksPanelShell({ title = 'Tweaks', children }: { title?: string; children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef<HTMLDivElement>(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const t = (e?.data as { type?: string })?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
  );
}

/* ===================================================================
   MAIN EXPORT — TweaksPanel
   =================================================================== */

export function TweaksPanel() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply DOM changes on every tweak
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--serif', HEADLINE_FONTS[t.headlineFont] || HEADLINE_FONTS['Instrument Serif']);
  }, [t.theme, t.density, t.accent, t.headlineFont]);

  return (
    <TweaksPanelShell title="Tweaks">
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={['light', 'dark']}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'cozy', 'spacious']}
          onChange={(v) => setTweak('density', v)}
        />
      </TweakSection>

      <TweakSection label="Accent">
        <TweakColor
          label="Color"
          value={t.accent}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>

      <TweakSection label="Typography">
        <TweakSelect
          label="Headline font"
          value={t.headlineFont}
          options={Object.keys(HEADLINE_FONTS)}
          onChange={(v) => setTweak('headlineFont', v)}
        />
      </TweakSection>

      <TweakSection label="Card style">
        <TweakRadio
          label="Style"
          value={t.cardStyle}
          options={['flat', 'pokedex', 'tcg']}
          onChange={(v) => setTweak('cardStyle', v)}
        />
      </TweakSection>

      <TweakSection label="Ticker">
        <TweakSlider
          label="Speed"
          value={t.tickerSpeed}
          min={0.5}
          max={3}
          step={0.1}
          unit="×"
          onChange={(v) => setTweak('tickerSpeed', v)}
        />
      </TweakSection>

      <TweakSection label="Background">
        <TweakToggle
          label="NASA APOD"
          value={t.apod}
          onChange={(v) => setTweak('apod', v)}
        />
      </TweakSection>
    </TweaksPanelShell>
  );
}
