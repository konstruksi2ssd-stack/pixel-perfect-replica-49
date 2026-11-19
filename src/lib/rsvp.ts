export type Entry = { name: string; attend: string; count: number; message: string; at: number };
const KEY = "sl-wedding-rsvp";
export function loadEntries(): Entry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function addEntry(e: Entry): Entry[] {
  const list = [e, ...loadEntries()];
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}
