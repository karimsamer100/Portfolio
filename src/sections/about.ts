import { $ } from '../lib/dom';
import { seg } from '../lib/math';
import { addScene } from '../lib/scroll-engine';
import { initSlot } from '../lib/photo-slot';
import { photos } from '../content/photos';

/** Statement lights up word by word; the two photos drift at different speeds. */
export function initAbout() {
  const statement = $('statement');
  const ph1 = $('ph1');
  const ph2 = $('ph2');
  initSlot(ph1, photos.campus, 'Preview a campus photo');
  initSlot(ph2, photos.atWork, 'Preview a photo at work');

  const split = (node: Node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType !== Node.TEXT_NODE) {
        split(n);
        continue;
      }
      const frag = document.createDocumentFragment();
      for (const w of (n.textContent ?? '').split(/(\s+)/)) {
        if (!w) continue;
        if (/^\s+$/.test(w)) frag.append(w);
        else {
          const s = document.createElement('span');
          s.textContent = w;
          frag.append(s);
        }
      }
      n.replaceWith(frag);
    }
  };
  split(statement);
  const words = [...statement.querySelectorAll('span')];

  addScene({
    el: $('about'),
    rest: 1,
    update(p) {
      const k = seg(p, 0.08, 0.8) * words.length;
      words.forEach((w, i) => (w.style.opacity = i < k ? '1' : '.14'));
      ph1.style.transform = `translateY(${(0.5 - p) * 60}px)`;
      ph2.style.transform = `translateY(${(0.5 - p) * -50}px)`;
    },
  });
}
