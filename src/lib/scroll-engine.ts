import { clamp } from './math';

/**
 * Pinned scroll scenes. Each scene is a tall section whose sticky stage is driven by
 * progress 0..1 (how far the section has scrolled past the top of the viewport).
 */
export interface Scene {
  el: HTMLElement;
  update: (p: number) => void;
  /** Progress used for the static reduced-motion rendering. */
  rest: number;
}

const scenes: Scene[] = [];
const extras: (() => void)[] = [];
let queued = false;

export function progressOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const travel = el.offsetHeight - innerHeight;
  return travel <= 0 ? (r.top <= 0 ? 1 : 0) : clamp(-r.top / travel);
}

export function addScene(scene: Scene) {
  scenes.push(scene);
}

/** Per-frame work that is not a pinned scene (belts, progress bar). */
export function onFrame(fn: () => void) {
  extras.push(fn);
}

export function tick() {
  queued = false;
  for (const s of scenes) {
    if (s.el.getClientRects().length === 0) continue; // hidden (e.g. closed project)
    const r = s.el.getBoundingClientRect();
    if (r.bottom < -innerHeight * 0.2 || r.top > innerHeight * 1.2) continue;
    s.update(progressOf(s.el));
  }
  extras.forEach((fn) => fn());
}

export function requestTick() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(tick);
  }
}

export function renderRest() {
  scenes.forEach((s) => s.update(s.rest));
  extras.forEach((fn) => fn());
}

export function watch(target: EventTarget) {
  target.addEventListener('scroll', requestTick, { passive: true });
}
