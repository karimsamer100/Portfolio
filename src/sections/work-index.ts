import { $, esc, h } from '../lib/dom';
import { projects } from '../content/projects';

/** "Selected work": one row per project; each row opens that project's chapter. */
export function initWorkIndex(open: (index: number, from: MouseEvent | null, trigger?: HTMLElement) => void) {
  const rows = $('rows');
  projects.forEach((p, i) => {
    const row = h('button', 'row');
    row.setAttribute('type', 'button');
    row.dataset.i = String(i);
    row.innerHTML = `
      <span class="n mono">${String(i + 1).padStart(2, '0')}</span>
      <span class="t"><b>${esc(p.name)}</b><span>${esc(p.summary)}</span><span class="mono muted">${esc(p.meta)}</span></span>
      <span class="fig"><strong>${esc(p.figure)}</strong><small class="mono">${esc(p.figureLabel)}</small></span>
      <span class="go-arrow" aria-hidden="true">→</span>`;
    row.addEventListener('click', (e) => open(i, e.detail ? e : null, row));
    rows.append(row);
  });
}
