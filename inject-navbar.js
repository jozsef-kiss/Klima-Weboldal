/**
 * KLÍMAPAJZS – Navbar injektáló
 * ================================
 * Lecseréli a régi navbart az összes HTML fájlban.
 * index.html kihagyva.
 *
 * FUTTATÁS: node inject-navbar.js
 *
 * HA MÓDOSÍTANI KELL A NAVBART:
 * 1. Szerkeszd a NEW_NAVBAR konstanst lentebb
 * 2. Futtasd: node inject-navbar.js
 * 3. Töltsd fel a módosított HTML fájlokat
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SKIP_FILES = [
  "index.html",
  "inject-navbar.js",
  "inject-footer-css.js",
  "inject-kulcsuzenet.js",
];
const SKIP_DIRS = ["node_modules", ".git"];

// ═══════════════════════════════════════════════════════════════
// ▼▼▼  ITT MÓDOSÍTSD A NAVBART HA VÁLTOZTATNI KELL  ▼▼▼
// ═══════════════════════════════════════════════════════════════
const NEW_NAVBAR = `
    <!-- TOP INFO BAR -->
    <div class="top-info-bar">
      <div class="container">
        <div class="top-info-text d-flex flex-wrap align-items-center justify-content-center justify-content-md-between" style="gap: 12px">
          <div class="d-flex flex-wrap" style="gap: 12px">
            <a href="tel:+3648786590"><i class="fa fa-phone"></i> +36 48 786 590</a>
            <a href="tel:+36308374346"><i class="fa fa-phone"></i> +36 30 837 4346</a>
            <span><i class="fa fa-clock-o"></i> H–P 8:00–17:00</span>
            <a href="mailto:info@klimapajzs.hu"><i class="fa fa-envelope"></i> info@klimapajzs.hu</a>
          </div>
          <span class="d-flex align-items-center" style="gap: 8px; color: var(--kp-yellow); font-weight: 600; font-size: 0.78rem;">
            <i class="fa fa-credit-card"></i> Cofidis részletfizetés lehetséges
          </span>
        </div>
      </div>
    </div>

    <!-- NAVBAR -->
    <header class="header_section">
      <div class="navbar-overlay-wrap">
        <div class="container-fluid">
          <nav class="navbar navbar-expand-lg custom_nav-container">
            <a class="navbar-brand-feher logo-bg-wrapper" href="/index.html">
              <img alt="Klímapajzs logo" loading="eager" src="/images/logo3.webp?v=20250719145611" style="height: 80px" />
            </a>
            <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Navigáció megnyitása" class="navbar-toggler" data-target="#navbarSupportedContent" data-toggle="collapse" type="button">
              <span></span><span></span><span></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav ml-auto align-items-lg-center">
                <li class="nav-item"><a class="nav-link" href="/index.html">Kezdőlap</a></li>
                <li class="nav-item dropdown kp-dropdown">
                  <a class="nav-link kp-dropdown-toggle" href="/klima-szolgaltatasok-ozd.html">Szolgáltatásaink</a>
                  <ul class="kp-dropdown-menu">
                    <div class="kp-dropdown-menu-inner">
                      <li><a href="/Aloldalak/szolgaltatasok/klimatelepites.html">Klímatelepítés</a></li>
                      <li><a href="/Aloldalak/szolgaltatasok/karbantartas_tisztitas.html">Karbantartás és tisztítás</a></li>
                    </div>
                  </ul>
                </li>
                <li class="nav-item"><a class="nav-link" href="/arakesinformaciok.html">Árak</a></li>
                <li class="nav-item"><a class="nav-link" href="/klimaberendezesek.html">Klímaberendezések</a></li>
                <li class="nav-item"><a class="nav-link" href="/rolunk.html">Rólunk</a></li>
                <li class="nav-item ml-lg-3"><a class="nav-link nav-cta-btn" href="/felmeres.html">Ajánlatkérés →</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>`;
// ═══════════════════════════════════════════════════════════════
// ▲▲▲  NAVBAR MÓDOSÍTÁS VÉGE  ▲▲▲
// ═══════════════════════════════════════════════════════════════

const CSS_LINK = '<link href="/css/kp-navbar.css" rel="stylesheet"/>';
const NAVBAR_JS = '<script src="/js/kp-navbar.js" defer></script>';

function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((entry) => {
    if (SKIP_DIRS.includes(entry)) return;
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

  // ── 1. CSS link beillesztése ha még nincs ──────────────────
  if (!html.includes("kp-navbar.css")) {
    const mainCssPattern = /(<link[^>]+main\.min\.css[^>]*\/?>)/i;
    const match = html.match(mainCssPattern);
    if (match) {
      html = html.replace(match[0], match[0] + "\n  " + CSS_LINK);
    } else if (html.includes("</head>")) {
      html = html.replace("</head>", "  " + CSS_LINK + "\n</head>");
    }
  }

  // ── 2. Régi navbar azonosítása és cseréje ──────────────────
  // Már új navbar van benne? → csak CSS/JS-t frissítjük, navbart nem
  const hasNewNavbar = html.includes("navbar-overlay-wrap");

  if (!hasNewNavbar) {
    // Minta A: régi tömörített blog navbar
    // top-info-bar div + header.header_section + aloldal_navbar (minified HTML)
    const patternA = /<!--\s*Felső információs sáv\s*-->[\s\S]*?<\/header>/i;

    // Minta B: félig új aloldal navbar
    // <!-- TOP INFO BAR --> ... </header>
    const patternB = /<!--\s*TOP INFO BAR\s*-->[\s\S]*?<\/header>/i;

    // Minta C: csak header tag, top-info-bar nélkül
    const patternC = /<header[\s\S]*?<\/header>/i;

    // Standalone top-info-bar (ha a header előtt van külön)
    // Eltávolítjuk ha maradna árván
    const patternTopBar =
      /<div class="top-info-bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i;

    let replaced = false;

    if (patternA.test(html)) {
      html = html.replace(patternA, NEW_NAVBAR);
      replaced = true;
    } else if (patternB.test(html)) {
      html = html.replace(patternB, NEW_NAVBAR);
      replaced = true;
    } else if (patternC.test(html)) {
      // Ellenőrizzük van-e top-info-bar a header előtt, ha igen azt is töröljük
      html = html.replace(patternTopBar, "");
      html = html.replace(patternC, NEW_NAVBAR);
      replaced = true;
    }

    if (!replaced) return "no_navbar";
  }

  // ── 3. kp-navbar.js script beillesztése ha nincs ──────────
  if (!html.includes("kp-navbar.js")) {
    if (html.includes("kp-kulcsuzenet.js")) {
      html = html.replace(
        /(<script src="\/js\/kp-kulcsuzenet\.js"[^>]*><\/script>)/,
        "$1\n    " + NAVBAR_JS,
      );
    } else {
      html = html.replace("</body>", "    " + NAVBAR_JS + "\n  </body>");
    }
  }

  fs.writeFileSync(filePath, html, "utf8");
  return hasNewNavbar ? "css_only" : "ok";
}

// ── Futtatás ─────────────────────────────────────────────────
console.log("\n🚀 Klímapajzs – Navbar injektáló\n" + "=".repeat(45));
const files = getAllHtmlFiles(ROOT);
console.log("Feldolgozandó fájlok:", files.length, "\n");

let ok = 0,
  cssOnly = 0,
  noNavbar = 0,
  err = 0;

files.forEach((filePath) => {
  try {
    const result = processFile(filePath);
    const rel = path.relative(ROOT, filePath);
    if (result === "ok") {
      console.log("  ✅", rel);
      ok++;
    } else if (result === "css_only") {
      console.log("  🎨", rel, "(CSS/JS frissítve, navbar már új)");
      cssOnly++;
    } else if (result === "no_navbar") {
      console.log("  ⚠️ ", rel, "(nem találtam navbart)");
      noNavbar++;
    }
  } catch (e) {
    console.error("  ❌", path.relative(ROOT, filePath), "-", e.message);
    err++;
  }
});

console.log("\n" + "=".repeat(45));
console.log("✅ Navbar lecserélve:", ok);
console.log("🎨 Csak CSS/JS frissítve:", cssOnly);
console.log("⚠️  Nem találtam navbart:", noNavbar);
console.log("❌ Hiba:", err);
console.log("\n📋 Feltöltendő fájlok:");
console.log("   - css/kp-navbar.css  (ÚJ fájl)");
console.log("   - js/kp-navbar.js    (ÚJ fájl)");
console.log("   - inject-navbar.js   (frissített)");
console.log("   - összes módosított .html fájl\n");
