import { easeInOut, mix, seg } from '../../lib/math';
import { mountBeats, type Chapter } from './types';
import mapUrl from '../../assets/sirengrid/nasr-city.json?url';

const BEATS: [string, string][] = [
  ['One tap. Fresh GPS.', 'A citizen asks for an ambulance, fire or police in one tap, or reports by voice or text in Egyptian Arabic. The incident goes live at once, without waiting for a second report.'],
  ['Planned on real streets.', 'The backend plans each response on the actual Nasr City road graph, with live traffic where available, and shows dispatchers the ETA and the reasoning.'],
  ['Don’t empty the city.', 'Before a unit leaves, it checks which zones would lose cover, weighted by population, and can reposition another unit to fill the gap.'],
  ['The hospital knows first.', 'It picks a receiving hospital by ETA and modelled capability, and pre-alerts it before the ambulance arrives.'],
  ['Roads close. Plans change.', 'When a road, resource or hospital changes, it replans. Every critical action still waits for a human to approve it.'],
];
const STEPS = ['Report', 'Route', 'Coverage', 'Hospital', 'Replan'];

interface MapData {
  W: number; H: number; cell: number; t1: number; t3: number;
  major: string; minor: string; res: string; boundary: string;
  route: string; toHosp: string; replan: string; travel: string;
  unit: number[]; inc: number[]; hosp: number[]; block: number[];
  cells: [number, number, number][];
}

const NS = 'http://www.w3.org/2000/svg';
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/**
 * An illustrative response drawn on the team's real Nasr City data: OpenStreetMap roads,
 * 416 WorldPop population zones and shortest paths computed on that road graph.
 */
