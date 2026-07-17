let originalTypeOptions = [];
let originalPowerOptions = [];

document.addEventListener("DOMContentLoaded", () => {
  // Mentsd el az eredeti type mező opciókat
  const typeSelect = document.getElementById("type");
  originalTypeOptions = Array.from(typeSelect.options).map((opt) => ({
    value: opt.value,
    label: opt.textContent,
  }));

  displayBrandLogos();
  updateTypeOptions(""); // Kezdetben minden típus legyen benne

  document.getElementById("backToBrandsBtn").addEventListener("click", () => {
    document.getElementById("brand").value = "";
    document.getElementById("type").value = "";
    document.getElementById("power").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    updateTypeOptions("");
    displayBrandLogos();
    updatePowerOptions("", "");
  });

  document.getElementById("brand").addEventListener("change", () => {
    const selectedBrand = document.getElementById("brand").value;
    updateTypeOptions(selectedBrand);
  });

  const powerSelect = document.getElementById("power");
  originalPowerOptions = Array.from(powerSelect.options).map((opt) => ({
    value: opt.value,
    label: opt.textContent,
  }));
});

function getAreaRange(powerString) {
  const parsedPower = parseFloat(
    powerString
      .toString()
      .replace(",", ".")
      .replace("kW", "")
      .replace("KW", "")
      .replace("W", "")
      .trim()
  );

  if (parsedPower >= 2.5 && parsedPower <= 3.4) return "20-25 m²";
  if (parsedPower >= 3.5 && parsedPower <= 4.9) return "26-45 m²";
  if (parsedPower >= 5.0 && parsedPower <= 6.9) return "46-65 m²";
  if (parsedPower >= 7.0 && parsedPower <= 9.3) return "66-90 m²";
  if (parsedPower >= 9.4) return "91-120 m²";

  return ""; // ha egyik kategóriába sem esik
}

// A terméklista a js/kp-products.js-ben él (egyetlen igazságforrás).
const products = window.KP_PRODUCTS || [];

const brands = [
  { name: "Fisher", logo: "/images/Klímaberendezések/fisher.png" },
  {
    name: "Gree",
    logo: "/images/Klímaberendezések/gree.png",
  },
  { name: "Kaisai", logo: "/images/Klímaberendezések/kaisai.png" },
  { name: "Midea", logo: "/images/Klímaberendezések/midea.png" },
  { name: "Polar", logo: "/images/Klímaberendezések/polar.png" },
  { name: "FUJITSU", logo: "/images/Klímaberendezések/fujitsu.png" },
];

function displayBrandLogos() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  brands.forEach((brand) => {
    const card = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 text-dark text-decoration-none brand-card" style="cursor: pointer;" data-brand="${brand.name}">
          <img src="${brand.logo}" class="card-img-top" alt="${brand.name} logó">
          <div class="card-body text-center">
            <h5 class="card-title">${brand.name}</h5>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });

  // Kattintás esemény minden márkára
  const brandCards = document.querySelectorAll(".brand-card");
  brandCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedBrand = card.getAttribute("data-brand");
      document.getElementById("brand").value = selectedBrand;
      updateTypeOptions(selectedBrand);
      updatePowerOptions(selectedBrand, ""); // típus még nincs kiválasztva
      filterProducts();
    });
  });

  document.getElementById("backToBrandsWrapper").classList.add("d-none");
}

