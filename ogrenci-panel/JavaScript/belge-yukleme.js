document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("belgeForm");
  const belgeTuru = document.getElementById("belgeTuru");
  const belgeDosya = document.getElementById("belgeDosya");
  const ogrenciId = localStorage.getItem("ogrenci_id");

  // === Belge Yükleme İşlemi ===
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const tur = belgeTuru.value;
    const dosya = belgeDosya.files[0];

    if (!ogrenciId) {
      alert("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      return;
    }

    if (!tur || !dosya) {
      alert("Lütfen belge türünü seçin ve bir dosya yükleyin.");
      return;
    }

    const formData = new FormData();
    formData.append("ogrenci_id", ogrenciId);
    formData.append("belge_turu", tur);
    formData.append("dosya", dosya);

    try {
      const response = await fetch("/nisa/api/belge-yukle.php", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.status === "ok") {
        alert("Belge başarıyla yüklendi.");
        form.reset();
        listeleBelgeler(); // Sayfayı yenilemeden tabloyu güncelle
      } else {
        alert("Hata: " + result.message);
      }
    } catch (error) {
      console.error("Sunucu hatası:", error);
      alert("Sunucu hatası oluştu.");
    }
  });

  // === Yüklenmiş Belgeleri Listele ===
if (ogrenciId) {
  fetch(`/nisa/api/belgeleri-getir.php?id=${ogrenciId}`)
    .then(res => res.json())
    .then(result => {
      if (result.status === "ok") {
        const tbody = document.getElementById("belgeTablosu");
        tbody.innerHTML = ""; // Önceki içeriği temizle

        result.data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.belge_turu}</td>
            <td style="color: green;">Yüklendi</td>
            <td>${row.yuklenme_tarihi}</td>
            <td><a href="${row.dosya_yolu}" target="_blank"><button>Görüntüle</button></a></td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        console.warn("Belge verisi alınamadı:", result.message);
      }
    })
    .catch(err => console.error("Listeleme hatası:", err));
}


  // Sayfa yüklendiğinde belgeleri getir
  listeleBelgeler();
});
