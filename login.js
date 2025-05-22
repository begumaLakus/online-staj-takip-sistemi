document.addEventListener("DOMContentLoaded", () => {
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
    localStorage.setItem("ogrenci_id", result.ogrenci_id); // ← burada kaydediyoruz
    window.location.href = result.redirect;
  } else if (result.role === "danisman") {
    window.location.href = result.redirect;
  }
}

      else {
        alert(result.message || "Giriş başarısız. E-posta veya şifre yanlış.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
      console.error(error);
    }
  });
});
