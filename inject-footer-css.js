/**
 * KLÍMAPAJZS – Footer CSS link injektáló
 * =========================================
 * 1. Visszaállítja az eredeti main.min.css-t (eltávolítja a hozzáfűzött blokkot)
 * 2. Minden HTML fájlba beilleszti: <link href="/css/kp-footer.css" rel="stylesheet"/>
 *    a main.min.css link tagje UTÁ N
 *
 * FUTTATÁS: node inject-footer-css.js
 * A script gyökérből fut (ahol az index.html van)
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const SKIP_DIRS = ["node_modules", ".git"];
const SKIP_FILES = [
  "inject-footer-css.js",
  "inject-footer.js",
  "inject-components.js",
];

// ── 1. main.min.css visszaállítása ──────────────────────────────────────────
function restoreMainCss() {
  const cssPath = path.join(ROOT, "css", "main.min.css");
  if (!fs.existsSync(cssPath)) {
    console.log("⚠️  css/main.min.css nem található");
    return;
  }

  let css = fs.readFileSync(cssPath, "utf8");

  // Ha tartalmazza a hozzáfűzött :root{--kp-navy blokkot, levágjuk
  const cutMarker = ":root{--kp-navy";
  const idx = css.indexOf(cutMarker);
  if (idx !== -1) {
    fs.writeFileSync(cssPath + ".bak", css); // backup
    css = css.substring(0, idx).trimEnd();
    fs.writeFileSync(cssPath, css, "utf8");
    console.log("✅ css/main.min.css visszaállítva (", css.length, "byte)");
  } else {
    console.log("ℹ️  css/main.min.css már tiszta, nem módosítva");
  }
}

// ── 2. HTML fájlok összegyűjtése ────────────────────────────────────────────
function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((entry) => {
    if (SKIP_DIRS.includes(entry)) return;
    if (SKIP_FILES.includes(entry)) return;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      getAllHtmlFiles(full, files);
    } else if (entry.endsWith(".html")) {
      files.push(full);
    }
  });
  return files;
}

// ── 3. Link tag beillesztése ────────────────────────────────────────────────
// A /css/kp-footer.css mindig abszolút útvonal – minden aloldalon működik
const LINK_TAG = '<link href="/css/kp-footer.css" rel="stylesheet"/>';

function injectCssLink(filePath) {
  let html = fs.readFileSync(filePath, "utf8");

  // Ha már benne van, kihagyjuk
  if (html.includes("kp-footer.css")) {
    return "skip";
  }

  // Keressük a main.min.css link tagját (bármelyik verziószámmal)
  // pl: href="css/main.min.css?v=2026" vagy href="/css/main.min.css" stb.
  const mainCssPattern = /(<link[^>]+main\.min\.css[^>]*>)/i;
  const match = html.match(mainCssPattern);

  if (match) {
    // Beillesztjük UTÁN
    html = html.replace(match[0], match[0] + "\n  " + LINK_TAG);
  } else {
    // Ha nincs main.min.css, </head> elé szúrjuk
    if (html.includes("</head>")) {
      html = html.replace("</head>", "  " + LINK_TAG + "\n</head>");
    } else {
      return "no_head";
    }
  }

  fs.writeFileSync(filePath, html, "utf8");
  return "ok";
}

// ── Futtatás ────────────────────────────────────────────────────────────────
console.log("\n🚀 Klímapajzs – Footer CSS injektáló\n" + "=".repeat(45));

// 1. main.min.css visszaállítása
console.log("\n📦 main.min.css visszaállítása...");
restoreMainCss();

// 2. HTML fájlok frissítése
console.log("\n📄 HTML fájlok feldolgozása...");
const files = getAllHtmlFiles(ROOT);
console.log("Találatok:", files.length, "\n");

let ok = 0,
  skipped = 0,
  noHead = 0,
  err = 0;

files.forEach((filePath) => {
  try {
    const result = injectCssLink(filePath);
    const rel = path.relative(ROOT, filePath);
    if (result === "ok") {
      console.log("  ✅", rel);
      ok++;
    } else if (result === "skip") {
      console.log("  ⏭ ", rel, "(már benne van)");
      skipped++;
    } else if (result === "no_head") {
      console.log("  ⚠️ ", rel, "(nincs </head> tag)");
      noHead++;
    }
  } catch (e) {
    console.error("  ❌", path.relative(ROOT, filePath), "-", e.message);
    err++;
  }
});

console.log("\n" + "=".repeat(45));
console.log("✅ Sikeresen frissítve:", ok);
console.log("⏭  Már kész volt:", skipped);
console.log("⚠️  Nem találtam </head>:", noHead);
console.log("❌ Hiba:", err);
console.log("\n📋 Következő lépés:");
console.log("   Töltsd fel a szerverre:");
console.log("   - css/kp-footer.css  (új fájl)");
console.log("   - css/main.min.css   (visszaállított eredeti)");
console.log("   - az összes módosított .html fájlt\n");
