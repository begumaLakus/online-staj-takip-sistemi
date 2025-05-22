<?php
header("Content-Type: application/json");

$host = "localhost";
$port = "5432";
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantı hatası: " . $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID eksik."]);
    exit;
}

// Formdan gelen alanlar (JS ve veritabanı uyumlu)
$isim = $data["ad"] ?? null;
$ogr_no = $data["ogr_no"] ?? null;
$email = $data["email"] ?? null;
$staj_yeri = $data["staj_yeri"] ?? null;
$staj_firma = $data["firma"] ?? null;
$staj_departman = $data["departman"] ?? null;
$staj_baslangic = $data["baslangic"] ?? null;
$staj_bitis = $data["bitis"] ?? null;
$staj_toplam_sure = $data["sure"] ?? null;
$staj_ozet = $data["ozet"] ?? null;
$staj_mesaj = $data["mesaj"] ?? null;

// Güncelleme sorgusu
$sql = "UPDATE ogrenciler SET 
            isim = :isim, 
            ogrenci_no = :ogr_no, 
            email = :email, 
            staj_yeri = :staj_yeri,
            staj_firma = :staj_firma,
            staj_departman = :staj_departman,
            staj_baslangic = :staj_baslangic,
            staj_bitis = :staj_bitis,
            staj_toplam_sure = :staj_toplam_sure,
            staj_ozet = :staj_ozet,
            staj_mesaj = :staj_mesaj
        WHERE id = :id";

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([
    ":id" => $id,
    ":isim" => $isim,
    ":ogr_no" => $ogr_no,
    ":email" => $email,
    ":staj_yeri" => $staj_yeri,
    ":staj_firma" => $staj_firma,
    ":staj_departman" => $staj_departman,
    ":staj_baslangic" => $staj_baslangic,
    ":staj_bitis" => $staj_bitis,
    ":staj_toplam_sure" => $staj_toplam_sure,
    ":staj_ozet" => $staj_ozet,
    ":staj_mesaj" => $staj_mesaj
]);

if ($success) {
    echo json_encode(["status" => "success", "message" => "Profil güncellendi."]);
} else {
    echo json_encode(["status" => "error", "message" => "Güncelleme başarısız."]);
}
?>
