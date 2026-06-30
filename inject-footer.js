/**
 * KLÍMAPAJZS – Footer injektáló
 * ================================
 * Lecseréli a footert az összes HTML fájlban az egységes verzióra.
 * index.html kihagyva.
 *
 * FUTTATÁS: node inject-footer.js
 *
 * HA MÓDOSÍTANI KELL A FOOTERT:
 * 1. Szerkeszd a NEW_FOOTER konstanst lentebb
 * 2. Futtasd: node inject-footer.js
 * 3. Töltsd fel a módosított HTML fájlokat
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP_FILES = [
  "index.html",
  "inject-footer.js",
  "inject-navbar.js",
  "inject-footer-css.js",
  "inject-kulcsuzenet.js",
];
const SKIP_DIRS = ["node_modules", ".git"];

// ═══════════════════════════════════════════════════════════════
// ▼▼▼  ITT MÓDOSÍTSD A FOOTERT HA VÁLTOZTATNI KELL  ▼▼▼
// ═══════════════════════════════════════════════════════════════
const NEW_FOOTER = `
    <!-- FOOTER -->
    <div class="footer_container">
      <section class="info_section">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-lg-3 mb-4">
              <div class="footer-brand">
                <img alt="Klímapajzs" src="/images/logo3.webp?v=20250719145611" />
              </div>
              <p class="footer-tagline">Profi klímaszerelés Ózdon és Borsod megyében – garancia, pontosság, megbízhatóság.</p>
              <div class="footer-social">
                <a href="https://www.facebook.com/profile.php?id=61577604076573" title="Facebook"><span style="font-size: 1.1rem">f</span></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
              <div class="footer-col-title">Elérhetőség</div>
              <div class="contact_link_box">
                <a href="tel:+3648786590"><span class="fc-icon">📞</span> +36 30 905 9257</a>
                <a href="tel:+36308374346"><span class="fc-icon">📞</span> +36 30 837 4346</a>
                <a href="mailto:info@klimapajzs.hu"><span class="fc-icon">✉️</span> info@klimapajzs.hu</a>
                <a href="#"><span class="fc-icon">📍</span> 3662 Ózd-Somsályfő Telep 1.</a>
                <a href="#"><span class="fc-icon">🕐</span> H–P 8:00–17:00</a>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
              <div class="footer-col-title">Kiemelt területek</div>
              <div class="info_links">
                <a href="/klimaszereles-ozd.html">Klímaszerelés Ózd</a>
                <a href="/klimaszereles-eger.html">Klímaszerelés Eger</a>
                <a href="/klimaszereles-miskolc.html">Klímaszerelés Miskolc</a>
                <a href="/klimaszereles-tiszaujvaros.html">Klímaszerelés Tiszaújváros</a>
                <a href="/klimaszereles-arlo.html">Klímaszerelés Arló</a>
                <a href="/klimaszereles-putnok.html">Klímaszerelés Putnok</a>
                <a href="/klimaszereles-borsodnadasd.html">Klíma Borsodnádasd</a>
                <a href="/klimaszereles-banreve.html">Klímaszerelés Bánréve</a>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
              <div class="footer-col-title">Oldalak</div>
              <div class="info_links">
                <a href="/rolunk.html">Rólunk</a>
                <a href="/klima-szolgaltatasok-ozd.html">Szolgáltatásaink</a>
                <a href="/klimaberendezesek.html">Klímaberendezések</a>
                <a href="/h-tarifa-igenyles.html">H-tarifa igénylés</a>
                <a href="/reszletfizetes.html">Részletfizetés</a>
                <a href="/tippekestanacsok.html">Tippek és tanácsok</a>
                <a href="/gyik.html">GYIK</a>
                <a href="/contact.html">Kapcsolat</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-inner">
            <p>© 2026 Klímapajzs – Terra Forte Bau Kft. · Adószám: 23954780-2-05</p>
            <div style="display: flex; gap: 20px; flex-wrap: wrap">
              <a href="/aszf.html">ÁSZF</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
// ═══════════════════════════════════════════════════════════════
// ▲▲▲  FOOTER MÓDOSÍTÁS VÉGE  ▲▲▲
// ═══════════════════════════════════════════════════════════════

function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((entry) => {
    if (["node_modules", ".git"].includes(entry)) return;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      getAllHtmlFiles(full, files);
    } else if (entry.endsWith(".html") && !SKIP_FILES.includes(entry)) {
      files.push(full);
    }
  });
  return files;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");

  // Megkeressük a footer_container kezdetét
  const startMarker = '<div class="footer_container">';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return "no_footer";

  // Visszafelé keressük a <!-- FOOTER --> kommentet ha van
  const commentMarker = "<!-- FOOTER -->";
  const commentIdx = html.lastIndexOf(commentMarker, startIdx);
  const cutFrom =
    commentIdx !== -1 && startIdx - commentIdx < 100 ? commentIdx : startIdx;

  // Megkeressük a footer_container záró </div>-ját
  // A footer_container maga 4 szintű egymásba ágyazást tartalmaz:
  // footer_container > info_section > container > row + footer-bottom > container > footer-bottom-inner
  // Egyszerűbb: </body> vagy a következő <script> tag előtt zárjuk le
  const bodyIdx = html.indexOf("</body>", startIdx);
  const scriptAfterFooter = html.indexOf("<script", startIdx);

  let cutTo;
  if (scriptAfterFooter !== -1 && scriptAfterFooter < bodyIdx) {
    cutTo = scriptAfterFooter;
  } else {
    cutTo = bodyIdx;
  }

  if (cutTo === -1) return "no_footer";

  html =
    html.substring(0, cutFrom) + NEW_FOOTER + "\n\n" + html.substring(cutTo);

  fs.writeFileSync(filePath, html, "utf8");
  return "ok";
}

// ── Futtatás ─────────────────────────────────────────────────
console.log("\n🚀 Klímapajzs – Footer injektáló\n" + "=".repeat(45));
const files = getAllHtmlFiles(ROOT);
console.log("Feldolgozandó fájlok:", files.length, "\n");

let ok = 0,
  noFooter = 0,
  err = 0;

files.forEach((filePath) => {
  try {
    const result = processFile(filePath);
    const rel = path.relative(ROOT, filePath);
    if (result === "ok") {
      console.log("  ✅", rel);
      ok++;
    } else if (result === "no_footer") {
      console.log("  ⚠️ ", rel, "(nem találtam footert)");
      noFooter++;
    }
  } catch (e) {
    console.error("  ❌", path.relative(ROOT, filePath), "-", e.message);
    err++;
  }
});

console.log("\n" + "=".repeat(45));
console.log("✅ Sikeresen frissítve:", ok);
console.log("⚠️  Nem találtam footert:", noFooter);
console.log("❌ Hiba:", err);
console.log("\n📋 Feltöltendő: az összes módosított .html fájl\n");
