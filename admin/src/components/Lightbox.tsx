import { useCallback, useEffect, useRef, useState } from 'react';
import type { Attachment } from '../types';
import { fetchBlob } from '../api';
import { mediaClass } from '../lib/format';
import { IconChevronLeft, IconChevronRight, IconClose, IconDownload } from './icons';

interface Props {
  items: Attachment[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Full-size overlay for images/videos, paging within one card's viewable media.
 *  Fetches each active item's blob on demand and caches object URLs (revoked on unmount). */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const item = items[index];
  const cacheRef = useRef<Map<number, string>>(new Map());
  const [, force] = useState(0);
  const [loading, setLoading] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => onIndex((index + delta + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // load current (and revoke everything on unmount)
  useEffect(() => {
    let cancelled = false;
    const cache = cacheRef.current;
    if (!item || cache.has(item.id)) return;
    setLoading(true);
    fetchBlob(item.download_path)
      .then((blob) => {
        if (cancelled) return;
        cache.set(item.id, URL.createObjectURL(blob));
        force((n) => n + 1);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [item]);

  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      for (const url of cache.values()) URL.revokeObjectURL(url);
      cache.clear();
    };
  }, []);

  if (!item) return null;
  const url = cacheRef.current.get(item.id) ?? null;
  const kind = mediaClass(item.content_type, item.original_filename);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.original_filename}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox-bar">
        <span className="name">{item.original_filename}</span>
        {items.length > 1 && (
          <span className="idx">
            {index + 1} / {items.length}
          </span>
        )}
        <span className="grow" style={{ flex: 1 }} />
        {url && (
          <a className="btn tiny" href={url} download={item.original_filename}>
            <IconDownload width={14} height={14} /> Download
          </a>
        )}
        <button className="btn tiny" onClick={onClose} aria-label="Close">
          <IconClose width={14} height={14} />
        </button>
      </div>
      <div
        className="lightbox-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null || items.length < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {items.length > 1 && (
          <button className="lb-nav prev" onClick={() => go(-1)} aria-label="Previous">
            <IconChevronLeft width={22} height={22} />
          </button>
        )}
        {!url && loading && <span className="spin" style={{ width: 30, height: 30 }} />}
        {url && kind === 'image' && <img src={url} alt={item.original_filename} />}
        {url && kind === 'video' && <video src={url} controls autoPlay />}
        {items.length > 1 && (
          <button className="lb-nav next" onClick={() => go(1)} aria-label="Next">
            <IconChevronRight width={22} height={22} />
          </button>
        )}
      </div>
    </div>
  );
}
