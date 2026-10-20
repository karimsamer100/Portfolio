import { $, reducedMotion } from '../lib/dom';
import { onFrame } from '../lib/scroll-engine';
import { site } from '../content/site';

/** Fixed header, outbound links and the bottom scroll-progress hairline. */
export function initChrome() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((a) => {
    a.href = site[a.dataset.link as keyof typeof site];
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-go]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      $(a.dataset.go!).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }),
  );
  const bar = $('bar');
  onFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  });
}
