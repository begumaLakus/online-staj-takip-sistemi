<?php
header("Content-Type: application/json");

$host = "localhost";
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantı hatası."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$ogrenci_id     = $data["ogrenci_id"] ?? null;
$staj_firma     = $data["firma"] ?? null;
$staj_departman = $data["departman"] ?? null;
$staj_baslangic = $data["baslangic"] ?? null;
$staj_bitis     = $data["bitis"] ?? null;
$staj_toplam    = $data["toplam_sure"] ?? null;

if (!$ogrenci_id || !$staj_firma || !$staj_departman || !$staj_baslangic || !$staj_bitis || !$staj_toplam) {
    echo json_encode(["status" => "error", "message" => "Zorunlu alanlar eksik."]);
    exit;
}

$sql = "UPDATE ogrenciler SET
            staj_firma = :firma,
            staj_departman = :departman,
            staj_baslangic = :baslangic,
            staj_bitis = :bitis,
            staj_toplam_sure = :sure
        WHERE id = :ogrenci_id";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":firma" => $staj_firma,
    ":departman" => $staj_departman,
    ":baslangic" => $staj_baslangic,
    ":bitis" => $staj_bitis,
    ":sure" => $staj_toplam,
    ":ogrenci_id" => $ogrenci_id
]);

echo json_encode(["status" => "ok", "message" => "Staj bilgileri kaydedildi."]);
