import { $, esc } from '../lib/dom';
import { onFrame } from '../lib/scroll-engine';
import { credentials } from '../content/credentials';

/** Two credential belts that slide in opposite directions with scroll (not on a timer). */
export function initLearning(animated: boolean) {
  const section = $('learning');
  const belts = [$('belt1'), $('belt2')];
  belts.forEach((ul, i) => {
    const items = credentials[i].map(([t, s]) => `<li><b>${esc(t)}</b><span class="mono">${esc(s)}</span></li>`).join('');
    // Two hidden copies make the loop seamless; screen readers get the list once.
    const copy = items.replace(/<li>/g, '<li aria-hidden="true">');
    ul.innerHTML = animated ? items + copy + copy : items;
  });
  if (!animated) return;
  onFrame(() => {
    const r = section.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const t = (innerHeight - r.top) * 0.45;
    const [a, b] = belts;
    const wa = a.scrollWidth / 3;
    const wb = b.scrollWidth / 3;
    a.style.transform = `translateX(${-(t % wa)}px)`;
    b.style.transform = `translateX(${-wb + (t % wb)}px)`;
  });
}
