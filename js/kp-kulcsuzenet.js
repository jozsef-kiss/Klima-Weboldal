(function () {
  var path = window.location.pathname;
  if (path === "/" || path.endsWith("index.html")) {
    return;
  }

  var css = `
    .kp-kulcsuzenet {
      background: linear-gradient(135deg, #e87722 0%, #142038 100%);
      border-top: 3px solid #E87722;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 20px 0;
      position: relative;
      z-index: 50;
    }
    .kp-kulcsuzenet-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: nowrap;
      text-align: center;
    }
    .kp-kulcsuzenet-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #E87722;
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .kp-kulcsuzenet-text {
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.93rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
      white-space: nowrap;
    }
    .kp-kulcsuzenet-text em {
      font-style: normal;
      color: #FFDE59;
      font-weight: 700;
    }
    .kp-kulcsuzenet-text a.kp-idopont-link {
      color: #FFDE59;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .kp-kulcsuzenet-text a.kp-idopont-link:hover {
      color: #fff;
    }
    .kp-kulcsuzenet-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(232,119,34,0.15);
      border: 1px solid rgba(232,119,34,0.5);
      color: #FFDE59;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 20px;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .kp-kulcsuzenet-btn:hover {
      background: #E87722;
      border-color: #E87722;
      color: #fff;
      text-decoration: none;
    }
    @media (max-width: 900px) {
      .kp-kulcsuzenet { padding: 14px 0; }
      .kp-kulcsuzenet-inner { flex-wrap: wrap; }
      .kp-kulcsuzenet-text { font-size: 0.82rem; white-space: normal; }
    }
  `;

  var html = `
    <div class="kp-kulcsuzenet" id="kp-kulcsuzenet-bar">
      <div class="container">
        <div class="kp-kulcsuzenet-inner">
          <span class="kp-kulcsuzenet-badge">Csak nálunk</span>
          <p class="kp-kulcsuzenet-text">
            <a href="/#idopontgarancia" class="kp-idopont-link">Ön mondja meg az időpontot</a> – <em>mi pontosan ott vagyunk.</em>
            Ha nem tartjuk: <em>a munkadíj felét elengedjük!</em>
          </p>
          <a class="kp-kulcsuzenet-btn" href="/felmeres.html">
            Időpontot kérek →
          </a>
        </div>
      </div>
    </div>
  `;

  function injectStyles() {
    if (document.getElementById("kp-kulcsuzenet-style")) return;
    var style = document.createElement("style");
    style.id = "kp-kulcsuzenet-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function findInsertPoint() {
    var aloldalHeader = document.querySelector(".aloldal-header");
    if (aloldalHeader) {
      return { el: aloldalHeader, position: "afterend" };
    }
    var headerSection = document.querySelector(".header_section");
    if (headerSection) {
      var wrapper = headerSection.closest("div");
      if (wrapper && wrapper !== document.body) {
        return { el: wrapper, position: "afterend" };
      }
      return { el: headerSection, position: "afterend" };
    }
    return { el: document.body.firstElementChild, position: "afterend" };
  }

  function alreadyExists() {
    return !!document.getElementById("kp-kulcsuzenet-bar");
  }

  function insert() {
    if (alreadyExists()) return;
    injectStyles();
    var point = findInsertPoint();
    if (!point || !point.el) return;
    point.el.insertAdjacentHTML(point.position, html);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insert);
  } else {
    insert();
  }
})();
