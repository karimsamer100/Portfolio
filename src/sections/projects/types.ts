/** A project chapter's animated visual. `copy` is the text column, `visual` the other column. */
export interface Chapter {
  mount(copy: HTMLElement, visual: HTMLElement): void;
  update(p: number): void;
  /** Put the visual before the copy column (desktop) — used by MNIST. */
  visualFirst?: boolean;
  /** Called each time the chapter is shown; used to load heavy assets lazily. */
  activate?(): void;
}

/**
 * Beat chapters tell their story in a few short headlines that replace each other with scroll.
 * The chapter's own title stays in the DOM for assistive tech and as the reduced-motion heading.
 */
export function mountBeats(copy: HTMLElement, beats: [title: string, text: string][]) {
  copy.classList.add('beat-copy');
  const host = document.createElement('div');
  host.className = 'beats';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = beats.map(([t, x]) => `<div class="bt"><h3>${t}</h3><p>${x}</p></div>`).join('');
  copy.querySelector('.w-sub')!.after(host);
  const els = [...host.children] as HTMLElement[];
  return (p: number) => {
    const i = Math.min(els.length - 1, Math.floor(Math.min(0.999, Math.max(0, (p - 0.02) / 0.96)) * els.length));
    els.forEach((b, k) => b.classList.toggle('on', k === i));
    return i;
  };
}
