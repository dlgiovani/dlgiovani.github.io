import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchBlob } from '../api';

export type BlobStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface LazyBlob {
  /** ref callback to attach to the element whose visibility triggers the fetch */
  setNode: (node: HTMLElement | null) => void;
  status: BlobStatus;
  url: string | null;
  error: string | null;
  retry: () => void;
}

/**
 * Fetches a gated attachment as a Blob and exposes an object URL, but only once
 * the observed element scrolls near the viewport — so large audio/video aren't
 * all pulled at mount. The object URL is revoked on unmount.
 */
export function useLazyBlobUrl(downloadPath: string): LazyBlob {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [status, setStatus] = useState<BlobStatus>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  const load = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus('loading');
    setError(null);
    try {
      const blob = await fetchBlob(downloadPath);
      const objectUrl = URL.createObjectURL(blob);
      urlRef.current = objectUrl;
      setUrl(objectUrl);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setStatus('error');
      startedRef.current = false; // allow retry
    }
  }, [downloadPath]);

  const retry = useCallback(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!node || startedRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      void load();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void load();
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: '250px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, load]);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  return { setNode, status, url, error, retry };
}
