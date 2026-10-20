import { clamp, easeInOut, easeOut, seg } from '../../lib/math';
import { h } from '../../lib/dom';
import type { Chapter } from './types';

const DIGIT_PATH = 'M 78 92 C 86 46 196 38 202 100 C 208 152 126 186 74 238 L 212 236';
/** Illustrative softmax output for the drawn "2" (labelled as illustrative on the page). */
const PROBS = [0.01, 0.02, 0.81, 0.05, 0.01, 0.01, 0.01, 0.04, 0.03, 0.01];
const ACCURACY = 89.21; // phase 2 test accuracy, softmax regression, 10 classes

/** A pen stroke draws a digit, it pixelates onto a 28×28 grid, then the classifier answers. */
export function mnist(): Chapter {
  let gx: CanvasRenderingContext2D;
  let digit: SVGPathElement;
  let acc: Text;
  let bars: HTMLElement[] = [];
  const cells = new Float32Array(784);

  function drawGrid(r: number) {
    const s = 20;
    gx.clearRect(0, 0, 560, 560);
    gx.strokeStyle = `rgba(12,14,18,${0.12 * Math.min(1, r * 4)})`;
    gx.lineWidth = 1;
    for (let i = 0; i <= 28; i++) {
      gx.beginPath();
      gx.moveTo(i * s + 0.5, 0);
      gx.lineTo(i * s + 0.5, 560);
      gx.stroke();
      gx.beginPath();
      gx.moveTo(0, i * s + 0.5);
      gx.lineTo(560, i * s + 0.5);
      gx.stroke();
    }
    const k = r * (784 + 120); // fill cells in reading order with a soft leading edge
    for (let i = 0; i < 784; i++) {
      const v = cells[i];
      if (v <= 0.02) continue;
      const a = clamp((k - i) / 120);
      if (a <= 0) continue;
      gx.fillStyle = `rgba(12,14,18,${v * a})`;
      gx.fillRect((i % 28) * s + 1, ((i / 28) | 0) * s + 1, s - 1, s - 1);
    }
  }

  return {
    visualFirst: true,
    mount(copy, visual) {
      const big = h('div', 'big', '0.00%<small>Test accuracy · all ten digits · softmax regression</small>');
      acc = big.firstChild as Text;
      const probs = h('div', 'probs');
      probs.innerHTML = PROBS.map((_, i) => `<div${i === 2 ? ' class="top"' : ''}><i></i><span>${i}</span></div>`).join('');
      bars = [...probs.querySelectorAll<HTMLElement>('i')];
      copy.append(big, probs, h('p', 'note', 'Bars are illustrative. 99.95% on the binary 0-vs-1 task.'));

      visual.classList.add('pixel');
      visual.setAttribute('aria-hidden', 'true');
      visual.innerHTML = `<canvas width="560" height="560"></canvas><svg viewBox="0 0 280 280"><path pathLength="1" d="${DIGIT_PATH}"/></svg>`;
      gx = visual.querySelector('canvas')!.getContext('2d')!;
      digit = visual.querySelector('path')!;
      digit.style.strokeDasharray = '1';

      // Rasterise the stroke to 28×28 coverage values, as MNIST would see it.
      const off = document.createElement('canvas');
      off.width = off.height = 280;
      const ox = off.getContext('2d', { willReadFrequently: true })!;
      ox.lineWidth = 24;
      ox.lineCap = ox.lineJoin = 'round';
      ox.stroke(new Path2D(DIGIT_PATH));
      const px = ox.getImageData(0, 0, 280, 280).data;
      for (let y = 0; y < 28; y++)
        for (let x = 0; x < 28; x++) {
          let s = 0;
          for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) s += px[((y * 10 + j) * 280 + x * 10 + i) * 4 + 3];
          cells[y * 28 + x] = s / (100 * 255);
        }
    },

    update(p) {
      digit.style.strokeDashoffset = String(1 - easeInOut(seg(p, 0.04, 0.3)));
      drawGrid(seg(p, 0.3, 0.6));
      digit.style.opacity = String(1 - 0.85 * seg(p, 0.42, 0.6));
      const b = easeOut(seg(p, 0.6, 0.84));
      bars.forEach((el, i) => (el.style.transform = `scaleY(${PROBS[i] * b})`));
      acc.nodeValue = `${(ACCURACY * easeOut(seg(p, 0.6, 0.86))).toFixed(2)}%`;
    },
  };
}
