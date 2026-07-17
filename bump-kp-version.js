/**
 * KLÍMAPAJZS – KP asset verzióbumpoló
 * ===================================
 * A KP feature-flag assetek (?v=) cache buster verzióját írja át MINDEN
 * HTML fájlban (gyökér + minden almappa, pl. termekek/). Erre azért van
 * szükség, mert a .htaccess 1 hónapig cache-eli a JS/CSS fájlokat: a
 * SHOW_PRICES átbillentése (js/kp-config.js) csak akkor ér el a visszatérő
 * látogatókhoz, ha a hivatkozásban a ?v= verzió is változik.
 *
 * FUTTATÁS:
 *   node bump-kp-version.js 2027
 *   node bump-kp-version.js            (argumentum nélkül: aktuális év)
 *
 * Idempotens: ugyanazzal a verzióval kétszer futtatva a fájlok byte-azonosak.
 * A verzió nélküli hivatkozásokra is ráteszi a ?v=<verzió>-t.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP_DIRS = ["node_modules", ".git", ".venv", ".well-known", ".claude"];

// Ezeknek az asseteknek a verzióját bumpoljuk (a SHOW_PRICES-hoz kötődő KP réteg).
const ASSETS = [
  "kp-config.js",
  "kp-products.js",
  "kp-prefill.js",
  "kp-prices.css",
];

// node bump-kp-version.js 2027  ->  "2027" ; arg nélkül az aktuális év
const arg = process.argv[2];
const VERSION = arg && /^[\w.-]+$/.test(arg) ? arg : String(new Date().getFullYear());

if (arg && !/^[\w.-]+$/.test(arg)) {
  console.error('❌ Érvénytelen verzió: "' + arg + '". Csak betű/szám/pont/kötőjel.');
  process.exit(1);
}

// Csak VALÓDI hivatkozásokat cserélünk (src/href attribútum értékében):
// egy útvonal-elválasztó "/" ELŐZI meg és az attribútumot záró '"' KÖVETI.
// Így a kommentekben/szövegben előforduló asset-nevekhez nem nyúlunk.
// Alak:  /<path>/<asset>            -> /<path>/<asset>?v=<VERSION>
//        /<path>/<asset>?v=<régi>   -> /<path>/<asset>?v=<VERSION>
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ASSET_RE = new RegExp(
  "(/(?:" + ASSETS.map(escapeRe).join("|") + "))(\\?v=[\\w.-]+)?(?=\")",
  "g"
);

function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((entry) => {
    if (SKIP_DIRS.includes(entry)) return;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) getAllHtmlFiles(full, files);
    else if (entry.endsWith(".html")) files.push(full);
  });
  return files;
}

console.log("\n🚀 KP verzióbumpoló – cél verzió: ?v=" + VERSION + "\n" + "=".repeat(44));

const files = getAllHtmlFiles(ROOT);
let changed = 0;
let unchanged = 0;

files.forEach((filePath) => {
  const html = fs.readFileSync(filePath, "utf8");
  const updated = html.replace(ASSET_RE, "$1?v=" + VERSION);

  if (updated !== html) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("  ✅ " + path.relative(ROOT, filePath));
    changed++;
  } else {
    unchanged++;
  }
});

console.log("\n" + "=".repeat(44));
console.log("Módosítva     : " + changed);
console.log("Nem változott : " + unchanged);
console.log("=".repeat(44));
console.log(
  "\nℹ️  Ha a SHOW_PRICES-t is átbillentetted (js/kp-config.js), töltsd fel\n" +
    "    az összes módosított HTML-t + a js/css fájlokat a szerverre.\n"
);
