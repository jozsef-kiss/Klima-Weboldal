// felmeres.html — termék előválasztás a ?termek=<id> URL paraméterből
document.addEventListener("DOMContentLoaded", function () {
  var hidden = document.getElementById("erdeklodo_termek");
  var wrap = document.getElementById("kp-selected-product");
  var nameEl = document.getElementById("kp-selected-product-name");
  var clearBtn = document.getElementById("kp-selected-product-clear");
  if (!hidden || !wrap || !nameEl) return;

  var raw = new URLSearchParams(window.location.search).get("termek");
  if (!raw) return;

  // Csak számot fogadunk el (XSS-védelem: a paraméter sosem kerül közvetlenül DOM-ba)
  var id = parseInt(raw, 10);
  if (!Number.isInteger(id) || id <= 0) return;

  var list = window.KP_PRODUCTS || [];
  var product = list.find(function (p) { return p.id === id; });
  if (!product) return; // ismeretlen id -> csendben nem csinálunk semmit

  var label = product.name + " – " + product.power + " (#" + product.id + ")";
  nameEl.textContent = label;   // textContent, NEM innerHTML
  hidden.value = label;
  wrap.classList.remove("d-none");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      hidden.value = "";
      wrap.classList.add("d-none");
    });
  }
});
