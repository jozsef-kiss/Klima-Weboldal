/**
 * KLÍMAPAJZS – Kulcsüzenet script injektáló
 * ===========================================
 * Beilleszti a kp-kulcsuzenet.js script taget
 * minden HTML fájl </head> tagjába.
 *
 * FUTTATÁS: node inject-kulcsuzenet.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP_DIRS = ["node_modules", ".git"];
const SKIP_FILES = [
  "inject-kulcsuzenet.js",
  "inject-footer.js",
  "inject-footer-css.js",
  "inject-components.js",
  "update-css-version.js",
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

// A script tag – abszolút útvonal, minden aloldalon működik
const SCRIPT_TAG = '<script src="/js/kp-kulcsuzenet.js" defer></script>';

console.log("\n🚀 Kulcsüzenet script injektáló\n" + "=".repeat(40));

const files = getAllHtmlFiles(ROOT);
console.log(`📄 HTML fájlok: ${files.length}\n`);

let ok = 0,
  skip = 0,
  err = 0;

files.forEach((filePath) => {
  try {
    let html = fs.readFileSync(filePath, "utf8");

    // Ha már benne van, kihagyjuk
    if (html.includes("kp-kulcsuzenet.js")) {
      console.log("  ⏭ ", path.relative(ROOT, filePath));
      skip++;
      return;
    }

    // Beillesztés </head> elé
    if (!html.includes("</head>")) {
      console.log("  ⚠️  Nincs </head>:", path.relative(ROOT, filePath));
      err++;
      return;
    }

    html = html.replace("</head>", `  ${SCRIPT_TAG}\n</head>`);
    fs.writeFileSync(filePath, html, "utf8");
    console.log("  ✅", path.relative(ROOT, filePath));
    ok++;
  } catch (e) {
    console.error("  ❌", path.relative(ROOT, filePath), "-", e.message);
    err++;
  }
});

console.log("\n" + "=".repeat(40));
console.log(`✅ Beillesztve: ${ok}`);
console.log(`⏭  Már kész: ${skip}`);
console.log(`❌ Hiba: ${err}`);
console.log("\n📋 Töltsd fel:");
console.log("   - js/kp-kulcsuzenet.js  (a script maga)");
console.log("   - az összes módosított HTML fájlt\n");
