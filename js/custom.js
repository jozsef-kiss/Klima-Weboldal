// EmailJS inicializálás (csak egyszer kell a projektben)
emailjs.init("1CqvyW2ydm0WkaVAU"); // ezt már jól csináltad

const cloudName = "dfqzmxwqe";
const uploadPreset = "klimapajzs_felmeres";
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

async function uploadImagesToCloudinary(files) {
  const uploadedUrls = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 3;

  if (files.length > maxFiles) {
    alert("Legfeljebb 3 fájlt tölthetsz fel!");
    return [];
  }

  for (const file of files) {
    if (!file.type.match("image.*")) continue;
    if (file.size > maxSize) {
      alert("Egy fájl meghaladja az 5 MB méretet!");
      return [];
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("context", `alt=klimapajzs_${Date.now()}`);
    formData.append("tags", "klimapajzs");
    formData.append("folder", "klimapajzs");

    try {
      const res = await axios.post(cloudinaryUrl, formData);
      uploadedUrls.push(res.data.secure_url);
    } catch (err) {
      alert("Hiba történt a feltöltésnél: " + err.message);
      return [];
    }
  }

  return uploadedUrls;
}

document
  .getElementById("survey-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;

    // 🔧 Szempontok összefűzése
    const selectedCheckboxes = document.querySelectorAll(
      'input[name="szempont[]"]:checked'
    );
    const values = Array.from(selectedCheckboxes)
      .map((cb) => cb.value)
      .join(", ");
    document.getElementById("szempont_osszefuzve").value = values;

    // 📸 Fotók feltöltése
    const fotokInput = document.getElementById("photo-upload-fotok");
    const fotokUrls = (await uploadImagesToCloudinary(fotokInput.files)).slice(
      0,
      2
    );
    document.getElementById("photo_urls_fotok").value = fotokUrls.join(", ");

    // 📐 Alaprajz feltöltése
    const alaprajzInput = document.getElementById("photo-upload-alaprajz");
    const alaprajzUrls = (
      await uploadImagesToCloudinary(alaprajzInput.files)
    ).slice(0, 2);

    document.getElementById("photo_urls_alaprajz").value =
      alaprajzUrls.join(", ");

    // ✉️ EmailJS küldés
    const templateParams = {
      from_name: form.querySelector('input[name="from_name"]').value,
      from_email: form.querySelector('input[name="from_email"]').value,
      phone: form.querySelector('input[name="phone"]').value,
      address: form.querySelector('input[name="address"]').value,
      felmeres_tipus: form.querySelector('select[name="felmeres_tipus"]').value,
      idopont: form.querySelector('select[name="idopont"]')?.value || "",
      szempont_osszefuzve: values,
      egyeb_szempont:
        form.querySelector('input[name="egyeb_szempont"]').value || "",
      hasznalat:
        form.querySelector('input[name="hasznalat"]:checked')?.value || "",
      meret: form.querySelector('input[name="meret"]:checked')?.value || "",
      photo_urls_fotok: fotokUrls.join(", "),
      photo_urls_alaprajz: alaprajzUrls.join(", "),
    };

    emailjs.send("service_jpdwm24", "template_tt47zmn", templateParams).then(
      () => {
        alert("Köszönjük! A felmérés sikeresen elküldve.");
        form.reset();
        document.getElementById("helyszini-fields").style.display = "none";
        document.getElementById("online-fields").style.display = "none";
        document.getElementById("form-title").innerText =
          "Előzetes klímafelmérés";
        document.getElementById("form-description").innerText =
          "Kérjük, válassz, milyen típusú felmérést szeretnél!";
      },
      (error) => {
        alert("Hiba történt: " + JSON.stringify(error));
      }
    );
  });
