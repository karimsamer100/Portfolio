import { $, esc, h } from '../lib/dom';
import { clamp, easeInOut, easeOut, mix } from '../lib/math';
import { addScene } from '../lib/scroll-engine';
import { enablePreview, previewEnabled, setImage } from '../lib/photo-slot';
import { experience } from '../content/experience';

/**
 * Horizontal timeline driven by vertical scroll. The ink line draws as the track moves;
 * the stop nearest the reading position swaps the oversized background (name or photo), and
 * each stop's image cards fan out while it is near the reading position.
 * On phones the track settles on each stop instead of gliding continuously.
 */
export function initExperience() {
  const stage = $('xstage');
  const track = $('track');
  const bgHost = $('xbgs');
  const svg = document.getElementById('xsvg') as unknown as SVGSVGElement;
  const line = document.getElementById('xpath') as unknown as SVGPathElement;
  let trackWidth = 0;
  let gap = 0;
  let start = 0;
  let stops: { el: HTMLElement; x: number; cards: HTMLElement[] }[] = [];

  const backgrounds = experience.map((s) => {
    const bg = h('div', 'x-bg', `<span>${esc(s.short)}</span>`);
    if (s.photo) setImage(bg, s.photo);
    bgHost.append(bg);
    return bg;
  });

  function build() {
    track.querySelectorAll('.stop,.yr').forEach((n) => n.remove());
    stops = [];
    const vw = stage.clientWidth;
    const vh = stage.clientHeight;
    const mobile = vw < 640;
    gap = Math.max(mobile ? vw * 0.74 : vw * 0.3, 280);
    start = vw * (mobile ? 0.12 : 0.42);
    const lineY = vh * (mobile ? 0.6 : 0.58);
    trackWidth = start + gap * (experience.length - 1) + vw * 0.7;
    track.style.width = `${trackWidth}px`;
    svg.setAttribute('width', String(trackWidth));
    svg.setAttribute('height', String(vh));
    svg.setAttribute('viewBox', `0 0 ${trackWidth} ${vh}`);
    let d = `M -20 ${lineY}`;
    for (let x = 0; x < trackWidth + 40; x += 160)
      d += ` Q ${x + 40} ${lineY + ((x / 160) % 2 ? 7 : -7)} ${x + 80} ${lineY} T ${x + 160} ${lineY}`;
    line.setAttribute('d', d);
    line.style.strokeDasharray = '1';

    experience.forEach((s, i) => {
      const x = start + gap * i;
      const stem = mobile ? 28 : 44;
      const up = i % 2 === 0;
      if (s.year) {
        const y = h('span', 'yr', s.year);
        y.style.left = `${x - gap * 0.28}px`;
        y.style.top = `${lineY}px`;
        y.setAttribute('aria-hidden', 'true');
        track.append(y);
      }
      const el = h('div', `stop off ${up ? 'up' : 'dn'}`);
      el.style.setProperty('--stem', `${stem}px`);
      el.innerHTML = `<span class="when mono">${esc(s.when)}</span><span class="org">${esc(s.org)}</span><span class="role">${esc(s.role)}</span>`;
      const shown = (s.images ?? []).filter((m) => m.src || previewEnabled);
      const pics = h('div', 'pics');
      for (const m of shown) {
        const c = h('div', `pic ${m.kind}`, m.src ? '' : `<span class="mono">${m.kind}</span>`);
        if (m.src) c.innerHTML = `<img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" decoding="async">`;
        pics.append(c);
      }
      if (shown.length) up ? el.prepend(pics) : el.append(pics);
      el.style.left = `${x}px`;
      if (up) el.style.bottom = `${vh - lineY + stem}px`;
      else el.style.top = `${lineY + stem}px`;
      const add = h('label', 'add mono', '+ Preview photo');
      enablePreview(add, (u) => setImage(backgrounds[i], u), `Preview a photo for ${s.org}`);
      if (add.querySelector('input')) el.append(add);
      track.append(el);
      stops.push({ el, x, cards: [...pics.children] as HTMLElement[] });
    });
  }

  function update(p: number) {
    const vw = stage.clientWidth;
    let shift: number;
    if (vw < 640) {
      const q = p * (experience.length - 1);
      const i = Math.min(experience.length - 2, Math.floor(q));
      shift = Math.max(0, start - vw * 0.1 + gap * (i + easeInOut(clamp((q - i - 0.2) / 0.6))));
    } else shift = (trackWidth - vw) * easeInOut(p);
    track.style.transform = `translateX(${-shift}px)`;
    line.style.strokeDashoffset = String(1 - clamp((shift + vw * 0.85) / trackWidth));
    let active = 0;
    let best = Infinity;
    stops.forEach((s, i) => {
      const sx = s.x - shift;
      s.el.classList.toggle('off', sx > vw * 0.88 || sx < -vw * 0.5);
      const focus = vw * (vw < 640 ? 0.12 : 0.4);
      const d = Math.abs(sx - focus);
      fan(s.cards, easeOut(clamp(1 - d / (vw * 0.32))));
      if (d < best) [best, active] = [d, i];
    });
    backgrounds.forEach((b, i) => b.classList.toggle('on', i === active));
  }

  /** Stacked while the stop is away, spread side by side while it is in focus. */
  function fan(cards: HTMLElement[], a: number) {
    const mid = (cards.length - 1) / 2;
    const step = stage.clientWidth < 640 ? 70 : 96;
    cards.forEach((c, j) => {
      c.style.transform = `translate(${mix(j * 6, j * step, a)}px,${mix(-j * 4, Math.abs(j - mid) * 4, a)}px) rotate(${mix((j - mid) * 5, (j - mid) * 2.4, a)}deg)`;
    });
  }

  addScene({ el: $('experience'), update, rest: 1 });
  return {
    build,
    /** Reduced motion shows every stop statically. */
    revealAll: () =>
      stops.forEach((s) => {
        s.el.classList.remove('off');
        fan(s.cards, 1);
      }),
  };
}
