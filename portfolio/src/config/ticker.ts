export interface TickerItem {
  kind: string;
  label: string;
  value: string;
  delta: string;
  /** Matches a key in the /api/ticker response — value will be replaced at runtime */
  liveKey?: string;
}

export const ticker: TickerItem[] = [
  { kind: 'fx',     label: 'EUR/USD',        value: '—',      delta: '',       liveKey: 'EUR_USD' },
  { kind: 'fx',     label: 'GBP/USD',        value: '—',      delta: '',       liveKey: 'GBP_USD' },
  { kind: 'crypto', label: 'BTC',            value: '—',      delta: '',       liveKey: 'BTC_USD' },
  { kind: 'crypto', label: 'ETH',            value: '—',      delta: '',       liveKey: 'ETH_USD' },
  { kind: 'git',    label: 'commits today',  value: '—',      delta: '' },
  { kind: 'fact',   label: 'random',         value: '...',    delta: '' },
];
