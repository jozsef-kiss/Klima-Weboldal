/**
 * KLÍMAPAJZS – CSS verziószám frissítő
 * =======================================
 * Minden HTML fájlban átírja:
 *   main.min.css?v=2025  →  main.min.css?v=2026
 *   main.min.css?v=2024  →  main.min.css?v=2026
 *   stb.
 *
 * FUTTATÁS: node update-css-version.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP_DIRS = ["node_modules", ".git"];
const SKIP_FILES = [
  "update-css-version.js",
  "inject-footer.js",
  "inject-footer-css.js",
  "inject-components.js",
];

function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((entry) => {
    if (SKIP_DIRS.includes(entry)) return;
    if (SKIP_FILES.includes(entry)) return;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) getAllHtmlFiles(full, files);
    else if (entry.endsWith(".html")) files.push(full);
  });
  return files;
}

console.log("\n🚀 CSS verziószám frissítő\n" + "=".repeat(40));

const files = getAllHtmlFiles(ROOT);
let ok = 0,
  skip = 0;

files.forEach((filePath) => {
  let html = fs.readFileSync(filePath, "utf8");

  // Replace any ?v=XXXX after main.min.css with ?v=2026
  const updated = html.replace(/(main\.min\.css)\?v=\d+/g, "$1?v=2026");

  if (updated !== html) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("  ✅", path.relative(ROOT, filePath));
    ok++;
  } else {
    skip++;
  }
});

console.log("\n" + "=".repeat(40));
console.log(`✅ Frissítve: ${ok}`);
console.log(`⏭  Nem változott: ${skip}`);
console.log("\nTöltsd fel az összes módosított HTML fájlt a szerverre!\n");
