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

// GET'ten danışman id'yi al
$danisman_id = $_GET["id"] ?? null;

if (!$danisman_id) {
    echo json_encode(["status" => "error", "message" => "Danışman ID eksik."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, isim, email, unvan FROM danismanlar WHERE id = :id");
    $stmt->execute([":id" => $danisman_id]);
    $danisman = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($danisman) {
        echo json_encode(["status" => "ok", "data" => $danisman]);
    } else {
        echo json_encode(["status" => "error", "message" => "Danışman bulunamadı."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Sorgu hatası: " . $e->getMessage()]);
    exit;
}
