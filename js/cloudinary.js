const photoInput = document.getElementById("photo-upload");
const photoUrlsField = document.getElementById("photo_urls");

photoInput.addEventListener("change", async function () {
  const files = Array.from(photoInput.files);
  const maxFiles = 3;
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const uploadedUrls = [];

  if (files.length > maxFiles) {
    alert("Legfeljebb 3 képet tölthetsz fel!");
    photoInput.value = ""; // törlés
    return;
  }

  for (const file of files) {
    if (file.size > maxSize) {
      alert(
        "Egyes képek nagyobbak mint 5 MB! Kérlek, válassz kisebb fájlokat."
      );
      photoInput.value = ""; // törlés
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "klimapajzs_felmeres"); // ← preset neve
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfqzmxwqe/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    } catch (err) {
      alert("Hiba történt a képfeltöltés során: " + err.message);
      return;
    }
  }

  // összefűzzük és berakjuk a hidden mezőbe
  photoUrlsField.value = uploadedUrls.join(", ");
});
