/**
 * Photo slots. Set a value to an imported image URL once Karim supplies the photo, e.g.
 *   import portrait from '../assets/photos/portrait.jpg';
 *   hero: portrait,
 * A null slot renders the hatched placeholder.
 */
export const photos: Record<'hero' | 'campus' | 'atWork', string | null> = {
  hero: null,
  campus: null,
  atWork: null,
};
