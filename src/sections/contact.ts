import { $, reducedMotion } from '../lib/dom';
import { clamp, easeOut } from '../lib/math';
import { onFrame } from '../lib/scroll-engine';
import { site } from '../content/site';

/** Closing lock-up: the ink line signs off as the section arrives; email is copyable text. */
export function initContact() {
  const mail = $('mail');
  const copy = $('copyMail');
  const section = $('contact');
  const line = document.getElementById('endPath') as unknown as SVGPathElement;
  mail.textContent = site.email;
  line.style.strokeDasharray = '1';

  copy.addEventListener('click', () => {
    navigator.clipboard.writeText(site.email).then(
      () => (copy.textContent = 'Copied'),
      () => {
        const range = document.createRange();
        range.selectNodeContents(mail);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        copy.textContent = 'Selected, press copy';
      },
    );
  });

  onFrame(() => {
    const r = section.getBoundingClientRect();
    line.style.strokeDashoffset = reducedMotion ? '0' : String(1 - easeOut(clamp(1 - r.top / (innerHeight * 0.7))));
  });
}
