import { $, esc, h, reducedMotion } from '../lib/dom';
import { addScene, renderRest, tick } from '../lib/scroll-engine';
import { projects } from '../content/projects';
import type { Chapter } from './projects/types';
import { distributed } from './projects/distributed';
import { supportRag } from './projects/support-rag';
import { mnist } from './projects/mnist';

const CHAPTERS: Record<string, () => Chapter> = {
  distributed,
  'support-rag': supportRag,
  mnist,
};

/**
 * Project chapters open in a full-screen layer with an iris transition from the click point.
 * Each chapter is its own pinned scroll scene inside the layer, followed by a short dossier.
 */
export function initViewer() {
  const viewer = $('viewer');
  const close = $('vClose');
  const counter = $('vIdx');
  const main = $('main');
  const articles: HTMLElement[] = [];
  let opener: HTMLElement | null = null;
  let origin = { x: innerWidth / 2, y: innerHeight / 2 };

  projects.forEach((p, i) => {
    const chapter = CHAPTERS[p.id]();
    const article = h('article', 'proj');
    article.hidden = true;
    article.setAttribute('aria-labelledby', `p-${p.id}-t`);
    const next = projects[(i + 1) % projects.length];
    article.innerHTML = `
      <section class="scene proj-scene">
        <div class="stage p-stage pad${p.tone === 'paper' ? ' paper' : ''}">
          <div class="w-copy">
            <span class="lbl mono">Selected work · ${String(i + 1).padStart(2, '0')} &nbsp;/&nbsp; <span class="ar" lang="ar">أعمال</span></span>
            <h2 class="w-title" id="p-${p.id}-t">${esc(p.title)}</h2>
            <p class="w-sub">${esc(p.description)}</p>
          </div>
          <div class="visual"></div>
        </div>
      </section>
      <div class="dossier pad">
        <h3>The detail</h3>
        <dl class="facts">${p.facts
          .map((f) => `<div><dt class="mono">${esc(f.label)}</dt><dd${f.todo ? ' class="todo"' : ''}>${esc(f.text)}</dd></div>`)
          .join('')}</dl>
        <div class="ev"><a href="${p.repo}" target="_blank" rel="noopener">Repository ↗</a></div>
        <button class="next" type="button"><span class="mono">Next project</span><b>${esc(next.name)} →</b></button>
      </div>`;
    const stage = article.querySelector<HTMLElement>('.p-stage')!;
    const copy = article.querySelector<HTMLElement>('.w-copy')!;
    const visual = article.querySelector<HTMLElement>('.visual')!;
    chapter.mount(copy, visual);
    if (chapter.visualFirst) stage.prepend(visual);
    article.querySelector('.next')!.addEventListener('click', () => switchTo((i + 1) % projects.length));
    addScene({ el: article.querySelector<HTMLElement>('.proj-scene')!, update: chapter.update, rest: 1 });
    viewer.append(article);
    articles.push(article);
  });

  function show(i: number) {
    articles.forEach((a, j) => (a.hidden = j !== i));
    counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(articles.length).padStart(2, '0')}`;
    viewer.setAttribute('aria-label', projects[i].name);
    viewer.scrollTop = 0;
    if (reducedMotion) renderRest();
    else tick();
  }

  function open(i: number, from: MouseEvent | null, trigger?: HTMLElement) {
    opener = trigger ?? (document.activeElement as HTMLElement | null);
    origin = from ? { x: from.clientX, y: from.clientY } : { x: innerWidth / 2, y: innerHeight / 2 };
    viewer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    main.inert = true;
    show(i);
    if (!reducedMotion) {
      viewer.style.transition = 'none';
      viewer.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
      viewer.getBoundingClientRect();
      viewer.style.transition = 'clip-path .9s cubic-bezier(.7,0,.2,1)';
      viewer.style.clipPath = `circle(${Math.hypot(innerWidth, innerHeight)}px at ${origin.x}px ${origin.y}px)`;
    }
    close.focus({ preventScroll: true });
  }

  function shut() {
    const done = () => {
      viewer.hidden = true;
      document.documentElement.style.overflow = '';
      main.inert = false;
      opener?.focus({ preventScroll: true });
    };
    if (reducedMotion) return done();
    viewer.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
    setTimeout(done, 880);
  }

  function switchTo(i: number) {
    if (reducedMotion) return show(i);
    viewer.style.transition = 'opacity .35s';
    viewer.style.opacity = '0';
    setTimeout(() => {
      show(i);
      viewer.style.opacity = '1';
      close.focus({ preventScroll: true });
    }, 360);
  }

  close.addEventListener('click', shut);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !viewer.hidden) shut();
  });
  return { open, viewer };
}
