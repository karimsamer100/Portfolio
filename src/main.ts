import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/work-index.css';
import './styles/viewer.css';
import './styles/experience.css';
import './styles/learning.css';
import './styles/contact.css';
import './styles/reduced-motion.css';

import { reducedMotion } from './lib/dom';
import { previewEnabled } from './lib/photo-slot';
import { renderRest, tick, watch } from './lib/scroll-engine';
import { initChrome } from './sections/chrome';
import { initHero } from './sections/hero';
import { initAbout } from './sections/about';
import { initWorkIndex } from './sections/work-index';
import { initViewer } from './sections/viewer';
import { initExperience } from './sections/experience';
import { initLearning } from './sections/learning';
import { initContact } from './sections/contact';

const root = document.documentElement;
if (reducedMotion) root.classList.add('rm');
if (previewEnabled) root.classList.add('preview-on');

initChrome();
const hero = initHero();
initAbout();
const viewer = initViewer();
initWorkIndex(viewer.open);
const experience = initExperience();
initLearning(!reducedMotion);
initContact();

/** Layout-dependent measurements, re-run on resize. */
const layouts: (() => void)[] = [hero.fit, experience.build];

function layout() {
  layouts.forEach((fn) => fn());
  if (reducedMotion) {
    renderRest();
    experience.revealAll();
  } else tick();
}

if (!reducedMotion) {
  watch(window);
  watch(viewer.viewer);
}
let resizeTimer = 0;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(layout, 120);
});

/** Measure only after the display faces are in, otherwise the name is fitted with fallback metrics. */
const fontsReady = document.fonts
  ? Promise.all([
      document.fonts.load('900 100px "Archivo Variable"'),
      document.fonts.load('700 40px "Reem Kufi"', 'كريم'),
    ]).catch(() => undefined)
  : Promise.resolve();

fontsReady.then(() => {
  layout();
  hero.intro(tick);
});
