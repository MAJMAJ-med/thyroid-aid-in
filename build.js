"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = __dirname;
process.chdir(root);

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "dist"), { recursive: true });

const babelEntry = path.join(
  root,
  "node_modules",
  "@babel",
  "cli",
  "bin",
  "babel.js",
);
if (!fs.existsSync(babelEntry)) {
  console.error(
    "Missing Babel CLI. Run npm install in this folder, then npm run build.",
  );
  process.exit(1);
}

execFileSync(
  process.execPath,
  [babelEntry, "app_v3.jsx", "--out-file", "dist/app_v3.js"],
  { stdio: "inherit", cwd: root },
);

for (const file of [
  "index.html",
  "styles_v3.css",
  "content_v3.json",
  ".nojekyll",
]) {
  fs.copyFileSync(path.join(root, file), path.join(root, "dist", file));
}
