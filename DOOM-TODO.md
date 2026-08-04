# DOOM page — follow-ups

Ordered roughly by payoff / effort. Nothing here is required; the page
already works.

## Small wins

- [ ] **Fullscreen button in the header bar.** Trivial — call
      `element.requestFullscreen()` on the `#dos` div.
- [ ] **Loading indicator.** The first boot fetches several MB. Show
      a "loading DOOM…" splash until the js-dos `ready` event fires,
      instead of a black rectangle.
- [ ] **Pointer-lock hint.** DOOM controls are easier with mouse look;
      add a one-line "click canvas to capture mouse" hint that hides
      after first click.
- [ ] **Keyboard hint.** Arrow keys / Ctrl / Space / Alt — most players
      won't remember the DOS defaults. One tiny cheat-sheet in the
      corner would go a long way.

## Reliability

- [ ] **Self-host the js-dos runtime.** Currently loaded from
      `v8.js-dos.com`. If that CDN moves or breaks, our page breaks.
      Vendor `js-dos.js` + `js-dos.css` into `public/vendor/js-dos/`
      and update the two `<link>` / `<script>` tags. Adds ~1 MB to the
      deploy but removes the external dependency.
- [ ] **Self-host the game bundle.** Same reasoning, bigger file
      (~2–4 MB). Best paired with switching to Freedoom or the shareware
      WAD so the license question is settled.
- [ ] **Content Security Policy.** If we ever add a CSP header we'll
      need to allow `v8.js-dos.com` (or the self-hosted origin) for
      script/style/worker sources.

## Fun extras

- [ ] **Quake as a second page.** `public/quake.html` with the same
      pattern using an Emscripten Quake port (heavier, real 3D).
- [ ] **A "poker chip skin" for DOOM.** Custom WAD swapping textures
      for green felt and playing cards. Firmly in "weekend joke"
      territory.
- [ ] **Achievement crossover.** Bust out of a poker hand → unlock a
      DOOM level. Pure vaporware, listed for completeness.

## Housekeeping

- [ ] **Move `DOOM.md` and `DOOM-TODO.md` into `docs/`** if the root
      starts feeling crowded.
- [ ] **Fix the two pre-existing lint errors** in
      `src/engine/gameState.js` (`getSmallBlindIndex` /
      `getBigBlindIndex` unused). Not related to DOOM, just noticed
      them during the build.
