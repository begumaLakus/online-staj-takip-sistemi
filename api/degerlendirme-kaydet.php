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

$ogrenci_id = $_GET["id"] ?? null;
$degerlendirme = $data["degerlendirmeNotu"] ?? null;

if (!$ogrenci_id || !$degerlendirme) {
    echo json_encode(["status" => "error", "message" => "Eksik veri."]);
    exit;
}

$sql = "UPDATE ogrenciler SET staj_degerlendirme = :not WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":not" => $degerlendirme,
    ":id" => $ogrenci_id
]);

echo json_encode(["status" => "ok", "message" => "Değerlendirme kaydedildi."]);
?>
