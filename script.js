function moveSlider(type) {
  const slider = document.getElementById("formSlider");
  if (type === "login") {
    slider.style.transform = "translateX(0%)";
  } else {
    slider.style.transform = "translateX(-50%)";
    handleRoleChange();
  }
}

function handleRoleChange() {
  const role = document.getElementById("role").value;
  const ogrenciFields = document.getElementById("ogrenciFields");
  ogrenciFields.classList.toggle("hidden", role !== "ogrenci");
}

document.addEventListener("DOMContentLoaded", () => {
  // Role değişimi kontrol
  document.getElementById("role").addEventListener("change", handleRoleChange);
  handleRoleChange();

  // GİRİŞ FORMU
  document.querySelector("#loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = this.email.value;
    const password = this.password.value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost/nisa/giris.php", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.status === "ok") {
        if (result.role === "ogrenci") {
          localStorage.setItem("ogrenci_id", result.ogrenci_id);
          window.location.href = "/nisa/ogrenci-panel/ogrenci-arayuz.html";
        } else if (result.role === "danisman") {
          localStorage.setItem("danisman_id", result.danisman_id);
          window.location.href = "/nisa/danisman-panel.html";
        }
      } else {
        alert(result.message || "Giriş başarısız. E-posta veya şifre yanlış.");
      }

    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
      console.error(error);
    }
  });

  // KAYIT FORMU
  document.querySelector("#registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = this.role.value;
    const adsoyad = this.adsoyad.value;
    const email = this.email.value;
    const sifre = this.sifre.value;
    const ogrenciNo = document.getElementById("ogrenciNo").value || null;

    const body = {
      adsoyad,
      email,
      sifre,
      role,
      ogrenci_no: role === "ogrenci" ? ogrenciNo : null
    };

    try {
      const response = await fetch("http://localhost/nisa/kayit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.status === "ok") {
        alert("Kayıt başarıyla tamamlandı!");
        this.reset();
        moveSlider("login");
      } else {
        alert(result.message || "Kayıt başarısız.");
      }
    } catch (error) {
      alert("Kayıt sırasında bir hata oluştu.");
      console.error(error);
    }
  });
});

