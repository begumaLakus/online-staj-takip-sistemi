// SAYFA GEÇİŞİ
function showSection(id) {
    const sections = document.querySelectorAll(".panel-section");
    sections.forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");

    const menuItems = document.querySelectorAll(".sidebar nav li");
    menuItems.forEach(item => item.classList.remove("active"));

    const target = Array.from(menuItems).find(li =>
        li.textContent.trim().toLowerCase().includes(id)
    );
    if (target) target.classList.add("active");
}

// DANIŞMAN PROFİLİNİ GETİR
async function fetchDanismanProfil() {
    const danismanId = localStorage.getItem("danisman_id");
    const card = document.getElementById("profilCard");
    card.innerHTML = "<p>Yükleniyor...</p>";

    if (!danismanId) {
        card.innerHTML = "<p>Danışman ID bulunamadı. Lütfen tekrar giriş yapın.</p>";
        return;
    }

    try {
        const response = await fetch(`/nisa/api/danisman-profil.php?id=${danismanId}`);
        if (!response.ok) throw new Error("Sunucu hatası");

        const result = await response.json();

        if (result.status === "ok") {
            const profil = result.data;
            card.innerHTML = `
                <p><strong>Ad Soyad:</strong> ${profil.unvan} ${profil.isim}</p>
                <p><strong>E-posta:</strong> ${profil.email}</p>
            `;
        } else {
            card.innerHTML = `<p>${result.message}</p>`;
        }
    } catch (error) {
        console.error("Danışman profili alınamadı:", error);
        card.innerHTML = "<p>Profil verileri alınırken hata oluştu.</p>";
    }
}

// ÖĞRENCİ LİSTESİNİ GETİR
function fetchOgrenciListesi() {
    fetch('/nisa/api/ogrencileri-getir.php')
        .then(response => response.json())
        .then(data => {
            const liste = document.getElementById("ogrenciCard");
            liste.innerHTML = "";

            if (data.status === "ok" && data.data.length > 0) {
                data.data.forEach(ogrenci => {
                    const div = document.createElement("div");
                    div.className = "ogrenci-kart";
                    div.innerHTML = `
                        <p><strong>${ogrenci.isim}</strong></p>
                        <p>Numara: ${ogrenci.ogrenci_no}</p>
                        <p>Email: ${ogrenci.email}</p>
                        <p>Staj Yeri: ${ogrenci.staj_yeri || "-"}</p>
                        <p>Başlangıç: ${ogrenci.staj_baslangic || "-"}</p>
                        <p>Bitiş: ${ogrenci.staj_bitis || "-"}</p>
                    `;
                    liste.appendChild(div);
                });
            } else {
                liste.innerHTML = "<p>Öğrenci bulunamadı.</p>";
            }
        })
        .catch(error => {
            console.error("Fetch hatası:", error);
            document.getElementById("ogrenciCard").innerHTML = "<p>Sunucu hatası oluştu.</p>";
        });
}

// STAJ DEFTERLERİNİ GETİR
function fetchStajDefterleri() {
    const ogrenciId = localStorage.getItem("ogrenci_id");
    if (!ogrenciId) {
        alert("Öğrenci ID bulunamadı.");
        return;
    }

    fetch(`/nisa/api/gunlukleri-getir.php?id=${ogrenciId}`)
        .then(response => response.json())
        .then(data => {
            const listeDiv = document.getElementById("gunlukListesi");
            listeDiv.innerHTML = "";

            if (data.status === "ok" && data.data.length > 0) {
                data.data.forEach(gunluk => {
                    const gunlukDiv = document.createElement("div");
                    gunlukDiv.classList.add("gunluk-karti");
                    gunlukDiv.innerHTML = `
                        <h3>${gunluk.baslik}</h3>
                        <p><strong>Tarih:</strong> ${gunluk.tarih}</p>
                        <p>${gunluk.icerik}</p>
                        <hr>
                    `;
                    listeDiv.appendChild(gunlukDiv);
                });
            } else {
                listeDiv.innerHTML = "<p>Günlük bulunamadı.</p>";
            }
        })
        .catch(error => {
            console.error("Fetch hatası:", error);
            document.getElementById("gunlukListesi").innerHTML = "<p>Günlükler yüklenirken bir hata oluştu.</p>";
        });
}

