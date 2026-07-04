import { useState } from 'react';
import { ApiError, listRequests, setKey } from '../api';
import type { ConsultingRequest } from '../types';

interface Props {
  onUnlock: (data: ConsultingRequest[]) => void;
}

export function Gate({ onUnlock }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const key = value.trim();
    if (!key || busy) return;
    setBusy(true);
    setError('');
    setKey(key);
    try {
      const data = await listRequests();
      onUnlock(data);
    } catch (err) {
      const msg = err instanceof ApiError && err.forbidden ? 'Invalid key.' : `Could not connect. ${(err as Error).message}`;
      setError(msg);
      setBusy(false);
    }
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="kicker">dlgiovani.dev · admin</div>
        <h1>Leads</h1>
        <p>Enter the admin key to view work-with-me submissions.</p>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="ADMIN_API_KEY"
            autoComplete="off"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="err">{error}</div>
          <button className="btn primary" type="submit" disabled={busy} style={{ justifyContent: 'center' }}>
            {busy ? <span className="spin" /> : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
