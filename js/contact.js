document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("0Dxe7N4TsNe8OkRTy");

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        phone_number: document.getElementById("phone").value,
        message: document.getElementById("message").value,
        date: new Date().toLocaleString("hu-HU"),
      };

      emailjs
        .send("service_rpfiaov", "template_22xzm9e", formData)
        .then(() => alert("Üzenet elküldve!"))
        .catch((error) => alert("Hiba történt: " + error.text));
    });
});