export function sirengrid(): Chapter {
  let beat: (p: number) => number;
  let svg: SVGSVGElement;
  let eta: Text;
  let flow: HTMLElement[] = [];
  let m: ReturnType<typeof draw> | null = null;
  let loading = false;
  let last = 0;

  function el<K extends keyof SVGElementTagNameMap>(t: K, a: Record<string, string | number>, parent: Element = svg) {
    const e = document.createElementNS(NS, t);
    for (const k in a) e.setAttribute(k, String(a[k]));
    parent.append(e);
    return e;
  }

  function draw(d: MapData) {
    svg.setAttribute('viewBox', `-10 -10 ${d.W + 20} ${d.H + 20}`);
    const g = el('g', {});
    const maxPop = Math.max(...d.cells.map((c) => c[2]));
    const [ux, uy] = d.unit;
    const cells = d.cells.map(([x, y, pop]) => {
      const r = el('rect', { x: x - d.cell / 2, y: y - d.cell / 2, width: d.cell - 1, height: d.cell - 1, class: 'cell' }, g);
      const base = 0.02 + 0.11 * Math.sqrt(pop / maxPop);
      r.style.fillOpacity = String(base);
      return { r, base, near: Math.hypot(x - ux, y - uy) < 150 };
    });
    el('path', { d: d.res, class: 'res' });
    el('path', { d: d.minor, class: 'mi' });
    el('path', { d: d.major, class: 'ma' });
    el('path', { d: d.boundary, class: 'bd' });
    const route = el('path', { d: d.route, class: 'rt', pathLength: 1 });
    const travel = el('path', { d: d.travel, fill: 'none' });
    const toH = el('path', { d: d.toHosp, class: 'rt2', pathLength: 1 });
    const rep = el('path', { d: d.replan, class: 'rp', pathLength: 1 });
    const [ix, iy] = d.inc, [hx, hy] = d.hosp, [bx, by] = d.block;
    const pulses = [0, 1, 2].map(() => el('circle', { cx: ix, cy: iy, r: 0, class: 'pulse' }));
    el('circle', { cx: ix, cy: iy, r: 9, class: 'inc' });
    el('text', { x: ix + 16, y: iy - 12, class: 'lbl b' }).textContent = 'Incident';
    const unit = el('circle', { cx: ux, cy: uy, r: 9, class: 'unit' });
    el('text', { x: ux + 14, y: uy + 26, class: 'lbl' }).textContent = 'Unit A';
    const u2: [number, number, number, number] = [ux + 120, uy + 40, ux + 10, uy - 30];
    const unit2 = el('circle', { cx: u2[0], cy: u2[1], r: 8, class: 'unit2' });
    const hosp = el('g', { opacity: 0 });
    el('rect', { x: hx - 10, y: hy - 10, width: 20, height: 20, class: 'h-box' }, hosp);
    el('path', { d: `M${hx - 5} ${hy}h10M${hx} ${hy - 5}v10`, class: 'h-cross' }, hosp);
    const ring = el('circle', { cx: hx, cy: hy, r: 16, class: 'pulse' }, hosp);
    el('text', { x: hx + 18, y: hy - 14, class: 'lbl' }, hosp).textContent = 'Hospital · pre-alerted';
    const blk = el('g', { opacity: 0 });
    el('circle', { cx: bx, cy: by, r: 13, class: 'h-box' }, blk);
    el('path', { d: `M${bx - 6} ${by - 6}l12 12M${bx + 6} ${by - 6}l-12 12`, class: 'x' }, blk);
    el('text', { x: bx + 18, y: by + 28, class: 'lbl' }, blk).textContent = 'Road closed';
    return { d, cells, route, travel, toH, rep, pulses, unit, unit2, u2, hosp, ring, blk, len: travel.getTotalLength() };
  }

  function render(p: number) {
    const i = beat(p);
    flow.forEach((f, k) => f.classList.toggle('on', k <= i));
    if (!m) return;
    const { d } = m;
    const L = (k: number) => seg(p, 0.02 + k * 0.192, 0.02 + (k + 1) * 0.192);
    const t0 = L(0);
    m.pulses.forEach((c, k) => {
      const q = (t0 * 2.2 + k / 3) % 1;
      c.setAttribute('r', String(8 + q * 60));
      c.style.opacity = String((p < 0.4 ? 1 : 0) * (1 - q));
    });
    const r = easeInOut(L(1));
    m.route.style.strokeDashoffset = String(1 - r);
    let seconds = d.t1 * r;
    const cv = easeInOut(L(2)) * (1 - easeInOut(seg(p, 0.54, 0.6)));
    m.cells.forEach((c) => {
      if (!c.near) return;
      c.r.classList.toggle('lost', cv > 0.01);
      c.r.style.fillOpacity = String(cv > 0.01 ? 0.12 + 0.4 * cv : c.base);
    });
    const mv = easeInOut(seg(p, 0.5, 0.58));
    m.unit2.setAttribute('cx', String(mix(m.u2[0], m.u2[2], mv)));
    m.unit2.setAttribute('cy', String(mix(m.u2[1], m.u2[3], mv)));
    const h = easeInOut(L(3));
    m.hosp.setAttribute('opacity', String(seg(p, 0.58, 0.62)));
    m.toH.style.strokeDashoffset = String(1 - h);
    m.ring.setAttribute('r', String(16 + ((h * 3) % 1) * 14));
    m.ring.style.opacity = String(h < 1 ? 1 - ((h * 3) % 1) : 0);
    const rp = easeInOut(L(4));
    m.blk.setAttribute('opacity', String(seg(p, 0.78, 0.81)));
    m.rep.style.strokeDashoffset = String(1 - rp);
    m.route.style.opacity = String(p > 0.8 ? mix(1, 0.25, rp) : 1);
    const pt = p > 0.8 && m.len ? m.travel.getPointAtLength(m.len * seg(p, 0.8, 0.84)) : null;
    m.unit.setAttribute('cx', String(pt ? pt.x : d.unit[0]));
    m.unit.setAttribute('cy', String(pt ? pt.y : d.unit[1]));
    if (p > 0.8) seconds = mix(d.t1, d.t3, rp);
    eta.nodeValue = fmt(seconds);
  }

  return {
    mount(copy, visual) {
      copy.querySelector('.lbl')!.insertAdjacentHTML('afterend', `<div class="flow mono">${STEPS.map((s) => `<b>${s}</b>`).join('')}</div>`);
      flow = [...copy.querySelectorAll<HTMLElement>('.flow b')];
      beat = mountBeats(copy, BEATS);
      copy.insertAdjacentHTML('beforeend', '<div class="big eta">0:00<small>ETA to incident</small></div><span class="mono muted credit">Code Titans · IMPACT ECU 2026</span>');
      eta = copy.querySelector('.eta')!.firstChild as Text;
      visual.innerHTML = `<div class="map"><svg role="img" aria-label="Map of Nasr City with an illustrative emergency response: an incident, the ambulance route, a hospital pre-alert and a replanned route around a closed road."></svg></div>
        <span class="mono muted osm">Illustrative scenario · road data © OpenStreetMap contributors</span>`;
      svg = visual.querySelector('svg')!;
    },
    activate() {
      if (m || loading) return;
      loading = true;
      fetch(mapUrl)
        .then((r) => r.json() as Promise<MapData>)
        .then((d) => {
          m = draw(d);
          render(last);
        })
        .catch(() => (loading = false));
    },
    update(p) {
      last = p;
      render(p);
    },
  };
}
