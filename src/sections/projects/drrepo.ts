import { easeInOut, seg } from '../../lib/math';
import { mountBeats, type Chapter } from './types';
import summary from '../../assets/drrepo/summary.webp';
import fixplan from '../../assets/drrepo/fixplan.webp';
import ready from '../../assets/drrepo/ready.webp';
import arch from '../../assets/drrepo/arch.webp';

const BEATS: [string, string][] = [
  ['A second opinion for any Python repo.', 'Point DrRepo at a local folder or a public GitHub URL. It picks a safe way to look: static analysis for code you don’t trust, local tests for code you do, or a locked-down Docker sandbox.'],
  ['Score is not certainty.', 'Ruff, Bandit, Radon, pytest, coverage, a README audit and a structure audit feed one evidence model. When a tool can’t run, confidence drops instead of the code being called clean.'],
  ['A fix plan, not a wall of warnings.', 'Findings become ordered actions with steps and a success check, tuned to the goal: portfolio, library, production API or ML project. An optional AI advisor may only cite verified evidence.'],
  ['Ready to ship?', 'Release readiness is scored on its own across CI/CD, containers, deployment, secrets, observability, release hygiene and reproducibility, with blockers and the next step.'],
  ['Where the risk lives.', 'Without running the code it maps modules into layers, finds import cycles and ranks risk hotspots by centrality, complexity and test evidence.'],
];

/** [image, alt, zoom, x%, y%]: beat two zooms into the score panel of the summary screen. */
const SHOTS: [string, string, number, number, number][] = [
  [summary, 'DrRepo summary view with verdict, observed score and evidence confidence', 1, 0, 0],
  [summary, 'Observed score and evidence confidence shown separately', 2.2, -71.7, -29],
  [fixplan, 'DrRepo fix plan with ordered actions and success checks', 1, 0, 0],
  [ready, 'Release readiness across seven dimensions', 1, 0, 0],
  [arch, 'Architecture map and ranked risk hotspots', 1, 0, 0],
];
const CAPS = ['Summary', 'Score and confidence', 'Fix Plan', 'Release readiness', 'Architecture and hotspots'];

/** Real captures of DrRepo auditing its own repository, one capability per beat. */
export function drrepo(): Chapter {
  let beat: (p: number) => number;
  let shots: HTMLElement[] = [];
  let cap: HTMLElement;
  return {
    mount(copy, visual) {
      beat = mountBeats(copy, BEATS);
      copy.insertAdjacentHTML('beforeend', '<div class="modes mono"><span>Quick Safe</span><span>Deep Local</span><span>Deep Isolated</span></div>');
      visual.innerHTML = `
        <div class="screen">
          <div class="bar"><i></i><i></i><i></i><span class="mono">DrRepo · Repository audit</span></div>
          ${SHOTS.map(([src, alt]) => `<div class="shot"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></div>`).join('')}
        </div>
        <span class="mono muted shot-cap"></span>`;
      shots = [...visual.querySelectorAll<HTMLElement>('.shot')];
      cap = visual.querySelector('.shot-cap')!;
    },
    update(p) {
      const i = beat(p);
      const local = seg(p, 0.02 + (i * 0.96) / 5, 0.02 + ((i + 1) * 0.96) / 5);
      shots.forEach((s, k) => {
        s.classList.toggle('on', k === i);
        const img = s.firstElementChild as HTMLElement;
        const [, , z, x, y] = SHOTS[k];
        if (k === 4) img.style.transform = `translateY(${-Math.max(0, img.offsetHeight - s.clientHeight) * easeInOut(local)}px)`;
        else img.style.transform = k === i ? `scale(${z}) translate(${x}%,${y}%)` : '';
      });
      cap.textContent = `Real capture · ${CAPS[i]} · DrRepo auditing its own repository`;
    },
  };
}
