# Karim Samer — portfolio

A scroll-driven personal site built with Vite and TypeScript. There are no runtime dependencies. One blue ink line runs through the whole page, and paper and ink sections alternate. Each project opens as its own pinned scroll chapter.

The approved visual reference is `docs/prototype/approved-v2.html`. Treat it as the source of truth for look and motion.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. Photo slots are clickable here so you can preview local photos. |
| `npm run build` | Typecheck, then a production build into `dist/`. |
| `npm run preview` | Serves `dist/` on port 4173. |
| `npm run test:e2e` | Playwright tests on desktop and mobile, including reduced motion. Run `npm run build` first. |
| `node scripts/screenshots.mjs <url> <dir> [w h]` | Captures frames of the main page at fixed scroll points. |
| `node scripts/viewer-shots.mjs <url> <dir> [w h]` | Captures each project chapter at several progress points. |

## Where things live

```
index.html                 Static markup for the hero, about, section shells and contact
src/content/               All copy and data. Edit these files to update the site.
  site.ts                  Name, email and outbound links. Never add the phone number.
  projects.ts              Index rows, chapter copy and dossier facts
  experience.ts            Timeline stops (an optional `photo` sets the background)
  credentials.ts           The two "Always learning" belts
  photos.ts                Hero and about photos (null shows a placeholder)
src/lib/scroll-engine.ts   Pinned scenes: each gets progress 0..1 while its section scrolls
src/sections/              One module per section; projects/ holds one module per chapter visual
src/styles/                tokens.css (palette, fonts), then one stylesheet per section
src/assets/fonts/          Self-hosted OFL fonts (Archivo variable, Reem Kufi, IBM Plex)
```

## Conventions

- **Motion.** A scene's `update(p)` must depend only on `p`, so scrolling backwards replays it exactly. Animate with transforms and opacity. The hero's `font-stretch` is the one deliberate exception.
- **Reduced motion.** `.rm` on `<html>` turns off pinning and renders every scene at its `rest` progress. Each new scene needs a readable rest state.
- **Adding a project.** Add an entry to `src/content/projects.ts`. Then write a chapter module in `src/sections/projects/` that implements `Chapter` (`mount` and `update`) and register it in `CHAPTERS` in `src/sections/viewer.ts`.
- **Adding photos.** Put them in `src/assets/photos/`, import them in `src/content/photos.ts` or `experience.ts`, and they replace the placeholders.
- **Honesty.** Every number on the site comes from the linked repositories. Group work is labelled as group work. Mark anything still unconfirmed with `todo: true` until Karim confirms it.

## Open items before launch

- Real photos: the portrait, campus, at work, and one per experience stop.
- Karim's own role in each project. The dossier shows "To confirm" until this is set.
- An `og:image` social card and a final domain.
