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

// Sadece staj mesajı (yani danışmana gönderilmiş olanlar)
$sql = "SELECT id, isim, ogrenci_no, staj_mesaj FROM ogrenciler WHERE staj_mesaj IS NOT NULL";
$stmt = $pdo->query($sql);
$ogrenciler = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "ok",
    "data" => $ogrenciler
]);
?>
