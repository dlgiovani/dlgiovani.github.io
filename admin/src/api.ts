import type { ConsultingRequest } from './types';

const KEY_STORAGE = 'admin_api_key';

export const getKey = (): string => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
};
export const setKey = (k: string): void => {
  try {
    sessionStorage.setItem(KEY_STORAGE, k);
  } catch {
    /* ignore */
  }
};
export const clearKey = (): void => {
  try {
    sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    /* ignore */
  }
};

/** Thrown for any non-OK API response; `forbidden` flags a bad/expired key. */
export class ApiError extends Error {
  status: number;
  forbidden: boolean;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.forbidden = status === 401 || status === 403;
  }
}

const authHeaders = (): HeadersInit => ({ 'X-API-Key': getKey() });

async function handle(res: Response): Promise<Response> {
  if (res.ok) return res;
  let detail = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
  } catch {
    /* non-JSON error body */
  }
  throw new ApiError(res.status, detail);
}

export async function listRequests(): Promise<ConsultingRequest[]> {
  const res = await handle(await fetch('/api/consulting', { headers: authHeaders() }));
  return res.json();
}

export async function setHandled(id: number, handled: boolean): Promise<ConsultingRequest> {
  const res = await handle(
    await fetch(`/api/consulting/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ handled }),
    }),
  );
  return res.json();
}

/** Fetch a gated attachment as a Blob (the download endpoint needs the API key). */
export async function fetchBlob(downloadPath: string): Promise<Blob> {
  const res = await handle(await fetch(downloadPath, { headers: authHeaders() }));
  return res.blob();
}
