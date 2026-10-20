import { easeOut, mix, seg } from '../../lib/math';
import { h } from '../../lib/dom';
import type { Chapter } from './types';

/** Category counts from the repo's eda_outputs/amazon_support_with_categories.csv (total 123,023). */
const CATEGORIES: [string, number][] = [
  ['delivery_shipping', 35111],
  ['other', 29278],
  ['general_support', 22001],
  ['refund_return', 14538],
  ['account_prime', 12190],
  ['device_app', 8506],
  ['damaged_missing_item', 1399],
];
const TOTAL = CATEGORIES.reduce((a, c) => a + c[1], 0);
const CENTERS = [[0.3, 0.42], [0.62, 0.3], [0.78, 0.62], [0.46, 0.72], [0.16, 0.74], [0.86, 0.22], [0.6, 0.88]];
const QUERY_POS = [0.335, 0.45];
/** The question is an illustrative example, labelled as such on the page. */
const QUESTION = 'My order says delivered but it never arrived. What can I do?';
const TOP_K = 5; // rag_pipeline.retrieve default

const spread = (v: number) => 0.05 + 0.07 * Math.sqrt(v / TOTAL);

/** A question drops into the embedding field and its five nearest cases light up. */
export function supportRag(): Chapter {
  let qtext: HTMLElement;
  let topk: HTMLElement;
  let cats: HTMLElement;
  let bars: HTMLElement[] = [];
  let ctx: CanvasRenderingContext2D;
  let W = 0;
  let H = 0;
  const points: [number, number, number][] = [];
  let nearest: number[] = [];

  function draw(drop: number, link: number) {
    ctx.clearRect(0, 0, W, H);
    for (const [x, y, ci] of points) {
      ctx.fillStyle = ci === 0 ? 'rgba(126,139,255,.55)' : 'rgba(232,233,227,.28)';
      ctx.fillRect(x * W - 2, y * H - 2, 4, 4);
    }
    const [qx, qyEnd] = QUERY_POS;
    if (drop > 0) {
      const qy = mix(-0.05, qyEnd, easeOut(drop));
      ctx.fillStyle = '#E8E9E3';
      ctx.beginPath();
      ctx.arc(qx * W, qy * H, 9, 0, 7);
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,233,227,.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qx * W, 0);
      ctx.lineTo(qx * W, qy * H - 10);
      ctx.stroke();
    }
    nearest.forEach((i, j) => {
      const t = seg(link, j / TOP_K, (j + 1) / TOP_K);
      if (t <= 0) return;
      const [x, y] = points[i];
      ctx.strokeStyle = '#7E8BFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qx * W, qyEnd * H);
      ctx.lineTo(mix(qx, x, t) * W, mix(qyEnd, y, t) * H);
      ctx.stroke();
      if (t >= 1) {
        ctx.fillStyle = '#E8E9E3';
        ctx.beginPath();
        ctx.arc(x * W, y * H, 7, 0, 7);
        ctx.fill();
        ctx.strokeStyle = '#7E8BFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
    ctx.font = '500 22px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(138,144,154,.9)';
    CATEGORIES.forEach(([name, v], ci) => {
      const [cx, cy] = CENTERS[ci];
      ctx.fillText(name, cx * W - 60, cy * H - spread(v) * H * 1.2 - 8);
    });
  }

  return {
    mount(copy, visual) {
      cats = h('div', 'cats');
      cats.innerHTML = CATEGORIES.map(
        ([n, v], i) => `<div class="cat${i === 0 ? ' on' : ''}"><span>${n}</span><b></b><span>${v.toLocaleString('en-US')}</span></div>`,
      ).join('');
      bars = [...cats.querySelectorAll<HTMLElement>('b')];
      copy.append(cats);

      visual.innerHTML = `
        <div class="query"><small>Example question</small><span></span></div>
        <canvas class="field-cv" width="1200" height="750" aria-label="A field of support cases grouped by category. The question lands among delivery cases and its five nearest neighbours light up."></canvas>
        <span class="mono muted topk">top_k = ${TOP_K} nearest cases retrieved · then passed to the LLM as context</span>`;
      qtext = visual.querySelector('.query span')!;
      topk = visual.querySelector('.topk')!;
      const canvas = visual.querySelector('canvas')!;
      ctx = canvas.getContext('2d')!;
      W = canvas.width;
      H = canvas.height;

      // Seeded scatter: one Gaussian blob per category, sized by its share of the data.
      let seed = 7;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      CATEGORIES.forEach(([, v], ci) => {
        const n = Math.max(14, Math.round((v / TOTAL) * 1400));
        const [cx, cy] = CENTERS[ci];
        for (let i = 0; i < n; i++) {
          const a = rand() * 6.283;
          const r = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * spread(v) * 0.55;
          points.push([cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r, ci]);
        }
      });
      nearest = points
        .map((p, i) => [Math.hypot(p[0] - QUERY_POS[0], p[1] - QUERY_POS[1]), i])
        .sort((a, b) => a[0] - b[0])
        .slice(0, TOP_K)
        .map((x) => x[1]);
    },

    update(p) {
      qtext.textContent = QUESTION.slice(0, Math.round(QUESTION.length * seg(p, 0.04, 0.24)));
      draw(seg(p, 0.26, 0.4), seg(p, 0.42, 0.66));
      topk.style.opacity = String(seg(p, 0.6, 0.68));
      const c = seg(p, 0.72, 0.9);
      cats.style.opacity = String(c);
      bars.forEach((b, i) => (b.style.transform = `scaleX(${(easeOut(c) * CATEGORIES[i][1]) / CATEGORIES[0][1]})`));
    },
  };
}
