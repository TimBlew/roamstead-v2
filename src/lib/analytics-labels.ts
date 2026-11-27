// Verified against next.config.js redirects and the public booking page listing map.
const listings: Record<string, string> = { '455635': 'Hygge House', 'house-midway': 'Hygge House', '455631': 'Granary', 'granary-midway': 'Granary', '455632': 'The Lowell', 'lowell-302': 'The Lowell', '455633': 'Powder Room', 'powder-room': 'Powder Room' };
const properties: Record<string, string> = { 'hygge-house': 'Hygge House', granary: 'Granary', lowell: 'The Lowell', 'powder-room': 'Powder Room', senator: 'The Heber Senator' };
export function pageLabel(raw: string): string {
  let path = raw;
  try { path = new URL(raw, 'https://www.roamstead-co.com').pathname.replace(/\/$/, '') || '/'; } catch { return 'Unknown page'; }
  if (path === '/') return 'Homepage';
  if (path === '/properties') return 'All stays';
  if (path === '/book') return 'Book direct';
  const [, kind, id] = path.split('/');
  if (kind === 'listings') return listings[id] || `Listing ${id || 'unknown'}`;
  if (kind === 'properties' || kind === 'book') return (kind === 'book' ? 'Book: ' : '') + (properties[id] || 'Unknown property');
  return path;
}
export function sourceLabel(raw: string): string {
  return ({ parkcitysport: 'Park City Sport', google: 'Google', 'Direct / unknown': 'Direct / Unknown' } as Record<string, string>)[raw] || raw;
}
