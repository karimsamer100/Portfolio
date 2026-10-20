import { imageAt } from './images';

/**
 * The hero portrait: a cut-out of Karim with a transparent background, saved as
 * src/assets/photos/portrait.webp (or .png). It is shown in full colour. While it is missing, the portrait is hidden on the
 * live site and shown as a silhouette in dev / ?preview.
 */
export const photos = {
  hero: imageAt('', 'portrait') ?? null,
};