// DEĞERLENDİRME
async function fetchDegerlendirilecekler() {
    try {
        const res = await fetch('/nisa/api/degerlendirilecekler-getir.php');
        if (!res.ok) throw new Error("Sunucu hatası");
        const data = await res.json();

        const listeDiv = document.getElementById("degerlendirmeListesi");
        listeDiv.innerHTML = "";

        if (data.status === "ok" && data.data.length > 0) {
            data.data.forEach(std => {
                const ogrDiv = document.createElement("div");
                ogrDiv.classList.add("ogrenci-karti");

                const textareaId = `finalNote_${std.id}`;
                const btnId = `btnKaydet_${std.id}`;

                ogrDiv.innerHTML = `
                    <h3>${std.isim} (${std.ogrenci_no})</h3>
                    <p><strong>Staj Mesajı:</strong> ${std.staj_mesaj}</p>
                    <textarea id="${textareaId}" placeholder="Final değerlendirme notu..."></textarea>
                    <button id="${btnId}">Kaydet</button>
                    <hr>
                `;

                listeDiv.appendChild(ogrDiv);

                document.getElementById(btnId).addEventListener("click", async () => {
                    const finalNote = document.getElementById(textareaId).value;
                    if (!finalNote) {
                        alert("Lütfen final notunu girin.");
                        return;
                    }

                    try {
                        const res = await fetch(`/nisa/api/staj-tamamla.php?id=${std.id}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ finalNote })
                        });

                        const result = await res.json();
                        if (result.status === "ok") {
                            alert("✅ Kaydedildi");
                            fetchDegerlendirilecekler();
                        } else {
                            alert("❌ Kayıt başarısız: " + result.message);
                        }
                    } catch (err) {
                        alert("Sunucu hatası");
                        console.error(err);
                    }
                });
            });
        } else {
            listeDiv.innerHTML = "<p>Değerlendirme bekleyen öğrenci yok.</p>";
        }
    } catch (err) {
        document.getElementById("degerlendirmeListesi").innerHTML = "<p>Veriler yüklenemedi.</p>";
        console.error(err);
    }
}

// ŞİFRE DEĞİŞTİRME
document.addEventListener("DOMContentLoaded", () => {
    const sifreForm = document.getElementById("sifreDegistirForm");

    if (sifreForm) {
        sifreForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const eski = document.getElementById("eskiSifre").value;
            const yeni = document.getElementById("yeniSifre").value;
            const tekrar = document.getElementById("yeniSifreTekrar").value;
            const mesaj = document.getElementById("sifreDegistirMesaj");

            if (yeni !== tekrar) {
                mesaj.textContent = "❌ Yeni şifreler uyuşmuyor!";
                mesaj.style.color = "red";
                return;
            }

            try {
                const response = await fetch('/nisa/api/sifre-degistir.php', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: localStorage.getItem("danisman_id"),
                        eskiSifre: eski,
                        yeniSifre: yeni
                    })
                });

                const result = await response.json();
                if (result.status === "ok") {
                    mesaj.textContent = "✅ Şifre başarıyla değiştirildi!";
                    mesaj.style.color = "green";
                    sifreForm.reset();
                } else {
                    mesaj.textContent = result.message || "❌ Hata oluştu.";
                    mesaj.style.color = "red";
                }
            } catch (err) {
                mesaj.textContent = "❌ Sunucu hatası oluştu.";
                mesaj.style.color = "red";
                console.error(err);
            }
        });
    }
});

// ÇIKIŞ
function cikisYap() {
    localStorage.removeItem("token");
    localStorage.removeItem("danisman_id");
    window.location.href = "index.html";
}

// SAYFA YÜKLENDİĞİNDE PROFİL GELSİN
document.addEventListener("DOMContentLoaded", () => {
    showSection('profil');
    fetchDanismanProfil();
});
