<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
$final_not = $data["finalNote"] ?? null;

if (!$ogrenci_id || !$final_not) {
    echo json_encode(["status" => "error", "message" => "Eksik veri."]);
    exit;
}

try {
    $sql = "UPDATE ogrenciler SET final_not = :not WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":not" => $final_not,
        ":id" => $ogrenci_id
    ]);

    echo json_encode(["status" => "ok", "message" => "Final not başarıyla kaydedildi."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB hatası: " . $e->getMessage()]);
    exit;
}
?>
