<?php
header("Content-Type: application/json");

// PostgreSQL bağlantı bilgileri
$host = "localhost";
$port = "5432";
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

// Veritabanı bağlantısı
try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Bağlantı hatası: " . $e->getMessage()]);
    exit;
}

// GET ile gelen öğrenci ID kontrolü
$ogrenci_id = $_GET["id"] ?? null;

if (!$ogrenci_id) {
    echo json_encode(["status" => "error", "message" => "Öğrenci ID eksik."]);
    exit;
}

try {
    $sql = "SELECT belge_turu, dosya_yolu, TO_CHAR(yukleme_tarihi, 'DD.MM.YYYY') AS yuklenme_tarihi 
            FROM belgeler 
            WHERE ogrenci_id = :id
            ORDER BY yuklenme_tarihi DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $ogrenci_id]);
    $belgeler = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "ok", "data" => $belgeler]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veri alınırken hata: " . $e->getMessage()]);
}
