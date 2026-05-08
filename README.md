# AID-IN Thyroid Nodule Decision Tool

AID-IN is a patient decision-support tool for people with indeterminate thyroid nodules. It is designed to support shared decision-making discussions with clinicians.

## Live site

- https://majmaj-med.github.io/thyroid-aid-in/

## Important notice

- This tool is for education and visit preparation.
- It does not diagnose conditions or replace medical advice.
- Patients should make care decisions with their clinical team.

## Privacy

- Answers are stored only in the browser session (`sessionStorage`) on the local device.
- Data is not transmitted to a backend service by this application.

## Content updates

Most patient-facing text and numeric estimates are maintained in:

- `content_v3.json`

Updating this JSON file and pushing to `main` republishes the updated content via GitHub Pages.

## Technical notes (maintainers)

- Static GitHub Pages app.
- `app_v3.jsx` is transpiled at build time to `dist/app_v3.js`.
- `react` and `react-dom` UMD files are copied into `dist/vendor/` so runtime does not depend on external CDNs.

Build locally:

```bash
npm install
npm run build
```

