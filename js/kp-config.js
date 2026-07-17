// FIGYELEM: a SHOW_PRICES átbillentésekor a hivatkozásokban a ?v= verziót is
// bumpolni kell (?v=2027), különben a .htaccess 1 hónapos JS-cache miatt a
// visszatérő látogatóknál nem érvényesül a váltás.

// Központi kapcsoló az ár-megjelenítéshez.
// true  -> árak látszanak, ajánlatkérő CTA-k rejtve (eredeti, áras működés)
// false -> árak rejtve, ajánlatkérő CTA-k látszanak (jelenlegi állapot)
window.KP_CONFIG = window.KP_CONFIG || {};
window.KP_CONFIG.SHOW_PRICES = false;

(function () {
  var root = document.documentElement;
  root.classList.remove("kp-prices-on", "kp-prices-off");
  root.classList.add(window.KP_CONFIG.SHOW_PRICES ? "kp-prices-on" : "kp-prices-off");
})();
