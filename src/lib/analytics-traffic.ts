/** Explicit operator opt-out; never infer internal traffic from unfamiliar source names. */
export function isInternalAnalyticsSession(context: { webdriver?: boolean; search?: string; storage?: Pick<Storage, 'getItem' | 'setItem'> | null }): boolean {
  if (context.webdriver === true) return true;
  try {
    if (new URLSearchParams(context.search || '').get('rs_analytics') === 'internal') {
      context.storage?.setItem('rs_analytics_internal', '1');
      return true;
    }
    return context.storage?.getItem('rs_analytics_internal') === '1';
  } catch { return new URLSearchParams(context.search || '').get('rs_analytics') === 'internal'; }
}
export function suppressInternalAnalytics(): boolean {
  if (typeof window === 'undefined') return false;
  // Retain an explicit marker in memory if browser storage is blocked.
  if (internal) return true;
  let storage: Storage | null = null;
  try { storage = window.sessionStorage; } catch { /* URL and webdriver still work. */ }
  internal = isInternalAnalyticsSession({ webdriver: navigator.webdriver, search: window.location.search, storage });
  return internal;
}
let internal = false;
