export function deferUntilIdle(callback: () => void, timeoutMs = 4000) {
  if (typeof window === "undefined") return () => undefined;

  const idleCallback = window.requestIdleCallback;
  if (idleCallback) {
    const id = idleCallback(callback, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, timeoutMs);
  return () => window.clearTimeout(id);
}
