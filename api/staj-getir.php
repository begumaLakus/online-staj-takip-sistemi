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
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantı hatası: " . $e->getMessage()]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM gunlukler");
    $gunlukler = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "ok",
        "data" => $gunlukler
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Sorgu hatası: " . $e->getMessage()]);
    exit;
}
?>
