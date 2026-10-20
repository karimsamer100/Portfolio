import { $ } from '../lib/dom';
import { easeOut, seg } from '../lib/math';
import { addScene } from '../lib/scroll-engine';

/** A short introduction lights up word by word, then the three numbered facts settle in. */
export function initAbout() {
  const statement = $('statement');
  const facts = [...$('aboutFacts').children] as HTMLElement[];

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
      const k = seg(p, 0.06, 0.5) * words.length;
      words.forEach((w, i) => (w.style.opacity = i < k ? '1' : '.14'));
      facts.forEach((f, i) => {
        const t = easeOut(seg(p, 0.48 + i * 0.1, 0.66 + i * 0.1));
        f.style.opacity = String(t);
        f.style.transform = `translateY(${(1 - t) * 16}px)`;
      });
    },
  });
}
