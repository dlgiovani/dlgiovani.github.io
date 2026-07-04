import type { Theme } from '../theme';
import { IconMoon, IconRefresh, IconSearch, IconSun } from './icons';

export interface CategoryOption {
  key: string;
  label: string;
  count: number;
}

interface Props {
  total: number;
  shown: number;
  search: string;
  onSearch: (s: string) => void;
  categories: CategoryOption[];
  activeCat: string | null;
  onCat: (c: string | null) => void;
  sort: 'newest' | 'oldest';
  onSort: (s: 'newest' | 'oldest') => void;
  hideHandled: boolean;
  onHideHandled: (b: boolean) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  onLogout: () => void;
}

export function Toolbar(p: Props) {
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand">
          <span className="logo">
            dlgiovani<b>.</b>
          </span>
          <span className="count">
            leads · {p.shown === p.total ? p.total : `${p.shown} / ${p.total}`}
          </span>
        </div>
        <span className="grow" />
        <button
          className="btn icon"
          onClick={p.onToggleTheme}
          aria-label="Toggle theme"
          title={p.theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {p.theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <button className="btn icon" onClick={p.onRefresh} disabled={p.refreshing} aria-label="Refresh" title="Refresh">
          {p.refreshing ? <span className="spin" /> : <IconRefresh />}
        </button>
        <button className="btn ghost" onClick={p.onLogout}>
          Log out
        </button>
      </div>

      <div className="controls-row">
        <div className="search">
          <IconSearch width={15} height={15} />
          <input
            type="text"
            placeholder="Search name, contact, message…"
            value={p.search}
            onChange={(e) => p.onSearch(e.target.value)}
          />
        </div>

        <div className="chips">
          <button className="chip" aria-pressed={p.activeCat === null} onClick={() => p.onCat(null)}>
            All <span className="n">{p.total}</span>
          </button>
          {p.categories.map((c) => (
            <button
              key={c.key}
              className="chip"
              aria-pressed={p.activeCat === c.key}
              onClick={() => p.onCat(p.activeCat === c.key ? null : c.key)}
            >
              {c.label} <span className="n">{c.count}</span>
            </button>
          ))}
        </div>

        <span className="grow" />

        <label className="switch">
          <input
            type="checkbox"
            checked={p.hideHandled}
            onChange={(e) => p.onHideHandled(e.target.checked)}
          />
          Hide handled
        </label>

        <select
          className="btn"
          value={p.sort}
          onChange={(e) => p.onSort(e.target.value as 'newest' | 'oldest')}
          aria-label="Sort order"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </header>
  );
}
