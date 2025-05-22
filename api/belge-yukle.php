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

$ogrenci_id = $_POST['ogrenci_id'] ?? null;
$belge_turu = $_POST['belge_turu'] ?? null;

if (!$ogrenci_id || !$belge_turu || !isset($_FILES['dosya'])) {
    echo json_encode(["status" => "error", "message" => "Zorunlu alanlar eksik."]);
    exit;
}

$dosya = $_FILES['dosya'];
$uploadDir = "../uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uniqueName = uniqid() . "_" . basename($dosya["name"]);
$targetPath = $uploadDir . $uniqueName;
$veritabaniYolu = "uploads/" . $uniqueName;

if (!move_uploaded_file($dosya["tmp_name"], $targetPath)) {
    echo json_encode(["status" => "error", "message" => "Dosya yüklenemedi."]);
    exit;
}

$sql = "INSERT INTO belgeler (ogrenci_id, belge_turu, dosya_yolu, yukleme_tarihi, durum) 
        VALUES (:ogrenci_id, :belge_turu, :dosya_yolu, NOW(), 'Yüklendi')";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":ogrenci_id" => $ogrenci_id,
    ":belge_turu" => $belge_turu,
    ":dosya_yolu" => $veritabaniYolu
]);

echo json_encode(["status" => "ok", "message" => "Belge yüklendi."]);
?>
