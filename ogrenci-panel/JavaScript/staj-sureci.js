document.addEventListener("DOMContentLoaded", function () {
  const ogrenciId = localStorage.getItem("ogrenci_id");

  // STAJ TAMAMLAMA İŞLEMİ
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      const note = document.getElementById("finalNote").value;
      const msg = document.getElementById("finishMessage");

      if (!note) {
        msg.textContent = "Lütfen değerlendirme notunuzu yazın.";
        msg.style.color = "red";
        return;
      }

      if (!ogrenciId) {
        msg.textContent = "Oturum hatası. Lütfen yeniden giriş yapın.";
        msg.style.color = "red";
        return;
      }

      fetch(`/nisa/api/staj-tamamla.php?id=${ogrenciId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finalNote: note
        })
      })
        .then(res => {
          if (!res.ok) throw new Error("Sunucu hatası");
          return res.json();
        })
        .then(data => {
          if (data.status === "ok") {
            msg.textContent = "Stajınız danışmana başarıyla gönderildi.";
            msg.style.color = "green";
            finishBtn.disabled = true;
            finishBtn.textContent = "Gönderildi";
          } else {
            msg.textContent = "Hata: " + data.message;
            msg.style.color = "red";
          }
        })
        .catch(err => {
          console.error(err);
          msg.textContent = "Sunucu hatası. Lütfen tekrar deneyin.";
          msg.style.color = "red";
        });
    });
  }
});

