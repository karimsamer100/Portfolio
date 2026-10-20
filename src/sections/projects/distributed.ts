import { easeOut, seg } from '../../lib/math';
import { h } from '../../lib/dom';
import type { Chapter } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** Per-node completions in the 1,000-request load-aware run (project README). */
const NODES = [
  ['A', 70, 531],
  ['B', 210, 404],
  ['C', 350, 65],
] as const;
const DOTS = 90;
const START = 0.08;
const END = 0.62;
const T_IN = 0.05;
const T_BRANCH = 0.07;

/** Requests travel the ink line into the scheduler and fan out to three workers. */
export function distributed(): Chapter {
  let counter: Text;
  let compare: HTMLElement;
  let barRR: HTMLElement;
  let barLA: HTMLElement;
  const paths: Record<string, SVGPathElement> = {};
  const lengths: Record<string, number> = {};
  const nodes: { n: number; num: SVGTextElement; glow: SVGCircleElement }[] = [];
  const dots: SVGCircleElement[] = [];
  const assign: number[] = [];

  return {
    mount(copy, visual) {
      const big = h('div', 'big', '0<small>requests completed · 0 failed</small>');
      counter = big.firstChild as Text;
      copy.append(big);

      visual.innerHTML = `
        <svg viewBox="0 0 600 420" role="img" aria-label="Requests flow into a scheduler and are routed to three worker nodes. Node A completed 531, node B 404, node C 65.">
          <path data-k="in" d="M 0 210 L 146 210" stroke="#7E8BFF" stroke-width="2" fill="none"/>
          <path data-k="0" d="M 214 210 C 330 210 360 70 494 70" stroke="#2A2F38" stroke-width="2" fill="none"/>
          <path data-k="1" d="M 214 210 L 494 210" stroke="#2A2F38" stroke-width="2" fill="none"/>
          <path data-k="2" d="M 214 210 C 330 210 360 350 494 350" stroke="#2A2F38" stroke-width="2" fill="none"/>
          <circle cx="180" cy="210" r="34" fill="#0C0E12" stroke="#E8E9E3" stroke-width="2"/>
          <text x="180" y="266" text-anchor="middle" class="d-lbl">Scheduler</text>
          <text x="180" y="280" text-anchor="middle" class="d-lbl">load-aware</text>
          <g class="nodes"></g><g class="dots"></g>
        </svg>
        <div class="compare">
          <span class="mono muted">Avg latency at 1,000 requests</span>
          <div class="cmp-row"><span>Round Robin</span><b></b><span>16.69 s</span></div>
          <div class="cmp-row win"><span>Load-Aware</span><b></b><span>12.48 s</span></div>
          <span class="mono">~25% lower latency · ~27% higher throughput</span>
        </div>`;
      visual.querySelectorAll<SVGPathElement>('path[data-k]').forEach((p) => {
        paths[p.dataset.k!] = p;
        lengths[p.dataset.k!] = p.getTotalLength();
      });
      const nodeGroup = visual.querySelector('.nodes')!;
      for (const [k, y, n] of NODES) {
        const g = document.createElementNS(SVG_NS, 'g');
        g.innerHTML = `<circle cx="520" cy="${y}" r="24" fill="#0C0E12" stroke="#E8E9E3" stroke-width="2"/><circle class="glow" cx="520" cy="${y}" r="24" fill="#7E8BFF" opacity="0"/><text x="552" y="${y - 6}" class="d-lbl">Node ${k}</text><text x="552" y="${y + 20}" class="d-num">0</text>`;
        nodeGroup.append(g);
        nodes.push({ n, num: g.querySelector('.d-num')!, glow: g.querySelector('.glow')! });
      }
      // Deterministic weighted round-robin so dots split 531 : 404 : 65.
      const count = [0, 0, 0];
      for (let i = 0; i < DOTS; i++) {
        let best = 0;
        let deficit = -Infinity;
        NODES.forEach(([, , n], k) => {
          const d = (n / 1000) * (i + 1) - count[k];
          if (d > deficit) [deficit, best] = [d, k];
        });
        count[best]++;
        assign.push(best);
      }
      const dotGroup = visual.querySelector('.dots')!;
      for (let i = 0; i < DOTS; i++) {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('r', '3.2');
        c.setAttribute('fill', '#7E8BFF');
        dotGroup.append(c);
        dots.push(c);
      }
      compare = visual.querySelector('.compare')!;
      [barRR, barLA] = [...compare.querySelectorAll<HTMLElement>('b')];
    },

    update(p) {
      dots.forEach((c, i) => {
        const t = p - (START + (END - START) * (i / DOTS));
        let pt: DOMPoint | null = null;
        if (t >= 0 && t < T_IN) pt = paths.in.getPointAtLength(lengths.in * (t / T_IN));
        else if (t >= T_IN && t < T_IN + T_BRANCH) {
          const k = String(assign[i]);
          pt = paths[k].getPointAtLength(lengths[k] * easeOut((t - T_IN) / T_BRANCH));
        }
        if (pt) {
          c.setAttribute('cx', String(pt.x));
          c.setAttribute('cy', String(pt.y));
          c.setAttribute('opacity', '1');
        } else c.setAttribute('opacity', '0');
      });
      const f = seg(p, START + T_IN + T_BRANCH, END + T_IN + T_BRANCH);
      counter.nodeValue = Math.round(f * 1000).toLocaleString('en-US');
      for (const o of nodes) {
        o.num.textContent = String(Math.round(f * o.n));
        o.glow.setAttribute('opacity', String((f > 0 && f < 1 ? 0.25 : 0) * (o.n / 531)));
      }
      const c = seg(p, 0.8, 0.93);
      compare.style.opacity = String(c);
      barRR.style.transform = `scaleX(${(easeOut(c) * 16.69) / 18})`;
      barLA.style.transform = `scaleX(${(easeOut(c) * 12.48) / 18})`;
    },
  };
}