// Termékek megjelenítése
function displayProducts(items) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>Nincs találat a megadott szűrésre.</p>";
    return;
  }

  const html = items
    .map((product) => {
      const area = getAreaRange(product.power);
      const productUrl = `/termekek/${product.id}.html`;
      const quoteUrl = `/felmeres.html?termek=${product.id}`;

      return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 text-dark">
          <a href="${productUrl}" class="text-decoration-none text-dark">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
          </a>
          <div class="card-body d-flex flex-column">
            <a href="${productUrl}" class="text-decoration-none text-dark">
              <h5 class="card-title">${product.name}</h5>
            </a>
            <p class="card-text mb-3">
              <strong>Teljesítmény:</strong> ${product.power}<br>
              <strong>Ajánlott alapterület:</strong> ${area}
            </p>

            <!-- ÁRAS VÁLTOZAT — SHOW_PRICES: true esetén jelenik meg -->
            <p class="card-text kp-price mt-auto mb-0">
              <strong>Ár:</strong> ${product.price.toLocaleString("hu-HU")} Ft
            </p>

            <!-- AJÁNLATKÉRŐ VÁLTOZAT — SHOW_PRICES: false esetén jelenik meg -->
            <div class="kp-quote-cta mt-auto">
              <div class="kp-card-quote-label">Ajánlatot kérek</div>
              <a href="${quoteUrl}" class="kp-card-quote-btn">Ingyenes felmérés kérése</a>
              <div class="kp-card-quote-sub">24 órán belül válaszolunk</div>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = html;
}

function determineKivitel(productName) {
  const name = productName.toLowerCase();

  // JAVÍTVA: "klímaszett" és "klíma szett" is
  if (/klíma\s?szett/.test(name)) return "klímaszett";

  if (name.includes("kültéri egység") || name.includes("kültéri"))
    return "kültéri";

  // Beltéri egység esetén vigyázni kell
  if (name.includes("beltéri egység")) return "beltéri";

  // Ha csak simán benne van a "beltéri" szó, de mellette "max. X beltéri egységhez" is van, akkor kültéri!
  if (name.includes("beltéri") && name.includes("egységhez")) return "kültéri";

  if (name.includes("beltéri")) return "beltéri";

  return "ismeretlen";
}

// Szűrési logika
function filterProducts() {
  const brand = document.getElementById("brand").value;
  const type = document.getElementById("type").value;
  const power = document.getElementById("power").value;
  const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseInt(document.getElementById("maxPrice").value) || Infinity;
  const areaFilter = document.getElementById("areaFilter").value;
  const kivitelFilter = document
    .getElementById("kivitelFilter")
    .value.toLowerCase();

  const filtered = products.filter((p) => {
    const area = getAreaRange(p.power);
    const nameLower = p.name.toLowerCase();

    const actualKivitel = determineKivitel(p.name);

    const matchesKivitel =
      kivitelFilter === "" || actualKivitel === kivitelFilter;

    return (
      (brand === "" || p.brand === brand) &&
      (type === "" || p.type.includes(type)) &&
      (power === "" || p.power === power) &&
      (areaFilter === "" || area === areaFilter) &&
      matchesKivitel &&
      p.price >= minPrice &&
      p.price <= maxPrice
    );
  });

  displayProducts(filtered);
  document.getElementById("backToBrandsWrapper").classList.remove("d-none");
}

// Eseményfigyelő
document.getElementById("filterBtn").addEventListener("click", filterProducts);

// Alap betöltés
document.addEventListener("DOMContentLoaded", () => {
  displayBrandLogos();
  updateTypeOptions(""); // Kezdetben minden típus legyen benne

  document.getElementById("backToBrandsBtn").addEventListener("click", () => {
    document.getElementById("brand").value = "";
    document.getElementById("type").value = "";
    document.getElementById("power").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    updateTypeOptions("");
    displayBrandLogos();
  });

  document.getElementById("brand").addEventListener("change", () => {
    const selectedBrand = document.getElementById("brand").value;
    updateTypeOptions(selectedBrand);
  });

  // Típus változásra frissítjük a teljesítmény opciókat is
  document.getElementById("type").addEventListener("change", () => {
    const brand = document.getElementById("brand").value;
    const type = document.getElementById("type").value;
    updatePowerOptions(brand, type);
  });

  // Márka változásra frissítjük mindkettőt
  document.getElementById("brand").addEventListener("change", () => {
    const brand = document.getElementById("brand").value;
    updateTypeOptions(brand);
    updatePowerOptions(brand, ""); // ilyenkor még nincs kiválasztva típus
  });
});

document.getElementById("brand").addEventListener("change", () => {
  const selectedBrand = document.getElementById("brand").value;
  updateTypeOptions(selectedBrand);
});

function updateTypeOptions(selectedBrand) {
  const typeSelect = document.getElementById("type");

  // Összegyűjtjük az összes olyan type.value-t, ami a kiválasztott brandhez tartozik
  const relevantTypes = products
    .filter((p) => selectedBrand === "" || p.brand === selectedBrand)
    .map((p) => p.type);

  // Egyedi értékek kiszűrése
  const uniqueRelevantTypes = [...new Set(relevantTypes)];

  // Töröljük a meglévő type opciókat
  typeSelect.innerHTML = "";

  // Végigmegyünk az eredeti optionökön, és csak azokat adjuk hozzá, amik relevánsak
  originalTypeOptions.forEach((opt) => {
    if (opt.value === "" || uniqueRelevantTypes.includes(opt.value)) {
      const optionEl = document.createElement("option");
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      typeSelect.appendChild(optionEl);
    }
  });
}

function updatePowerOptions(selectedBrand, selectedType) {
  const powerSelect = document.getElementById("power");

  // Szűrjük a products alapján, milyen power értékek vannak az adott brand + type kombinációhoz
  const powers = products
    .filter(
      (p) =>
        (selectedBrand === "" || p.brand === selectedBrand) &&
        (selectedType === "" || p.type === selectedType)
    )
    .map((p) => p.power);

  const uniquePowers = [...new Set(powers)];

  // Tisztítjuk a select mezőt
  powerSelect.innerHTML = "";

  // Csak azok az opciók maradnak, amik relevánsak
  originalPowerOptions.forEach((opt) => {
    if (opt.value === "" || uniquePowers.includes(opt.value)) {
      const optionEl = document.createElement("option");
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      powerSelect.appendChild(optionEl);
    }
  });
}
