import { createElement, useEffect, useState } from 'react';
import type { Category } from './types';

// Tags registered by /lever-anim.js (vanilla custom elements, client-only)
const TAG: Record<Category, string> = {
  consulting: 'consulting-anim',
  integration: 'integration-anim',
  automation: 'automation-anim',
  else: 'somethingelse-anim',
};

let loader: Promise<void> | null = null;

function loadAnimScript(): Promise<void> {
  if (customElements.get('consulting-anim')) return Promise.resolve();
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/lever-anim.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('failed to load lever-anim.js'));
      document.head.appendChild(s);
    });
  }
  return loader;
}

export function CategoryAnim({ category, accent }: { category: Category; accent: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadAnimScript()
      .then(() => alive && setReady(true))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) return null;
  return createElement(TAG[category], {
    key: category,
    accent,
    style: { display: 'block', width: '100%', height: '100%' },
  });
}
