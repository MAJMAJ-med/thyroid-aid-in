# Publish this folder as a new GitHub repository

This directory is the **canonical** copy of the AID-IN decision aid (moved out of the `majresearch` monorepo). Run the steps below on your machine.

## 1. Log in to GitHub CLI (one-time)

```bash
export PATH="/usr/local/bin:$PATH"
gh auth login
```

Choose GitHub.com, HTTPS or SSH as you prefer, and finish the browser/device flow.

## 2. Create the remote repo and push `main`

From **this folder**:

```bash
cd ~/Dev/thyroid-aid-in
```

If you have **no commit yet** (no `.git` directory):

```bash
git init -b main
git add .
git status   # confirm node_modules/ and dist/ are NOT staged (they are gitignored)
git commit -m "Initial import: AID-IN thyroid decision aid with GitHub Pages deploy"
```

Create the repo on GitHub and push (`thyroid-aid-in` → rename freely):

```bash
gh repo create thyroid-aid-in --public --source=. --remote=origin --push
```

**Private repo:** add `--private`.

**Manual alternative:** Create an empty repo at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/<YOUR_USERNAME>/thyroid-aid-in.git
git push -u origin main
```

## 3. GitHub Pages

In the **new repo** → **Settings** → **Pages** → **Build and deployment**:

- Set **Source** to **GitHub Actions**.

The workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) deploys **`dist/`** on every push to `main`.

## 4. Confirm the Actions run

Repo → **Actions** → latest **Deploy to GitHub Pages** workflow → green check.

Published URL (project site): `https://<username>.github.io/thyroid-aid-in/`
