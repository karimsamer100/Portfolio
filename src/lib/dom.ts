export const $ = <T extends HTMLElement = HTMLElement>(id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
};

export const h = (tag: string, className = '', html = '') => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  return el;
};

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
