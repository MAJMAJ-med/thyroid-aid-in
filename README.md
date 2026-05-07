# AID-IN Thyroid Nodule Decision Tool — Alpha (WashU Medicine)

Static site for GitHub Pages: pre-built React (JSX transpiled at deploy time), with copy and numbers loaded from JSON at runtime.

## Files

- `index.html` — entry point (loads `./app_v3.js`, `./styles_v3.css`, fetches `./content_v3.json`)
- `app_v3.jsx` — React source (edit UX here)
- `build.js` — creates `dist/`: transpiles JSX → `app_v3.js`, copies static assets
- `babel.config.json` — `@babel/preset-react` with **classic** runtime (required for React UMD globals)
- `styles_v3.css` — WashU Medicine palette + type system
- `content_v3.json` — clinical copy and numbers (edit without changing JSX; each deploy copies the latest file into `dist/`)
- `.nojekyll` — disables Jekyll on GitHub Pages; **copied into `dist/`** by the build
- `package.json` — npm scripts and Babel devDependencies

## Build

```bash
npm install   # generates package-lock.json — commit this file so GitHub Actions can run npm ci
npm run build
```

Output is **`dist/`** — that folder is what gets deployed.

Local preview (required for `fetch`; `file://` will not work):

```bash
python3 -m http.server 8000 --directory dist
# http://localhost:8000/
```

## Publish with GitHub Actions

1. Create a repo and push **this folder as the repo root** (these files at top level).
2. **Settings → Pages → Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”).
3. Pushes to **`main`** run `.github/workflows/deploy.yml`, build `dist/`, and deploy the artifact.

Pages URL shape: `https://<username>.github.io/<repo>/`

### Content edits

Change `content_v3.json`, commit, and push. CI rebuilds (JSX unchanged) and uploads a fresh `dist/` including the updated JSON. You do **not** need to edit `app_v3.jsx` for copy-only changes.

Numbers are verbatim from the study team's source document. Do not paraphrase numeric estimates without the study team's review.

## Notes

- All patient responses live in `sessionStorage` on the device. Nothing is sent to a server.
- This is an alpha research prototype. **Not for clinical use outside of the AID-IN study.**

### Common pitfalls

| Issue | What to check |
|--------|----------------|
| Broken assets on a **project** site | Use **relative** URLs (`./app_v3.js`, not `/app_v3.js`). |
| Blank app on Pages | Deploy **`dist/`** output, not raw `app_v3.jsx`; run `npm run build` in CI. |
| `fetch` fails locally | Do not open `index.html` via `file://`; serve `dist/` over HTTP. |

©2026 Washington University School of Medicine
