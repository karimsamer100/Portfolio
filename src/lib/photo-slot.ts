/**
 * Photo slots render a real image when one is configured, otherwise a hatched placeholder.
 * In dev (or with ?preview in the URL) a slot also accepts a local file so photos can be
 * previewed in place; nothing is uploaded.
 */
export const previewEnabled = import.meta.env.DEV || new URLSearchParams(location.search).has('preview');

export function setImage(host: HTMLElement, url: string) {
  let img = host.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    host.prepend(img);
  }
  img.src = url;
  host.classList.add('has');
}

export function enablePreview(label: HTMLElement, onImage: (url: string) => void, ariaLabel: string) {
  if (!previewEnabled) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.className = 'vh';
  input.setAttribute('aria-label', ariaLabel);
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) onImage(URL.createObjectURL(file));
  });
  label.prepend(input);
}

export function initSlot(slot: HTMLElement, url: string | null, ariaLabel: string) {
  if (url) setImage(slot, url);
  enablePreview(slot, (u) => setImage(slot, u), ariaLabel);
}
