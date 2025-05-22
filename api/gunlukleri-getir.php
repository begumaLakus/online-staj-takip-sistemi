<?php
header("Content-Type: application/json");

// Veritabanı bağlantısı
$host = "localhost";
$port = "5432";
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantısı kurulamadı."]);
    exit;
}

// GET parametresinden ogrenci_id alınır
$ogrenci_id = $_GET['id'] ?? null;

if (!$ogrenci_id) {
    echo json_encode(["status" => "error", "message" => "Öğrenci ID eksik."]);
    exit;
}

// Verileri çek
$sql = "SELECT tarih, baslik, icerik FROM gunlukler WHERE ogrenci_id = :ogrenci_id ORDER BY tarih ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute(['ogrenci_id' => $ogrenci_id]);
$gunlukler = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Sonuç döndür
echo json_encode(["status" => "ok", "data" => $gunlukler]);
