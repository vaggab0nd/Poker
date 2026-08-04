# DOOM in a browser tab

A side quest attached to the poker app: a standalone page that boots
DOOM in the browser via [js-dos](https://js-dos.com/) v8.

## Where it lives

- `public/doom.html` — the whole thing. One HTML file with an embed
  script and a small header bar linking back to the poker app.
- `src/App.jsx` — a red "DOOM" link in the poker top bar opens
  `/doom.html` in a new tab.

Vite copies everything under `public/` into `dist/` at build time, so
after `npm run build` you get `dist/doom.html` alongside `dist/index.html`.

## How it's served

Firebase Hosting serves static files **before** applying the SPA
rewrite in `firebase.json`:

```json
"rewrites": [ { "source": "**", "destination": "/index.html" } ]
```

So `/doom.html` hits the real file and never bounces into the React app.
No config change needed.

## How it works at runtime

`doom.html` pulls two things from `v8.js-dos.com`:

1. `js-dos.css` and `js-dos.js` — the runtime (DOSBox compiled to WASM,
   plus the JS wrapper).
2. A DOOM game bundle (currently `DOOM-@evilution.zip` on the js-dos
   CDN). The `Dos()` constructor mounts it into the emulated filesystem
   and auto-runs the game.

All fetched from the user's browser, not from our server — we don't
proxy anything.

## Testing locally

```sh
npm run build
npm run preview
# open http://localhost:4173/doom.html
```

Or in dev:

```sh
npm run dev
# open http://localhost:5173/doom.html
```

## Swapping the game

Change one line in `public/doom.html`:

```js
Dos(document.getElementById('dos'), {
  url: 'https://js-dos.com/cdn/upload/DOOM-@evilution.zip',
  theme: 'dark',
});
```

Point `url` at any js-dos bundle (`.jsdos` or a zip containing a DOS
executable). js-dos publishes many, and you can build your own with
their studio tool.

## Legal note

Shipping the retail DOOM WAD publicly is not licensed. The
`DOOM-@evilution.zip` bundle above is what the js-dos demo page uses;
for a public deploy the safer options are the DOOM 1 shareware WAD
(freely redistributable) or the [Freedoom](https://freedoom.github.io/)
free-content replacement.
