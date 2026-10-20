import { $, esc, h, reducedMotion } from '../lib/dom';
import { previewEnabled } from '../lib/photo-slot';
import { credentials } from '../content/credentials';

/**
 * Credentials sit still on shelves grouped by field. Choosing one opens a full-screen viewer
 * (iris from the click point, like the project chapters) whose heading is that certificate's
 * title; arrows, swipe or ←/→ move through the deck and Escape returns to the shelf.
 */
export function initLearning() {
  const shelves = $('shelves');
  const viewer = $('cviewer');
  const stage = $('cvStage');
  const main = $('main');
  const tiles: HTMLElement[] = [];
  let current = 0;
  let opener: HTMLElement | null = null;
  let origin = { x: innerWidth / 2, y: innerHeight / 2 };

  const groups = [...new Set(credentials.map((c) => c.group))];
  for (const g of groups) {
    const shelf = h('div', 'shelf', `<h3 class="mono">${esc(g)}</h3>`);
    credentials.forEach((c, i) => {
      if (c.group !== g) return;
      const tile = h('button', 'tile');
      tile.setAttribute('type', 'button');
      tile.innerHTML = `<span class="mark" aria-hidden="true">${esc(c.mark)}</span><span><b>${esc(c.title)}</b><span>${esc(c.issuer)}${c.date ? ` · ${esc(c.date)}` : ''}</span><span class="open mono">View certificate →</span></span>`;
      tile.addEventListener('click', (e) => open(i, e.detail ? e : null, tile));
      shelf.append(tile);
      tiles[i] = tile;
    });
    shelves.append(shelf);
  }

  const cards = credentials.map((c) => {
    const card = h('div', 'cv-card');
    card.innerHTML = c.image
      ? `<img src="${c.image}" alt="${esc(c.title)} certificate, ${esc(c.issuer)}" loading="lazy" decoding="async">`
      : `<div class="in"><small class="mono">${esc(c.issuer)}</small><b>${esc(c.title)}</b>${c.date ? `<small class="mono">${esc(c.date)}</small>` : ''}${previewEnabled ? '<i class="mono">Certificate scan goes here</i>' : ''}</div>`;
    stage.append(card);
    return card;
  });
  const dots = credentials.map(() => $('cvDots').appendChild(h('i')));

  function show() {
    cards.forEach((c, i) => {
      const d = i - current;
      const near = Math.min(Math.abs(d), 2);
      c.style.opacity = d === 0 ? '1' : Math.abs(d) <= 2 ? (d < 0 ? '.5' : '.3') : '0';
      c.style.zIndex = String(10 - Math.abs(d));
      c.style.transform =
        d === 0
          ? 'translate(-50%,-50%)'
          : d < 0
            ? `translate(calc(-50% - ${near * 14}px),calc(-50% - ${near * 10}px)) rotate(${-near * 3}deg) scale(${1 - near * 0.04})`
            : `translate(calc(-50% + ${near * 110}%),-50%) scale(.9)`;
      c.setAttribute('aria-hidden', String(d !== 0));
    });
    const c = credentials[current];
    $('cvTitle').textContent = c.title;
    $('cvMeta').textContent = c.issuer + (c.date ? ` · ${c.date}` : '');
    $('cvIdx').textContent = `${String(current + 1).padStart(2, '0')} / ${String(credentials.length).padStart(2, '0')}`;
    dots.forEach((d, i) => d.classList.toggle('on', i === current));
  }

  const go = (step: number) => {
    current = (current + step + credentials.length) % credentials.length;
    show();
  };

  function open(i: number, from: MouseEvent | null, trigger: HTMLElement) {
    current = i;
    opener = trigger;
    const r = trigger.getBoundingClientRect();
    origin = from ? { x: from.clientX, y: from.clientY } : { x: r.left + 24, y: r.top + r.height / 2 };
    viewer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    main.inert = true;
    show();
    if (!reducedMotion) {
      viewer.style.transition = 'none';
      viewer.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
      viewer.getBoundingClientRect();
      viewer.style.transition = 'clip-path .8s cubic-bezier(.7,0,.2,1)';
      viewer.style.clipPath = `circle(${Math.hypot(innerWidth, innerHeight)}px at ${origin.x}px ${origin.y}px)`;
    }
    $('cvClose').focus({ preventScroll: true });
  }

  function close() {
    const done = () => {
      viewer.hidden = true;
      document.documentElement.style.overflow = '';
      main.inert = false;
      (tiles[current] ?? opener)?.focus({ preventScroll: true });
    };
    if (reducedMotion) return done();
    viewer.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
    setTimeout(done, 780);
  }

  $('cvClose').addEventListener('click', close);
  $('cvPrev').addEventListener('click', () => go(-1));
  $('cvNext').addEventListener('click', () => go(1));
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });
  let downX: number | null = null;
  stage.addEventListener('pointerdown', (e) => (downX = e.clientX));
  stage.addEventListener('pointerup', (e) => {
    if (downX !== null && Math.abs(e.clientX - downX) > 40) go(e.clientX < downX ? 1 : -1);
    downX = null;
  });
}
