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

$id = $_GET["id"] ?? null;
if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID eksik."]);
    exit;
}

$sql = "SELECT id, isim, ogrenci_no, email, staj_yeri, staj_firma, staj_departman, staj_baslangic, staj_bitis, staj_toplam_sure, staj_ozet, staj_mesaj FROM ogrenciler WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([":id" => $id]);
$ogrenci = $stmt->fetch(PDO::FETCH_ASSOC);

if ($ogrenci) {
    echo json_encode(["status" => "ok", "data" => $ogrenci]);
} else {
    echo json_encode(["status" => "error", "message" => "Öğrenci bulunamadı."]);
}
?>
