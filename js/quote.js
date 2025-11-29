document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("0Dxe7N4TsNe8OkRTy");

  document
    .getElementById("quote-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        phone_number: document.getElementById("phone").value,
        adress: document.getElementById("adress").value,
        product: document.getElementById("product").value,
        specific_product: document.getElementById("specific-product").value,
        extra_product: document.getElementById("extra-product").value,
        location: document.getElementById("location").value,
        survey:
          document.querySelector("input[name='survey']:checked")?.value ||
          "Nincs megadva",
        dimensions: document.getElementById("dimensions").value,
        budget: document.getElementById("budget").value,
        deadline:
          document.querySelector("input[name='deadline']:checked")?.value ||
          "Nincs megadva",
        message: document.getElementById("message").value,
        date: new Date().toLocaleString("hu-HU"),
      };

      emailjs
        .send("service_rpfiaov", "template_c8rlish", formData)
        .then(() => alert("Árajánlatkérés sikeresen elküldve!"))
        .catch((error) => alert("Hiba történt: " + error.text));
    });
});
