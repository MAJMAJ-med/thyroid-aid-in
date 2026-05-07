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

const vendorDir = path.join(root, "dist", "vendor");
fs.mkdirSync(vendorDir, { recursive: true });

const vendorCopies = [
  [
    path.join(root, "node_modules", "react", "umd", "react.production.min.js"),
    path.join(vendorDir, "react.production.min.js"),
  ],
  [
    path.join(
      root,
      "node_modules",
      "react-dom",
      "umd",
      "react-dom.production.min.js",
    ),
    path.join(vendorDir, "react-dom.production.min.js"),
  ],
];
for (const [src, dest] of vendorCopies) {
  if (!fs.existsSync(src)) {
    console.error(
      `Missing vendor source: ${src}\nInstall dependencies: npm install`,
    );
    process.exit(1);
  }
  fs.copyFileSync(src, dest);
}

for (const file of [
  "index.html",
  "styles_v3.css",
  "content_v3.json",
  ".nojekyll",
]) {
  fs.copyFileSync(path.join(root, file), path.join(root, "dist", file));
}
