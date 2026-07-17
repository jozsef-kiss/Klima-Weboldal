/**
 * KLÍMAPAJZS – Főoldali „…Ft-tól" szekció generátor
 * ==================================================
 * A legolcsóbb KOMPLETT klímaszett bruttó árát írja be az index.html
 * marker-kommentjei közé. Csak klímaszettekre számol (a beltéri
 * részegységek önmagukban nem működő klímák → megtévesztő lenne).
 *
 * FUTTATÁS: node inject-price-from.js
 *
 * Marker-alapú, idempotens: bármikor újrafuttatható, ha az árak változnak.
 */

const fs = require("fs");
const path = require("path");

const products = require("./js/kp-products.js");

// A determineKivitel logika duplikálva (a script standalone) — filter.js-szel azonos.
function determineKivitel(productName) {
  const name = productName.toLowerCase();
  if (/klíma\s?szett/.test(name)) return "klímaszett";
  if (name.includes("kültéri egység") || name.includes("kültéri")) return "kültéri";
  if (name.includes("beltéri egység")) return "beltéri";
  if (name.includes("beltéri") && name.includes("egységhez")) return "kültéri";
  if (name.includes("beltéri")) return "beltéri";
  return "ismeretlen";
}

// 1-4) Min. ár CSAK komplett klímaszettekből
const szettek = products.filter((p) => determineKivitel(p.name) === "klímaszett");
if (szettek.length === 0) {
  console.error("❌ Nincs egyetlen klímaszett sem a terméklistában. Leállás.");
  process.exit(1);
}

const min = Math.min(...szettek.map((p) => p.price));
const minProduct = szettek.find((p) => p.price === min);

// Kerekítés NINCS. A sima (U+00A0) csoportosító szóközt &nbsp;-re cseréljük.
const amount = min.toLocaleString("hu-HU").replace(/\s/g, "&nbsp;") + " Ft-tól";
const brandCount = new Set(products.map((p) => p.brand)).size;
const modelCount = products.length;

console.log(
  "✅ Minimum ár: " +
    min.toLocaleString("hu-HU") +
    " Ft (id " +
    minProduct.id +
    " — " +
    minProduct.name +
    ")"
);

// 5) index.html marker-alapú csere. CRLF sorvégek — byte-azonosság a fájllal.
const START = "<!-- KP:PRICE_FROM_START -->";
const END = "<!-- KP:PRICE_FROM_END -->";
const EOL = "\r\n";

const lines = [
  '    <section class="section-kp price-from-section" id="arak-tol">',
  '      <div class="container">',
  '        <div class="row align-items-center">',
  '          <div class="col-lg-7">',
  '            <p class="price-from-eyebrow">Átlátható árak, rejtett költségek nélkül</p>',
  '            <h2 class="price-from-title">',
  "              Klímaberendezések már",
  '              <span class="price-from-amount">' + amount + "</span>",
  "            </h2>",
  '            <p class="price-from-note">',
  "              A készülék bruttó ára. A beszerelés díja a helyszíni felmérés után,",
  "              egyedi ajánlatban — így pontosan azt fizeti, amire szüksége van.",
  "            </p>",
  '            <div class="price-from-actions">',
  '              <a href="/felmeres.html" class="btn-kp-primary">Ingyenes ajánlatot kérek</a>',
  '              <a href="/klimaberendezesek.html" class="btn-kp-link">Összes klíma megtekintése →</a>',
  "            </div>",
  "          </div>",
  '          <div class="col-lg-5">',
  '            <ul class="price-from-trust">',
  '              <li><i class="fa fa-search" aria-hidden="true"></i> Ingyenes helyszíni felmérés</li>',
  '              <li><i class="fa fa-shield" aria-hidden="true"></i> Hivatalos, garanciális beszerelés</li>',
  '              <li><i class="fa fa-th-large" aria-hidden="true"></i> ' +
    brandCount +
    " márka, " +
    modelCount +
    " modell raktárkészletről</li>",
  "            </ul>",
  "          </div>",
  "        </div>",
  "      </div>",
  "    </section>",
];

const sectionHtml = EOL + lines.join(EOL) + EOL + "    ";

const indexPath = path.join(__dirname, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const re = new RegExp(START + "[\\s\\S]*?" + END);
if (!re.test(html)) {
  console.error("⚠️ Nem találhatók a KP:PRICE_FROM markerek az index.html-ben.");
  process.exit(1);
}

html = html.replace(re, START + sectionHtml + END);
fs.writeFileSync(indexPath, html, "utf8");

console.log("✅ index.html frissítve (" + brandCount + " márka, " + modelCount + " modell)");
