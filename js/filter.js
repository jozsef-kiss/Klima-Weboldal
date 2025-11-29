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

// Minta terméklista
const products = [
  {
    id: 1,
    name: "Fisher Comfort Plus Klímaszett",
    brand: "Fisher",
    type: "Comfort Plus",
    power: "2.7kW",
    price: 299900,
    image:
      "/images/Klímaberendezések/FISHER/COMFORT PLUS/2,7Új Fisher Comfort Plus FSAI-CP-91AE3FSOAI-CP-91AE3 oldalfali split klíma 2,7 kW/KÉPEK/1.png",
  },
  {
    id: 2,
    name: "Fisher Comfort Plus Klímaszett",
    brand: "Fisher",
    type: "Comfort Plus",
    power: "3.5kW",
    price: 318900,
    image:
      "/images/Klímaberendezések/FISHER/COMFORT PLUS/3,5Új Fisher Comfort Plus FSAI-CP-121AE3FSOAI-CP-121AE3 oldalfali split klíma 3,5kW/képek/1.png",
  },
  {
    id: 3,
    name: "Fisher Comfort Plus Klímaszett",
    brand: "Fisher",
    type: "Comfort Plus",
    power: "5.2kW",
    price: 469900,
    image:
      "/images/Klímaberendezések/FISHER/COMFORT PLUS/5,2Új Fisher Comfort Plus FSAI-CP-181AE3FSOAI-CP-181AE3 oldalfali split klíma 5,2kW/képek/1.png",
  },
  {
    id: 4,
    name: "Fisher Special Edition (SP) Klímaszett",
    brand: "Fisher",
    type: "Special Edition",
    power: "2.6kW",
    price: 239900,
    image:
      "/images/Klímaberendezések/FISHER/Special Edition/3,5Fisher Special Edition (SP) inverteres oldalfali split klíma 3,5 kW/1.webp",
  },
  {
    id: 5,
    name: "Fisher Special Edition (SP) Klímaszett",
    brand: "Fisher",
    type: "Special Edition",
    power: "3.5kW",
    price: 254900,
    image:
      "/images/Klímaberendezések/FISHER/Special Edition/3,5Fisher Special Edition (SP) inverteres oldalfali split klíma 3,5 kW/1.webp",
  },
  {
    id: 6,
    name: "Fisher Special Edition (SP) Klímaszett",
    brand: "Fisher",
    type: "Special Edition",
    power: "5.3kW",
    price: 384900,
    image:
      "/images/Klímaberendezések/FISHER/Special Edition/3,5Fisher Special Edition (SP) inverteres oldalfali split klíma 3,5 kW/1.webp",
  },
  {
    id: 7,
    name: "Fisher Summer Klímaszett",
    brand: "Fisher",
    type: "Summer",
    power: "2.5kW",
    price: 249900,
    image:
      "/images/Klímaberendezések/FISHER/SUMMER/2,5Fisher Summer (FSAI-SU-95FE3) Inverteres oldalfali splitklíma 2,5 kW/képek/1.webp",
  },
  {
    id: 8,
    name: "Fisher Summer Klímaszett",
    brand: "Fisher",
    type: "Summer",
    power: "3.4kW",
    price: 266899,
    image:
      "/images/Klímaberendezések/FISHER/SUMMER/2,5Fisher Summer (FSAI-SU-95FE3) Inverteres oldalfali splitklíma 2,5 kW/képek/1.webp",
  },
  {
    id: 9,
    name: "Gree Comfort Pro klímaszett - inverteres WIFI mono split",
    brand: "Gree",
    type: "ComfortPro",
    power: "2.6kW",
    price: 300482,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Comfort PRO/Új Gree Comfort Pro klíma - inverteres WIFI mono split 2,6kW/Képek/1.jpg",
  },
  {
    id: 10,
    name: "Gree Comfort Pro klímaszett - inverteres WIFI mono split",
    brand: "Gree",
    type: "ComfortPro",
    power: "3.5kW",
    price: 322199,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Comfort PRO/Új Gree Comfort Pro klíma - inverteres WIFI mono split 2,6kW/Képek/1.jpg",
  },
  {
    id: 11,
    name: "Gree Comfort Pro klímaszett - inverteres WIFI mono split",
    brand: "Gree",
    type: "ComfortPro",
    power: "5.3kW",
    price: 465836,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Comfort PRO/Új Gree Comfort Pro klíma - inverteres WIFI mono split 2,6kW/Képek/1.jpg",
  },
  {
    id: 12,
    name: "Gree Dark Pro inverteres -oldalfali split klíma WiFivel (Matt fekete) Klímaszett",
    brand: "Gree",
    type: "DarkPro",
    power: "2.7",
    price: 323723,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Dark Pro/Új Gree Dark Pro inverteres -oldalfali split 2,7 kW klíma WiFivel (Matt fekete)/Képek/1.jpg",
  },
  {
    id: 13,
    name: "Gree Dark Pro inverteres -oldalfali split 2,7 klíma WiFivel (Matt fekete) Klímaszett",
    brand: "Gree",
    type: "DarkPro",
    power: "3.5kW",
    price: 346456,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Dark Pro/Új Gree Dark Pro inverteres -oldalfali split 2,7 kW klíma WiFivel (Matt fekete)/Képek/1.jpg",
  },
  {
    id: 14,
    name: "Gree Pulse inverteres - oldalfali split klíma Wifivel Klímaszett",
    brand: "Gree",
    type: "Pulse",
    power: "2.5kW",
    price: 273304,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Pulse inverteres/Gree Pulse inverteres - oldalfali split klíma (2,5 kW - Wifivel)/termek-pulse-01.jpg",
  },
  {
    id: 15,
    name: "Gree Pulse inverteres - oldalfali split klíma Wifivel Klímaszett",
    brand: "Gree",
    type: "Pulse",
    power: "3.2KW",
    price: 289560,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Pulse inverteres/Gree Pulse inverteres - oldalfali split klíma (2,5 kW - Wifivel)/termek-pulse-01.jpg",
  },
  {
    id: 16,
    name: "Gree Pulse inverteres - oldalfali split klíma Wifivel Klímaszett",
    brand: "Gree",
    type: "Pulse",
    power: "4.6kW",
    price: 421259,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/lakossági klímák/Pulse inverteres/Gree Pulse inverteres - oldalfali split klíma (2,5 kW - Wifivel)/termek-pulse-01.jpg",
  },
  {
    id: 17,
    name: "Gree multi inverter kültéri egység R32 - Max. 2 beltéri egységhez",
    brand: "Gree",
    type: "Multi",
    power: "4.1kW",
    price: 428117,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi kültéri egység Inverter HűtőFűtő/Gree multi inverter 4,1 kW kültéri egység R32/Képek/1.jpg",
  },
  {
    id: 18,
    name: "Gree multi inverter kültéri egység R32 - Max. 2 beltéri egységhez",
    brand: "Gree",
    type: "Multi",
    power: "5.3KW",
    price: 465455,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi kültéri egység Inverter HűtőFűtő/Gree multi inverter 4,1 kW kültéri egység R32/Képek/1.jpg",
  },
  {
    id: 19,
    name: "Gree multi inverter kültéri egység R32 - Max. 3 beltéri egységhez",
    brand: "Gree",
    type: "Multi",
    power: "7.1kW",
    price: 616712,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi kültéri egység Inverter HűtőFűtő/Gree multi inverter 4,1 kW kültéri egység R32/Képek/1.jpg",
  },
  {
    id: 20,
    name: "Gree multi inverter kültéri egység R32 - Max. 4 beltéri egységhez",
    brand: "Gree",
    type: "Multi",
    power: "8kW",
    price: 660908,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi kültéri egység Inverter HűtőFűtő/Gree multi inverter 4,1 kW kültéri egység R32/Képek/1.jpg",
  },
  {
    id: 21,
    name: "Gree multi inverter kültéri egység R32 - Max. 4 beltéri egységhez",
    brand: "Gree",
    type: "Multi",
    power: "10.6kW",
    price: 845312,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi kültéri egység Inverter HűtőFűtő/Gree multi inverter 4,1 kW kültéri egység R32/Képek/1.jpg",
  },
  {
    id: 22,
    name: "Gree FM Comfort Pro inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiComfortPro",
    power: "2.7kW",
    price: 117475,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Comfort Pro/Gree FM Comfort Pro inverter 2,7 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 23,
    name: "Gree FM Comfort Pro inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiComfortPro",
    power: "3.5kW",
    price: 129159,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Comfort Pro/Gree FM Comfort Pro inverter 2,7 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 24,
    name: "Gree FM Comfort Pro inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiComfortPro",
    power: "5.3KW",
    price: 145542,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Comfort Pro/Gree FM Comfort Pro inverter 2,7 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 25,
    name: "Gree FM Dark Pro inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiDark",
    power: "2.7kW",
    price: 133985,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Dark X Pro/Gree FM Dark Pro inverter 2,7 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 26,
    name: "Gree FM Dark Pro inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiDark",
    power: "3.5KW",
    price: 148844,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Dark X Pro/Gree FM Dark Pro inverter 2,7 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 27,
    name: "Gree FM Pulse inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiPulse",
    power: "2.2kW",
    price: 102489,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Pulse/Gree FM Pulse inverter 2,2 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 28,
    name: "Gree FM Pulse inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiPulse",
    power: "2.5KW",
    price: 110363,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Pulse/Gree FM Pulse inverter 2,2 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 29,
    name: "Gree FM Pulse inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiPulse",
    power: "3.2kW",
    price: 121285,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Pulse/Gree FM Pulse inverter 2,2 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 30,
    name: "Gree FM Pulse inverter klíma beltéri egység",
    brand: "Gree",
    type: "MultiPulse",
    power: "4.6KW",
    price: 137287,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Multi klímakészülékek/Multi Oldalfali beltéri egység Pulse/Gree FM Pulse inverter 2,2 kW klíma beltéri egység/Képek/1.jpg",
  },
  {
    id: 31,
    name: "Gree Airy inverter klíma szett",
    brand: "Gree",
    type: "Airy",
    power: "3.5kW",
    price: 430657,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 32,
    name: "Gree Airy inverter klíma szett",
    brand: "Gree",
    type: "Airy",
    power: "5.3KW",
    price: 538353,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 33,
    name: "Gree Airy inverter klíma szett",
    brand: "Gree",
    type: "Airy",
    power: "7.1kW",
    price: 605663,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 34,
    name: "Gree Airy inverteres, téliesített klíma szett (R32)",
    brand: "Gree",
    type: "Airy",
    power: "2.7KW",
    price: 411861,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 35,
    name: "Gree Amber Royal inverter klíma szett",
    brand: "Gree",
    type: "AmberRoyal",
    power: "3.5kW",
    price: 498729,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 36,
    name: "Gree Amber Royal inverter klíma szett",
    brand: "Gree",
    type: "AmberRoyal",
    power: "5.3kW",
    price: 565785,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 37,
    name: "Gree Amber Royal inverter klíma szett",
    brand: "Gree",
    type: "AmberRoyal",
    power: "2.7KW",
    price: 476377,
    image:
      "/images/Klímaberendezések/Gree klímaberendezések/Prestige klímák/Airy/Gree Airy inverter 3,5 kW klíma szett/képek/1.jpg",
  },
  {
    id: 38,
    name: "Kaisai FLY magasoldalfali klímaberendezés (Csepptálca fűtés, Wifi, R32) Klímaszett",
    brand: "Kaisai",
    type: "Fly",
    power: "2.5KW",
    price: 216967,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 39,
    name: "Kaisai FLY magasoldalfali klímaberendezés (Csepptálca fűtés, Wifi, R32) Klímaszett",
    brand: "Kaisai",
    type: "Fly",
    power: "3.5kW",
    price: 234099,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 40,
    name: "Kaisai FLY magasoldalfali klímaberendezés (Csepptálca fűtés, Wifi, R32) Klímaszett",
    brand: "Kaisai",
    type: "Fly",
    power: "5.3KW",
    price: 416801,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 41,
    name: "Kaisai ICE inverteres oldalfali split klíma (Fehér, fűtésre optimalizált) Klímaszett",
    brand: "Kaisai",
    type: "Ice",
    power: "2.5KW",
    price: 256946,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 42,
    name: "Kaisai ICE inverteres oldalfali split klíma (Fehér, fűtésre optimalizált) Klímaszett",
    brand: "Kaisai",
    type: "Ice",
    power: "3.5kW",
    price: 274066,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 43,
    name: "Kaisai ICE inverteres oldalfali split klíma (Fehér, fűtésre optimalizált) Klímaszett",
    brand: "Kaisai",
    type: "Ice",
    power: "5.3KW",
    price: 433933,
    image:
      "/images/Klímaberendezések/Kaisai/FLY/Kaisai FLY magasoldalfali klímaberendezés 2,5 kW (Csepptálca fűtés, Wifi, R32)/Képek/1.webp",
  },
  {
    id: 44,
    name: "Midea All Easy Pro MEX-09-SP oldalfali split klíma - (R32) Klímaszett",
    brand: "Midea",
    type: "AllEasyPro",
    power: "2.6KW",
    price: 319900,
    image:
      "/images/Klímaberendezések/Midea/All Easy Pro/Midea All Easy Pro MEX-09-SP oldalfali split klíma 2,6 kW - (R32)/Képek/1.png",
  },
  {
    id: 45,
    name: "Midea All Easy Pro MEX-09-SP oldalfali split klíma - (R32) Klímaszett",
    brand: "Midea",
    type: "AllEasyPro",
    power: "3.5kW",
    price: 329900,
    image:
      "/images/Klímaberendezések/Midea/All Easy Pro/Midea All Easy Pro MEX-09-SP oldalfali split klíma 2,6 kW - (R32)/Képek/1.png",
  },
  {
    id: 46,
    name: "Midea All Easy Pro MEX-09-SP oldalfali split klíma - (R32) Klímaszett",
    brand: "Midea",
    type: "AllEasyPro",
    power: "5.3KW",
    price: 439900,
    image:
      "/images/Klímaberendezések/Midea/All Easy Pro/Midea All Easy Pro MEX-09-SP oldalfali split klíma 2,6 kW - (R32)/Képek/1.png",
  },
  {
    id: 47,
    name: "Midea Breezeless E oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Breezeless",
    power: "2.5KW",
    price: 269900,
    image:
      "/images/Klímaberendezések/Midea/Breezeless E/Midea Breezeless E oldalfali split klíma 2,5 kW/Képek/1.jpg",
  },
  {
    id: 48,
    name: "Midea Breezeless E oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Breezeless",
    power: "3.5kW",
    price: 279900,
    image:
      "/images/Klímaberendezések/Midea/Breezeless E/Midea Breezeless E oldalfali split klíma 2,5 kW/Képek/1.jpg",
  },
  {
    id: 49,
    name: "Midea Breezeless E oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Breezeless",
    power: "5.3KW",
    price: 409900,
    image:
      "/images/Klímaberendezések/Midea/Breezeless E/Midea Breezeless E oldalfali split klíma 2,5 kW/Képek/1.jpg",
  },
  {
    id: 50,
    name: "Midea Xtreme Save  oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Xtreme",
    power: "2.6KW",
    price: 249900,
    image:
      "/images/Klímaberendezések/Midea/Xtreme Save/Midea Xtreme Save  oldalfali split klíma 2,6 kW - MGP2X-09-SP (R32)/képek/1.png",
  },
  {
    id: 51,
    name: "Midea Xtreme Save  oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Xtreme",
    power: "3.5kW",
    price: 259900,
    image:
      "/images/Klímaberendezések/Midea/Xtreme Save/Midea Xtreme Save  oldalfali split klíma 2,6 kW - MGP2X-09-SP (R32)/képek/1.png",
  },
  {
    id: 52,
    name: "Midea Xtreme Save PRO oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Xtreme Pro",
    power: "2.6KW",
    price: 299900,
    image:
      "/images/Klímaberendezések/Midea/Xtreme Save Pro/Midea Xtreme Save PRO oldalfali split klíma 2,6 kW - MGP2X-09-SP (R32)/képek/1.png",
  },
  {
    id: 53,
    name: "Midea Xtreme Save PRO oldalfali split klíma Klímaszett",
    brand: "Midea",
    type: "Xtreme Pro",
    power: "3.5kW",
    price: 309900,
    image:
      "/images/Klímaberendezések/Midea/Xtreme Save Pro/Midea Xtreme Save PRO oldalfali split klíma 2,6 kW - MGP2X-09-SP (R32)/képek/1.png",
  },
  {
    id: 54,
    name: "POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG - Max. 2 beltéri egységhez",
    brand: "Polar",
    type: "PolarMultiKulteri",
    power: "4kW",
    price: 323000,
    image:
      "/images/Klímaberendezések/polar/Multi kültéri egységek/POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG 4KW/kÉPEK/POL-KMU-MO2H0040SDO.webp",
  },
  {
    id: 55,
    name: "Polar multi kültéri egység - Max. 3 beltéri egységhez",
    brand: "Polar",
    type: "PolarMultiKulteri",
    power: "7.5kW",
    price: 480000,
    image:
      "/images/Klímaberendezések/polar/Multi kültéri egységek/POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG 4KW/kÉPEK/POL-KMU-MO2H0040SDO.webp",
  },
  {
    id: 56,
    name: "Polar multi split klíma kültéri egység - Max. 4 beltéri egységhez",
    brand: "Polar",
    type: "PolarMultiKulteri",
    power: "5kW",
    price: 353000,
    image:
      "/images/Klímaberendezések/polar/Multi kültéri egységek/POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG 4KW/kÉPEK/POL-KMU-MO2H0040SDO.webp",
  },
  {
    id: 57,
    name: "Polar multi split klíma kültéri egység - Max. 4 beltéri egységhez",
    brand: "Polar",
    type: "PolarMultiKulteri",
    power: "9.4kW",
    price: 578000,
    image:
      "/images/Klímaberendezések/polar/Multi kültéri egységek/POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG 4KW/kÉPEK/POL-KMU-MO2H0040SDO.webp",
  },
  {
    id: 58,
    name: "Polar multisplit 5 beltéris inverteres kültéri egység - Max. 5 beltéri egységhez",
    brand: "Polar",
    type: "PolarMultiKulteri",
    power: "12kW",
    price: 726000,
    image:
      "/images/Klímaberendezések/polar/Multi kültéri egységek/POLAR KLÍMA MULTI KÜLTÉRI EGYSÉG 4KW/kÉPEK/POL-KMU-MO2H0040SDO.webp",
  },
  {
    id: 59,
    name: "Polar Fresh 2,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "Fresh",
    power: "2,5W",
    price: 363000,
    image:
      "/images/Klímaberendezések/polar/Fresh/Polar Fresh 2,5 KW split inverteres klímaszett/Képek/belteri-oldalrol02072024145953990183-1024x640.png",
  },
  {
    id: 60,
    name: "Polar Fresh 3,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "Fresh",
    power: "3,5kW",
    price: 380000,
    image:
      "/images/Klímaberendezések/polar/Fresh/Polar Fresh 2,5 KW split inverteres klímaszett/Képek/belteri-oldalrol02072024145953990183-1024x640.png",
  },
  {
    id: 61,
    name: "Polar Lite split inverteres klímaszett",
    brand: "Polar",
    type: "Lite",
    power: "3,5kW",
    price: 209000,
    image:
      "/images/Klímaberendezések/polar/Lite/3,5 Polar Lite split inverteres klímaszett/képek/Polar-Lite_teljes-feherebb16052025133551112856-1024x844.png",
  },
  {
    id: 62,
    name: "Polar Lite split inverteres klímaszett",
    brand: "Polar",
    type: "Lite",
    power: "2,5kW",
    price: 203000,
    image:
      "/images/Klímaberendezések/polar/Lite/3,5 Polar Lite split inverteres klímaszett/képek/Polar-Lite_teljes-feherebb16052025133551112856-1024x844.png",
  },
  {
    id: 63,
    name: "Polar Lite split inverteres klímaszett",
    brand: "Polar",
    type: "Lite",
    power: "5kW",
    price: 330000,
    image:
      "/images/Klímaberendezések/polar/Lite/3,5 Polar Lite split inverteres klímaszett/képek/Polar-Lite_teljes-feherebb16052025133551112856-1024x844.png",
  },
  {
    id: 64,
    name: "Polar Lite split beltéri egység",
    brand: "Polar",
    type: "PolarMultibelteriOptimum",
    power: "2.5kW",
    price: 90000,
    image:
      "/images/Klímaberendezések/polar/Multi beltéri egységek/Polar Optimum 2,5 kW multi beltéri egység/Képek/Polar-SDO-belteri-egyseg_zart-szembol1508202416.png",
  },
  {
    id: 65,
    name: "Polar Lite split beltéri egység",
    brand: "Polar",
    type: "PolarMultibelteriOptimum",
    power: "3.5kW",
    price: 101000,
    image:
      "/images/Klímaberendezések/polar/Multi beltéri egységek/Polar Optimum 2,5 kW multi beltéri egység/Képek/Polar-SDO-belteri-egyseg_zart-szembol1508202416.png",
  },
  {
    id: 66,
    name: "Polar Lite split beltéri egység",
    brand: "Polar",
    type: "PolarMultibelteriOptimum",
    power: "5kW",
    price: 132000,
    image:
      "/images/Klímaberendezések/polar/Multi beltéri egységek/Polar Optimum 2,5 kW multi beltéri egység/Képek/Polar-SDO-belteri-egyseg_zart-szembol1508202416.png",
  },
  {
    id: 67,
    name: "Polar Optimum 2,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarOptimum",
    power: "2.5kW",
    price: 214000,
    image:
      "/images/Klímaberendezések/polar/Polar Optimum/Polar Optimum 2,5 KW split inverteres klímaszett/Képek/Polar-SDO-belteri-egyseg_zart-szembol15082024161823449488-1-1024x386.png",
  },
  {
    id: 68,
    name: "Polar Optimum 3,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarOptimum",
    power: "3.5kW",
    price: 235000,
    image:
      "/images/Klímaberendezések/polar/Polar Optimum/Polar Optimum 2,5 KW split inverteres klímaszett/Képek/Polar-SDO-belteri-egyseg_zart-szembol15082024161823449488-1-1024x386.png",
  },
  {
    id: 69,
    name: "Polar Optimum 5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarOptimum",
    power: "5kW",
    price: 368000,
    image:
      "/images/Klímaberendezések/polar/Polar Optimum/Polar Optimum 2,5 KW split inverteres klímaszett/Képek/Polar-SDO-belteri-egyseg_zart-szembol15082024161823449488-1-1024x386.png",
  },
  {
    id: 70,
    name: "Polar Rainbow 3,5 KW Silver split inverteres klímaszett",
    brand: "Polar",
    type: "PolarRainbow",
    power: "3.5kW",
    price: 270000,
    image:
      "/images/Klímaberendezések/polar/Rainbow/Polar Rainbow 3,5 KW Silver split inverteres klímaszett/Képek/polar_rainbow_silver_belt_ri_1.jpg",
  },
  {
    id: 71,
    name: "Polar Rainbow 5 KW Silver split inverteres klímaszett",
    brand: "Polar",
    type: "PolarRainbow",
    power: "5kW",
    price: 390000,
    image:
      "/images/Klímaberendezések/polar/Rainbow/Polar Rainbow 3,5 KW Silver split inverteres klímaszett/Képek/polar_rainbow_silver_belt_ri_1.jpg",
  },
  {
    id: 72,
    name: "Polar Rainbow 2,5 KW Silver split inverteres klímaszett",
    brand: "Polar",
    type: "PolarRainbow",
    power: "2.5kW",
    price: 239000,
    image:
      "/images/Klímaberendezések/polar/Rainbow/Polar Rainbow 3,5 KW Silver split inverteres klímaszett/Képek/polar_rainbow_silver_belt_ri_1.jpg",
  },
  {
    id: 73,
    name: "Polar Zenit 2,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarZenit",
    power: "2.5kW",
    price: 284000,
    image:
      "/images/Klímaberendezések/polar/Zenit/Polar Zenit 2,5 KW split inverteres klímaszett/Képek/POLAR_SDZ_1-hn_11zon-1024x454.png",
  },
  {
    id: 74,
    name: "Polar Zenit 3,5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarZenit",
    power: "3.5kW",
    price: 292000,
    image:
      "/images/Klímaberendezések/polar/Zenit/Polar Zenit 2,5 KW split inverteres klímaszett/Képek/POLAR_SDZ_1-hn_11zon-1024x454.png",
  },
  {
    id: 75,
    name: "Polar Zenit 5 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarZenit",
    power: "5kW",
    price: 418000,
    image:
      "/images/Klímaberendezések/polar/Zenit/Polar Zenit 2,5 KW split inverteres klímaszett/Képek/POLAR_SDZ_1-hn_11zon-1024x454.png",
  },
  {
    id: 76,
    name: "Polar Zenit 7 KW split inverteres klímaszett",
    brand: "Polar",
    type: "PolarZenit",
    power: "7kW",
    price: 533000,
    image:
      "/images/Klímaberendezések/polar/Zenit/Polar Zenit 2,5 KW split inverteres klímaszett/Képek/POLAR_SDZ_1-hn_11zon-1024x454.png",
  },
  {
    id: 77,
    name: "Fujitsu Airstage Eco oldalfali mono split klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUAirstage",
    power: "2kW",
    price: 367000,
    image:
      "/images/Klímaberendezések/FUJITSU/Airstage/Fujitsu Airstage Eco oldalfali mono split klíma 2 kW/Képek/FUJ-KMO-ASEH07KNCA-AOEH07KNCA.webp",
  },
  {
    id: 78,
    name: "Fujitsu Airstage Eco oldalfali mono split klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUAirstage",
    power: "2.5kW",
    price: 369000,
    image:
      "/images/Klímaberendezések/FUJITSU/Airstage/Fujitsu Airstage Eco oldalfali mono split klíma 2 kW/Képek/FUJ-KMO-ASEH07KNCA-AOEH07KNCA.webp",
  },
  {
    id: 79,
    name: "Fujitsu Eco oldalfali mono split klíma 7.1 kW klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUECO",
    power: "7.1kW",
    price: 870000,
    image:
      "/images/Klímaberendezések/FUJITSU/ECO/Fujitsu Eco oldalfali mono split klíma 7.1 kW/FUJ-KMO-ASYG18KLCA-AOYG18KLCA.webp",
  },
  {
    id: 80,
    name: "Fujitsu Eco oldalfali mono split klíma 5.2 kW klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUECOAIRSTAGE",
    power: "5.2kW",
    price: 754000,
    image:
      "/images/Klímaberendezések/FUJITSU/ECO AIRSTAGE/Fujitsu Eco oldalfali mono split klíma 5.2 kW/kép/FUJ-KMO-ASYG18KLCA-AOYG18KLCA (1).webp",
  },
  {
    id: 81,
    name: "Fujitsu Eco oldalfali mono split klíma 7.2 kW klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUECOAIRSTAGE",
    power: "7.2kW",
    price: 932000,
    image:
      "/images/Klímaberendezések/FUJITSU/ECO AIRSTAGE/Fujitsu Eco oldalfali mono split klíma 5.2 kW/kép/FUJ-KMO-ASYG18KLCA-AOYG18KLCA (1).webp",
  },
  {
    id: 82,
    name: "Standard KM sorozat AIRSTAGE klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGE",
    power: "2kW",
    price: 397000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE/Standard KM sorozat AIRSTAGE ASEH07KMCGAOEH07KMCG 2KW/KÉPEK/img-set-SE031-01-01.png",
  },
  {
    id: 83,
    name: "Standard KM sorozat AIRSTAGE klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGE",
    power: "2.5kW",
    price: 450000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE/Standard KM sorozat AIRSTAGE ASEH07KMCGAOEH07KMCG 2KW/KÉPEK/img-set-SE031-01-01.png",
  },
  {
    id: 84,
    name: "Standard KM sorozat AIRSTAGE klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGE",
    power: "3.4kW",
    price: 516000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE/Standard KM sorozat AIRSTAGE ASEH07KMCGAOEH07KMCG 2KW/KÉPEK/img-set-SE031-01-01.png",
  },
  {
    id: 85,
    name: "Standard KM sorozat AIRSTAGE klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGE",
    power: "4.2kW",
    price: 643000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE/Standard KM sorozat AIRSTAGE ASEH07KMCGAOEH07KMCG 2KW/KÉPEK/img-set-SE031-01-01.png",
  },
  {
    id: 86,
    name: "Standard KM sorozat AIRSTAGE Fekete klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGEFeketeBeltéri",
    power: "2kW",
    price: 439000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE Fekete Beltéri/Standard KM sorozat AIRSTAGE ASEH07KMCG-BAOEH07KMCG 2 KW/img-set-SE032-01-01.png",
  },
  {
    id: 87,
    name: "Standard KM sorozat AIRSTAGE Fekete klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGEFeketeBeltéri",
    power: "2.5kW",
    price: 491000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE Fekete Beltéri/Standard KM sorozat AIRSTAGE ASEH07KMCG-BAOEH07KMCG 2 KW/img-set-SE032-01-01.png",
  },
  {
    id: 88,
    name: "Standard KM sorozat AIRSTAGE Fekete klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGEFeketeBeltéri",
    power: "3.4kW",
    price: 558000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE Fekete Beltéri/Standard KM sorozat AIRSTAGE ASEH07KMCG-BAOEH07KMCG 2 KW/img-set-SE032-01-01.png",
  },
  {
    id: 89,
    name: "Standard KM sorozat AIRSTAGE Fekete klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDAIRSTAGEFeketeBeltéri",
    power: "4.2kW",
    price: 685000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD AIRSTAGE Fekete Beltéri/Standard KM sorozat AIRSTAGE ASEH07KMCG-BAOEH07KMCG 2 KW/img-set-SE032-01-01.png",
  },
  {
    id: 90,
    name: "Standard KM sorozat - Nagyteljesítményű klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDNAGYTELJESÍTMÉNYŰ",
    power: "8kW",
    price: 1311800,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD NAGYTELJESÍTMÉNYŰ/Standard KM sorozat ASYG30KMTA  AOYG30KMTA/KM_egybe.png",
  },
  {
    id: 91,
    name: "Standard KM sorozat - Nagyteljesítményű klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDNAGYTELJESÍTMÉNYŰ",
    power: "9.4kW",
    price: 1443800,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD NAGYTELJESÍTMÉNYŰ/Standard KM sorozat ASYG30KMTA  AOYG30KMTA/KM_egybe.png",
  },
  {
    id: 92,
    name: "Fujitsu Nocria X  oldalfali mono split klíma 3.4 kW klímaszett",
    brand: "FUJITSU",
    type: "NocriaX",
    power: "3.4kW",
    price: 1115568,
    image:
      "/images/Klímaberendezések/FUJITSU/Fujitsu Nocria X  oldalfali mono split klíma 3.4 kW/FUJ-KMO-ASYG12KXCA-AOYG12KXCA.webp",
  },
  {
    id: 93,
    name: "Fujitsu Airstage Standard  oldalfali mono split klíma 5.1 2W klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDNAGYHELYSÉGEKBE",
    power: "5.1kW",
    price: 840000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD NAGYTELJESÍTMÉNYŰ/Standard KM sorozat ASYG30KMTA  AOYG30KMTA/KM_egybe.png",
  },
  {
    id: 94,
    name: "Fujitsu Airstage Standard  oldalfali mono split klíma 7.1 kW klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSTANDARDNAGYHELYSÉGEKB",
    power: "7.1kW",
    price: 1037000,
    image:
      "/images/Klímaberendezések/FUJITSU/STANDARD NAGYTELJESÍTMÉNYŰ/Standard KM sorozat ASYG30KMTA  AOYG30KMTA/KM_egybe.png",
  },
  {
    id: 95,
    name: "Fujitsu Szerver oldalfali mono split klíma 8 kW klímaszett",
    brand: "FUJITSU",
    type: "FUJITSUSZERVERKLÍMA",
    power: "8kW",
    price: 1443800,
    image:
      "/images/Klímaberendezések/FUJITSU/SZERVER KLÍMA/Fujitsu Szerver oldalfali mono split klíma 8 kW/FUJ-KMO-ASYH30KMTB-AOYH30KMTB.webp",
  },
];

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

  items.forEach((product) => {
    const area = getAreaRange(product.power);
    const card = `
      <div class="col-md-6 col-lg-4 mb-4">
        <a href="/termekek/${
          product.id
        }.html" class="card h-100 text-dark text-decoration-none">
          <img src="${product.image}" class="card-img-top" alt="${
      product.name
    }">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
              <strong>Teljesítmény:</strong> ${product.power}<br>
              <strong>Ajánlott alapterület:</strong> ${area}<br>
              <strong>Ár:</strong> ${product.price.toLocaleString()} Ft
            </p>
          </div>
        </a>
      </div>
    `;
    container.innerHTML += card;
  });
}

function determineKivitel(productName) {
  const name = productName.toLowerCase();

  if (name.includes("klímaszett")) return "klímaszett";
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
