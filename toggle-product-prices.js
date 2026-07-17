/**
 * KLÍMAPAJZS – Terméklap ár-kapcsoló injektáló
 * =============================================
 * A termekek/*.html (95 db) ársávját alakítja át úgy, hogy az ár és az
 * ajánlatkérő CTA is a DOM-ban legyen; a láthatóságot a <html> osztálya
 * (kp-config.js / kp-prices.css) dönti el.
 *
 * FUTTATÁS: node toggle-product-prices.js
 *
 * Idempotens: ha a fájl már tartalmazza a "kp-price" stringet, kihagyja.
 * A markup mindkét állapotot kiszolgálja, így visszacsinálni nem kell semmit.
 */

const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "termekek");

// A) Az ár-div megkapja a kp-price osztályt (csak a hanna-price-bar blokkon belül)
const RE_PRICE_CLASS = /(hanna-price-bar"[\s\S]{0,200}?<div class="col-auto fw-bold px-4)(">)/;

// B) Ajánlatkérő CTA blokk beszúrása közvetlenül az ár-div záró tagje után
const RE_QUOTE_ANCHOR = /(<\/strong><\/div>)(<div class="col-auto"><a href="\/felmeres\.html)/;
const QUOTE_BLOCK =
  '<div class="col-auto px-4 kp-quote-cta kp-quote-note"><strong>Ajánlatot kérek</strong>Az ár a helyszíni felmérés után, egyedi ajánlatban.</div>';

// C) A meglévő ajánlatkérő gombra rákerül a ?termek=<id> paraméter
const RE_QUOTE_BTN = /<a href="\/felmeres\.html" class="hanna-quote-btn">/;

// D) <head> beszúrás a main.min.css UTÁN
const RE_HEAD = /(<link rel="stylesheet" href="\.\.\/css\/main\.min\.css\?v=2026" \/>)/;
const HEAD_INJECT =
  '<link rel="stylesheet" href="/css/kp-prices.css?v=2026" /><script src="/js/kp-config.js?v=2026"></script>';

// Migráció: a korábbi (verzió nélküli) kp-config.js hivatkozás cache buster-re
// cserélése a már feldolgozott fájlokban is.
const CONFIG_UNVERSIONED = "/js/kp-config.js\"";
const CONFIG_VERSIONED = "/js/kp-config.js?v=2026\"";

let modified = 0;
let migrated = 0;
let skipped = 0;
let errored = 0;

const files = fs
  .readdirSync(DIR)
  .filter((f) => /^\d+\.html$/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));

files.forEach((file) => {
  const id = parseInt(file, 10);
  const filePath = path.join(DIR, file);
  let html = fs.readFileSync(filePath, "utf8");

  // Idempotencia: ha már kész, nem alakítjuk át újra — de a régi, verzió nélküli
  // kp-config.js hivatkozást cache buster-re cseréljük (migráció).
  if (html.includes("kp-price")) {
    if (html.includes(CONFIG_UNVERSIONED)) {
      html = html.split(CONFIG_UNVERSIONED).join(CONFIG_VERSIONED);
      fs.writeFileSync(filePath, html, "utf8");
      console.log("🔁 termekek/" + file + " — kp-config.js ?v=2026 frissítve");
      migrated++;
    } else {
      console.log("⏭️  termekek/" + file + " — már kész");
      skipped++;
    }
    return;
  }

  // Ellenőrzés: megvan-e minden szükséges minta
  if (
    !RE_PRICE_CLASS.test(html) ||
    !RE_QUOTE_ANCHOR.test(html) ||
    !RE_QUOTE_BTN.test(html) ||
    !RE_HEAD.test(html)
  ) {
    console.log("⚠️  termekek/" + file + " — nem található az ársáv");
    errored++;
    return;
  }

  // A) kp-price osztály
  html = html.replace(RE_PRICE_CLASS, "$1 kp-price$2");
  // B) CTA blokk beszúrása az ár-div után
  html = html.replace(RE_QUOTE_ANCHOR, "$1" + QUOTE_BLOCK + "$2");
  // C) ?termek=<id> a gombra
  html = html.replace(
    RE_QUOTE_BTN,
    '<a href="/felmeres.html?termek=' + id + '" class="hanna-quote-btn">'
  );
  // D) head css + config
  html = html.replace(RE_HEAD, "$1" + HEAD_INJECT);

  fs.writeFileSync(filePath, html, "utf8");
  console.log("✅ termekek/" + file + " — módosítva");
  modified++;
});

console.log("\n──────────────────────────────");
console.log("Módosítva: " + modified);
console.log("Migrálva : " + migrated);
console.log("Kihagyva : " + skipped);
console.log("Hibás    : " + errored);
console.log("──────────────────────────────");

if (errored > 0) {
  console.error("\n❌ HIBA: " + errored + " fájlnál nem található az ársáv. Leállás.");
  process.exit(1);
}
if (modified + migrated + skipped !== files.length) {
  console.error(
    "\n❌ HIBA: nem mind a(z) " +
      files.length +
      " fájl lett feldolgozva (feldolgozva: " +
      (modified + migrated + skipped) +
      "). Leállás."
  );
  process.exit(1);
}
console.log("\n✅ Kész.");
