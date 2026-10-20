/**
 * Every image under src/assets/photos is picked up automatically at build time, so adding a
 * photo is just dropping a correctly named file in the right folder (see docs/IMAGES.md).
 */
const files = import.meta.glob<string>('../assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});

const entries = Object.entries(files).map(([path, url]) => {
  const rel = path.replace('../assets/photos/', '');
  const slash = rel.lastIndexOf('/');
  const name = rel.slice(slash + 1);
  return { dir: slash < 0 ? '' : rel.slice(0, slash), base: name.replace(/\.[^.]+$/, '').toLowerCase(), url };
});

/** The image named `base` (any extension) in `dir`, if present. */
export const imageAt = (dir: string, base: string) => entries.find((e) => e.dir === dir && e.base === base)?.url;

/** All images in `dir`, in file-name order (1, 2, 10 sort naturally). */
export const imagesIn = (dir: string) =>
  entries.filter((e) => e.dir === dir).sort((a, b) => a.base.localeCompare(b.base, undefined, { numeric: true }));
