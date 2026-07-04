import type { Category } from '../types';

export const CATEGORY_LABELS: Record<string, string> = {
  consulting: 'Consulting',
  integration: 'Integration',
  automation: 'Automation',
  else: 'Something else',
};

export const categoryLabel = (c: string): string => CATEGORY_LABELS[c] ?? c;

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(iso: string): string {
  const d = new Date(iso).getTime();
  if (isNaN(d)) return '';
  const diff = d - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536e6],
    ['month', 2592e6],
    ['week', 6048e5],
    ['day', 864e5],
    ['hour', 36e5],
    ['minute', 6e4],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'minute') return rtf.format(Math.round(diff / ms), unit);
  }
  return 'just now';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export type ContactKind = 'email' | 'phone' | 'url' | 'text';

export function contactKind(v: string): ContactKind {
  const s = v.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'email';
  if (/^https?:\/\//i.test(s)) return 'url';
  if (/^\+?[\d\s().-]{6,}$/.test(s)) return 'phone';
  return 'text';
}

export function contactHref(v: string): string | null {
  const s = v.trim();
  switch (contactKind(s)) {
    case 'email':
      return `mailto:${s}`;
    case 'phone':
      return `tel:${s.replace(/[\s().-]/g, '')}`;
    case 'url':
      return s;
    default:
      return null;
  }
}

export function fileExt(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim());
  return m ? m[1].toUpperCase() : 'FILE';
}

export type MediaClass = 'image' | 'audio' | 'video' | 'pdf' | 'other';

export function mediaClass(contentType: string, filename: string): MediaClass {
  const ct = (contentType || '').toLowerCase();
  if (ct.startsWith('image/')) return 'image';
  if (ct.startsWith('audio/')) return 'audio';
  if (ct.startsWith('video/')) return 'video';
  if (ct === 'application/pdf' || /\.pdf$/i.test(filename)) return 'pdf';
  return 'other';
}

export const isCategory = (c: string): c is Category =>
  c === 'consulting' || c === 'integration' || c === 'automation' || c === 'else';
