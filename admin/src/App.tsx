import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, clearKey, getKey, listRequests, setHandled } from './api';
import type { ConsultingRequest } from './types';
import { categoryLabel } from './lib/format';
import { getTheme, toggleTheme, type Theme } from './theme';
import { Gate } from './components/Gate';
import { Toolbar, type CategoryOption } from './components/Toolbar';
import { SubmissionCard } from './components/SubmissionCard';
import { IconInbox } from './components/icons';

type Phase = 'checking' | 'gate' | 'app';
const CATEGORY_ORDER = ['consulting', 'integration', 'automation', 'else'];

export function App() {
  const [phase, setPhase] = useState<Phase>(getKey() ? 'checking' : 'gate');
  const [requests, setRequests] = useState<ConsultingRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());
  const [theme, setThemeState] = useState<Theme>(getTheme());

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [hideHandled, setHideHandled] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const data = await listRequests();
      setRequests(data);
      setPhase('app');
    } catch (err) {
      if (err instanceof ApiError && err.forbidden) {
        clearKey();
        setPhase('gate');
      } else {
        setError((err as Error).message);
        setPhase('app');
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (phase === 'checking') void load();
  }, [phase, load]);

  const logout = useCallback(() => {
    clearKey();
    setRequests([]);
    setPhase('gate');
  }, []);

  const toggleHandled = useCallback(
    async (req: ConsultingRequest) => {
      const target = !req.handled_at;
      setBusyIds((s) => new Set(s).add(req.id));
      setRequests((rs) =>
        rs.map((r) => (r.id === req.id ? { ...r, handled_at: target ? new Date().toISOString() : null } : r)),
      );
      try {
        const updated = await setHandled(req.id, target);
        setRequests((rs) => rs.map((r) => (r.id === req.id ? updated : r)));
      } catch (err) {
        setRequests((rs) => rs.map((r) => (r.id === req.id ? req : r))); // revert
        if (err instanceof ApiError && err.forbidden) logout();
        else setError((err as Error).message);
      } finally {
        setBusyIds((s) => {
          const n = new Set(s);
          n.delete(req.id);
          return n;
        });
      }
    },
    [logout],
  );

  const categories = useMemo<CategoryOption[]>(() => {
    const counts = new Map<string, number>();
    for (const r of requests) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
    const ordered = CATEGORY_ORDER.filter((k) => counts.has(k));
    const extra = [...counts.keys()].filter((k) => !CATEGORY_ORDER.includes(k));
    return [...ordered, ...extra].map((k) => ({ key: k, label: categoryLabel(k), count: counts.get(k) ?? 0 }));
  }, [requests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = requests;
    if (activeCat) list = list.filter((r) => r.category === activeCat);
    if (hideHandled) list = list.filter((r) => !r.handled_at);
    if (q)
      list = list.filter((r) =>
        [r.name, r.contact, r.company, r.message, r.extra_note].some((f) => f?.toLowerCase().includes(q)),
      );
    return [...list].sort((a, b) => {
      const cmp = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      return sort === 'newest' ? -cmp : cmp;
    });
  }, [requests, activeCat, hideHandled, search, sort]);

  if (phase === 'checking') {
    return (
      <div className="gate">
        <span className="spin" style={{ width: 26, height: 26 }} />
      </div>
    );
  }
  if (phase === 'gate') {
    return <Gate onUnlock={(data) => { setRequests(data); setPhase('app'); }} />;
  }

  const filtering = search.trim() !== '' || activeCat !== null || hideHandled;

  return (
    <>
      <Toolbar
        total={requests.length}
        shown={filtered.length}
        search={search}
        onSearch={setSearch}
        categories={categories}
        activeCat={activeCat}
        onCat={setActiveCat}
        sort={sort}
        onSort={setSort}
        hideHandled={hideHandled}
        onHideHandled={setHideHandled}
        theme={theme}
        onToggleTheme={() => setThemeState(toggleTheme())}
        onRefresh={() => load(true)}
        refreshing={refreshing}
        onLogout={logout}
      />

      {error && (
        <div className="banner">
          <span>Something went wrong: {error}</span>
          <span className="grow" />
          <button className="btn tiny" onClick={() => load(true)}>
            Retry
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="center-state">
          <IconInbox />
          <h3>{requests.length === 0 ? 'No submissions yet' : 'Nothing matches'}</h3>
          <p>
            {requests.length === 0
              ? 'New work-with-me leads will show up here.'
              : filtering
                ? 'Try clearing the search or filters.'
                : ''}
          </p>
        </div>
      ) : (
        <main className="list">
          {filtered.map((req) => (
            <SubmissionCard
              key={req.id}
              req={req}
              busy={busyIds.has(req.id)}
              onToggleHandled={toggleHandled}
            />
          ))}
        </main>
      )}
    </>
  );
}
