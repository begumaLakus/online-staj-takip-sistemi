<?php
header("Content-Type: application/json");

// PostgreSQL bağlantısı
$host = "localhost";
$port = "5432";
$dbname = "online_staj";
$user = "postgres";
$password = "hamza1357";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Veritabanı bağlantısı başarısız: " . $e->getMessage()]);
    exit;
}

// POST verilerini al
$email = $_POST['email'] ?? '';
$sifre = $_POST['password'] ?? '';

if (!$email || !$sifre) {
    echo json_encode(["status" => "error", "message" => "Veriler eksik."]);
    exit;
}

// Öğrenci kontrolü
$sqlOgrenci = "SELECT * FROM ogrenciler WHERE email = :email AND sifre = :sifre";
$stmtOgrenci = $pdo->prepare($sqlOgrenci);
$stmtOgrenci->execute(['email' => $email, 'sifre' => $sifre]);
$ogrenci = $stmtOgrenci->fetch(PDO::FETCH_ASSOC);

if ($ogrenci) {
    echo json_encode([
        "status" => "ok",
        "role" => "ogrenci",
        "redirect" => "ogrenci-panel/ogrenci-arayuz.html",
        "ogrenci_id" => $ogrenci['id']  // <== öğrenci id'si frontende gönderildi
    ]);
    exit;
}

// Danışman kontrolü
$sqlDanisman = "SELECT * FROM danismanlar WHERE email = :email AND sifre = :sifre";
$stmtDanisman = $pdo->prepare($sqlDanisman);
$stmtDanisman->execute(['email' => $email, 'sifre' => $sifre]);
$danisman = $stmtDanisman->fetch(PDO::FETCH_ASSOC);

if ($danisman) {
    echo json_encode([
        "status" => "ok",
        "role" => "danisman",
        "redirect" => "danisman-panel.html"
    ]);
    exit;
}

// Eşleşme yoksa
echo json_encode(["status" => "error", "message" => "Geçersiz kullanıcı bilgileri."]);
?>
