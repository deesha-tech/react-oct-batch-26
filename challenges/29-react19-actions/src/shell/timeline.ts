// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
// A tiny store that records fake network requests and render events, so the demo can draw them.
// Not part of the concept being taught: it only powers the timeline panel.
import { useSyncExternalStore } from 'react';

export type RequestStatus = 'pending' | 'done' | 'cancelled' | 'error' | 'stale';
export interface TimelineRequest {
  id: number;
  label: string;
  group?: string;
  start: number;
  end?: number;
  status: RequestStatus;
}
export interface TimelineEvent { at: number; label: string }
export interface TimelineState { t0: number; requests: TimelineRequest[]; events: TimelineEvent[] }

let state: TimelineState = { t0: performance.now(), requests: [], events: [] };
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const now = () => performance.now() - state.t0;

export const timeline = {
  /** Start a fresh recording, e.g. when the user clicks a link or starts typing. */
  reset(label = 'start') {
    state = { t0: performance.now(), requests: [], events: [{ at: 0, label }] };
    emit();
  },
  mark(label: string) {
    state = { ...state, events: [...state.events, { at: now(), label }] };
    emit();
  },
  start(label: string, group?: string): number {
    const id = nextId++;
    state = { ...state, requests: [...state.requests, { id, label, group, start: now(), status: 'pending' }] };
    emit();
    return id;
  },
  finish(id: number, status: Exclude<RequestStatus, 'pending' | 'stale'>) {
    const t = now();
    state = {
      ...state,
      requests: state.requests.map((r) => {
        if (r.id !== id) return r;
        // A response that arrives after a newer request in the same group already finished is "stale".
        const newerDone = r.group && status === 'done' && state.requests.some((o) => o.group === r.group && o.start > r.start && o.status === 'done');
        return { ...r, end: t, status: newerDone ? 'stale' : status };
      }),
    };
    emit();
  },
};

export function useTimeline(): TimelineState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
  );
}

/**
 * A fake network call: waits `ms`, then resolves with `value()`.
 * Honours an AbortSignal exactly like fetch: rejects with an AbortError and records "cancelled".
 */
export function fakeFetch<T>(label: string, ms: number, value: () => T, opts: { signal?: AbortSignal; group?: string } = {}): Promise<T> {
  const { signal, group } = opts;
  const id = timeline.start(label, group);
  return new Promise<T>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      timeline.finish(id, 'cancelled');
      reject(new DOMException('The request was cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      try {
        const v = value();
        timeline.finish(id, 'done');
        resolve(v);
      } catch (e) {
        timeline.finish(id, 'error');
        reject(e);
      }
    }, ms);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
  });
}

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/**
 * A real network call (fetch) that shows up on the timeline like fakeFetch does.
 * Cancelled requests are recorded as "cancelled", HTTP errors as "failed".
 */
export async function trackedFetch<T>(label: string, url: string, opts: { signal?: AbortSignal; group?: string } = {}): Promise<T> {
  const id = timeline.start(label, opts.group);
  try {
    const res = await fetch(url, { signal: opts.signal });
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as { message?: string }));
      timeline.finish(id, 'error');
      throw new HttpError(res.status, body.message ?? res.statusText);
    }
    const data = (await res.json()) as T;
    timeline.finish(id, 'done');
    return data;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') timeline.finish(id, 'cancelled');
    else if (!(e instanceof HttpError)) timeline.finish(id, 'error');
    throw e;
  }
}
