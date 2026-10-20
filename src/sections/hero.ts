import { $, reducedMotion } from '../lib/dom';
import { easeIn, easeInOut, easeOut, mix, seg } from '../lib/math';
import { addScene } from '../lib/scroll-engine';
import { initSlot } from '../lib/photo-slot';
import { photos } from '../content/photos';

/**
 * Opening: a full-height portrait stands between the two words of the name (KARIM behind,
 * SAMER and the ink line in front). Scrolling splits and condenses the name, sinks the portrait, then thickens the line until it floods the screen
 * with ink, handing over to the About act.
 */
export function initHero() {
  const stage = $('heroStage');
  const en1 = $('en1');
  const en2 = $('en2');
  const ar = $('arName');
  const mid = $('heroMid');
  const portrait = $('portrait');
  const foot = stage.querySelector<HTMLElement>('.hero-foot')!;
  const svg = document.getElementById('heroSvg') as unknown as SVGSVGElement;
  const path = document.getElementById('heroPath') as unknown as SVGPathElement;
  let W = 0;
  let H = 0;

  initSlot(portrait, photos.hero, 'Preview the hero with a portrait');

  function fit() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const gutter = parseFloat(getComputedStyle(en1).paddingLeft) * 2;
    for (const e of [en1, en2]) {
      e.style.fontStretch = '125%';
      e.style.fontSize = '100px';
    }
    const widest = Math.max(...[en1, en2].map((e) => e.querySelector('.en-clip span')!.getBoundingClientRect().width));
    const size = Math.min(((W - gutter) / widest) * 100 * 0.98, H * 0.27);
    for (const e of [en1, en2]) e.style.fontSize = `${size}px`;
    ar.style.fontSize = `${Math.min(size * 0.52, H * 0.15)}px`;
    const names = $('names').getBoundingClientRect();
    const y = names.bottom - stage.getBoundingClientRect().top - ar.offsetHeight * 0.16;
    path.setAttribute(
      'd',
      `M -60 ${y + 10} C ${W * 0.22} ${y - 26}, ${W * 0.36} ${y + 30}, ${W * 0.55} ${y + 4} S ${W * 0.86} ${y - 18}, ${W + 60} ${y + 8}`,
    );
  }

  function update(p: number) {
    const a = easeInOut(seg(p, 0, 0.5));
    en1.style.fontStretch = en2.style.fontStretch = `${125 - 50 * a}%`;
    en1.style.transform = `translateX(${-a * W * 0.62}px)`;
    en2.style.transform = `translateX(${a * W * 0.62}px)`;
    ar.style.transform = `translateX(${-easeInOut(seg(p, 0, 0.4)) * W * 0.45}px)`;
    ar.style.opacity = String(1 - seg(p, 0.18, 0.34));

    // The portrait holds while the name splits, then sinks back as the line takes over.
    const pf = seg(p, 0.12, 0.42);
    portrait.style.opacity = stage.classList.contains('ld') ? '' : String(1 - easeOut(pf));
    portrait.style.transform = `translateX(-50%) translateY(${pf * 8}%) scale(${1 - pf * 0.06})`;

    mid.style.opacity = String(seg(p, 0.3, 0.44) * (1 - seg(p, 0.56, 0.66)));
    mid.style.transform = `translateY(calc(-50% + ${(1 - seg(p, 0.3, 0.48)) * 30}px))`;

    const g = easeIn(seg(p, 0.55, 0.97));
    path.style.strokeWidth = `${3 + g * Math.max(W, H) * 2.6}px`;
    const c = seg(p, 0.62, 0.9);
    path.style.stroke = `rgb(${mix(34, 12, c)},${mix(52, 14, c)},${mix(212, 18, c)})`;
    foot.style.opacity = String(1 - seg(p, 0.05, 0.2));
  }

  /** Load intro: letters rise, the ink line draws itself. No scroll lock, no preloader. */
  function intro(done: () => void) {
    path.style.strokeDasharray = '1';
    if (reducedMotion) {
      stage.classList.remove('ld');
      path.style.strokeDashoffset = '0';
      return done();
    }
    path.style.strokeDashoffset = '1';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        stage.classList.add('go');
        stage.classList.remove('ld');
        path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.6,0,.2,1) .35s';
        path.style.strokeDashoffset = '0';
        setTimeout(() => {
          path.style.transition = '';
          stage.classList.remove('go');
          done();
        }, 2100);
      }),
    );
  }

  addScene({ el: $('hero'), update, rest: 0 });
  return { fit, intro };
}
