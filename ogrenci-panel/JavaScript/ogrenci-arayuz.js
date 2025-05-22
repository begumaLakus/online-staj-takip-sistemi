document.addEventListener('DOMContentLoaded', async function () {
  const ogrenciId = localStorage.getItem("ogrenci_id");
  if (!ogrenciId) {
    alert("Oturum süresi dolmuş olabilir. Lütfen yeniden giriş yapın.");
    window.location.href = "/nisa/index.html";
    return;
  }

  try {
    const response = await fetch(`/nisa/api/ogrenci-bilgileri.php?id=${ogrenciId}`);
    const result = await response.json();

    if (result.status === "ok") {
      const data = result.data;

      // Görüntü alanlarına verileri yerleştir (DÜZELTİLDİ)
      document.getElementById("isimGoster").textContent = data.isim;
      document.getElementById("ogrenciNoGoster").textContent = data.ogrenci_no;
      document.getElementById("emailGoster").textContent = data.email;
      document.getElementById("stajYeriGoster").textContent = data.staj_yeri ?? "-";
      document.getElementById("firmaGoster").textContent = data.staj_firma ?? "-";
      document.getElementById("departmanGoster").textContent = data.staj_departman ?? "-";
      document.getElementById("baslangicGoster").textContent = data.staj_baslangic ?? "-";
      document.getElementById("bitisGoster").textContent = data.staj_bitis ?? "-";
      document.getElementById("sureGoster").textContent = data.staj_toplam_sure ?? "-";

      // Kalem simgesi tıklanınca formu doldur (DÜZELTİLDİ)
      document.getElementById("editBtn").addEventListener("click", function () {
        document.getElementById("profilForm").style.display = "block";
        document.getElementById("isim").value = data.isim;
        document.getElementById("ogrenci_no").value = data.ogrenci_no;
        document.getElementById("email").value = data.email;
        document.getElementById("staj_yeri").value = data.staj_yeri;
        document.getElementById("firma").value = data.staj_firma;
        document.getElementById("departman").value = data.staj_departman;
        document.getElementById("baslangic").value = data.staj_baslangic;
        document.getElementById("bitis").value = data.staj_bitis;
        document.getElementById("sure").value = data.staj_toplam_sure;
        if (data.staj_ozet) document.getElementById("ozet").value = data.staj_ozet;
        if (data.staj_mesaj) document.getElementById("mesaj").value = data.staj_mesaj;
      });

    } else {
      document.getElementById("errorMessage").textContent = result.message;
      document.getElementById("errorMessage").style.display = "block";
    }
  } catch (error) {
    console.error("Veri alınamadı:", error);
    document.getElementById("errorMessage").textContent = "Sunucu hatası oluştu.";
    document.getElementById("errorMessage").style.display = "block";
  }

  // Güncelleme işlemi
  document.getElementById("profilForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedData = {
      id: ogrenciId,
      ad: document.getElementById("isim").value,
      ogr_no: document.getElementById("ogrenci_no").value,
      email: document.getElementById("email").value,
      staj_yeri: document.getElementById("staj_yeri").value,
      firma: document.getElementById("firma").value,
      departman: document.getElementById("departman").value,
      baslangic: document.getElementById("baslangic").value,
      bitis: document.getElementById("bitis").value,
      sure: document.getElementById("sure").value,
      ozet: document.getElementById("ozet").value,
      mesaj: document.getElementById("mesaj").value
    };

    try {
      const response = await fetch("/nisa/api/ogrenci-guncelle.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Bilgiler güncellendi!");
        location.reload();
      } else {
        alert("Hata: " + result.message);
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Sunucu hatası. Lütfen tekrar deneyin.");
    }
  });
});
