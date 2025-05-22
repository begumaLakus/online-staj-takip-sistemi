document.addEventListener('DOMContentLoaded', function () {
  const dayRecords = document.getElementById('dayRecords');
  const form = document.querySelector('.day-form');
  const token = localStorage.getItem("token");

  // Sayfa aktif menüyü otomatik işaretle
  const menuLinks = document.querySelectorAll(".menu li a");
  const currentPage = window.location.pathname.split("/").pop();
  menuLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.parentElement.classList.add("active");
    }
  });

  // Yeni günlük kayıt gönderimi
  form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const tarih = document.getElementById("dayDate").value;
  const baslik = document.getElementById("dayTitle").value;
  const icerik = document.getElementById("dayDescription").value;
  const dosya = document.getElementById("dayFile").files[0];
  const ogrenciId = localStorage.getItem("ogrenci_id");

  if (!ogrenciId) {
    alert("Oturum bilgisi bulunamadı.");
    return;
  }

  const formData = new FormData();
  formData.append("ogrenci_id", ogrenciId);
  formData.append("tarih", tarih);
  formData.append("baslik", baslik);
  formData.append("icerik", icerik);
  if (dosya) {
    formData.append("dosya", dosya);
  }

  try {
    const response = await fetch("/nisa/api/gunluk-ekle.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (result.status === "ok") {
      alert("Günlük başarıyla kaydedildi!");
      form.reset();
      displayDayRecord({ date: tarih, title: baslik, content: icerik });
    } else {
      alert("Hata: " + result.message);
    }
  } catch (err) {
    alert("Sunucu hatası.");
    console.error(err);
  }
});

  // Kayıtlı bir günlüğü listeye buton olarak ekle
  function displayDayRecord(record) {
    const button = document.createElement("button");
    button.textContent = `${record.date} - ${record.title}`;
    button.className = "save-btn";
    button.addEventListener("click", () => {
      alert(`${record.date}\n\nBaşlık: ${record.title}\n\nİçerik:\n${record.content}`);
    });
    dayRecords.appendChild(button);
  }
  // Veritabanından günlükleri çek ve listele
async function fetchAndDisplayGunlukler() {
  const ogrenciId = localStorage.getItem("ogrenci_id");
  if (!ogrenciId) {
    document.getElementById("dayRecords").innerHTML = "<p>Öğrenci bulunamadı.</p>";
    return;
  }

  try {
    const response = await fetch(`/nisa/api/gunlukleri-getir.php?id=${ogrenciId}`);
    const result = await response.json();

    if (result.status === "ok") {
      dayRecords.innerHTML = "";

      if (result.data.length === 0) {
        dayRecords.innerHTML = "<p>Henüz kayıt yok.</p>";
        return;
      }

      result.data.forEach(gunluk => {
        const button = document.createElement("button");
        button.className = "save-btn";
        button.textContent = `${gunluk.tarih} - ${gunluk.baslik}`;
        button.addEventListener("click", () => {
          alert(`${gunluk.tarih}\n\nBaşlık: ${gunluk.baslik}\n\nİçerik:\n${gunluk.icerik}`);
        });
        dayRecords.appendChild(button);
      });
    } else {
      dayRecords.innerHTML = `<p>${result.message}</p>`;
    }
  } catch (error) {
    console.error("Günlükler alınamadı:", error);
    dayRecords.innerHTML = "<p>Sunucu hatası oluştu.</p>";
  }
}
    fetchAndDisplayGunlukler(); // Sayfa yüklenince günlüğü getir

  
});