import { imageAt } from './images';

/**
 * The hero portrait: a cut-out of Karim with a transparent background, saved as
 * src/assets/photos/portrait.png (or .webp). While it is missing, the portrait is hidden on the
 * live site and shown as a silhouette in dev / ?preview.
 */
export const photos = {
  hero: imageAt('', 'portrait') ?? null,
};
