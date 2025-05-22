document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Giriş sayfasına yönlendir
      window.location.href = "../index.html"; // dizine göre ayarla
    });
  }
});
