/**
 * KLÍMAPAJZS – Navbar scroll viselkedés
 * Minden oldalon fut, kezeli a sticky navbar animációt.
 */
(function () {
  var nav = document.querySelector(".navbar-overlay-wrap");
  if (!nav) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) {
      nav.style.position = "fixed";
      nav.style.top = "0";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.zIndex = "9999";
      nav.style.background = "rgba(12,20,42,0.96)";
      nav.style.backdropFilter = "blur(20px)";
      nav.style.webkitBackdropFilter = "blur(20px)";
      nav.style.boxShadow = "0 4px 28px rgba(0,0,0,0.3)";
      nav.style.borderBottom = "1px solid rgba(255,255,255,0.07)";
      nav.style.transition = "all 0.3s ease";
      var nav2 = document.querySelector(".custom_nav-container");
      var logo = document.querySelector(".logo-bg-wrapper img");
      if (nav2) nav2.style.padding = "10px 32px";
      if (logo) logo.style.height = "54px";
    } else {
      nav.style.position = "";
      nav.style.top = "";
      nav.style.left = "";
      nav.style.right = "";
      nav.style.zIndex = "";
      nav.style.background = "";
      nav.style.backdropFilter = "";
      nav.style.webkitBackdropFilter = "";
      nav.style.boxShadow = "";
      nav.style.borderBottom = "";
      var nav2 = document.querySelector(".custom_nav-container");
      var logo = document.querySelector(".logo-bg-wrapper img");
      if (nav2) nav2.style.padding = "";
      if (logo) logo.style.height = "68px";
    }
  });
  // Mobil dropdown toggle
  document.querySelectorAll(".kp-dropdown-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      var isMobile = window.innerWidth < 992;
      if (isMobile) {
        e.preventDefault();
        var parent = this.closest(".kp-dropdown");
        parent.classList.toggle("open");
      }
    });
  });
})();
