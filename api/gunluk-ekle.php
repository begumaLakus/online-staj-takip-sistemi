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
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantısı başarısız."]);
    exit;
}

// Verileri al
$ogrenci_id = $_POST['ogrenci_id'] ?? null;
$tarih = $_POST['tarih'] ?? null;
$baslik = $_POST['baslik'] ?? null;
$icerik = $_POST['icerik'] ?? null;

if (!$ogrenci_id || !$tarih || !$baslik || !$icerik) {
    echo json_encode(["status" => "error", "message" => "Eksik alanlar var."]);
    exit;
}

// Dosya yüklemesi
$dosya_yolu = null;
if (isset($_FILES['dosya']) && $_FILES['dosya']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filename = uniqid() . "_" . basename($_FILES['dosya']['name']);
    $uploadPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['dosya']['tmp_name'], $uploadPath)) {
        $dosya_yolu = "uploads/" . $filename;
    } else {
        echo json_encode(["status" => "error", "message" => "Dosya yüklenemedi."]);
        exit;
    }
}

try {
    $sql = "INSERT INTO gunlukler (ogrenci_id, tarih, baslik, icerik, dosya_yolu)
            VALUES (:ogrenci_id, :tarih, :baslik, :icerik, :dosya_yolu)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'ogrenci_id' => $ogrenci_id,
        'tarih' => $tarih,
        'baslik' => $baslik,
        'icerik' => $icerik,
        'dosya_yolu' => $dosya_yolu
    ]);

    echo json_encode(["status" => "ok"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
